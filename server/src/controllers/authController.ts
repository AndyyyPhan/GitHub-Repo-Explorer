import { Request, Response } from "express";
import pool from "../db.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface RegisterBody {
  email: string;
  password: string;
}

export async function register(req: Request, res: Response): Promise<void> {
  let { email, password }: RegisterBody = req.body;

  email = email.trim().toLowerCase();

  if (!email || !password) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  if (!validator.isEmail(email)) {
    res.status(400).json({ error: "Invalid email format" });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters" });
    return;
  }

  if (
    !/[A-Z]/.test(password) ||
    !/[a-z]/.test(password) ||
    !/[0-9]/.test(password)
  ) {
    res.status(400).json({
      error: "Password must contain uppercase, lowercase, and number",
    });
    return;
  }

  try {
    const existingUserResult = await pool.query(
      `SELECT * FROM users WHERE email = $1 LIMIT 1`,
      [email],
    );

    if (existingUserResult.rows.length > 0) {
      res.status(409).json({ error: "Email already in use" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email`,
      [email, hashedPassword],
    );

    const newUser = result.rows[0];

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" },
    );

    res.status(201).json({
      message: "User registered succesfully",
      user: { id: newUser.id, email: newUser.email },
      token,
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Failed to register user" });
  }
}

interface LoginBody {
  email: string;
  password: string;
}

export async function login(req: Request, res: Response): Promise<void> {
  let { email, password }: LoginBody = req.body;
  email = email.trim().toLowerCase();

  if (!email || !password) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  try {
    const existingUserResult = await pool.query(
      `SELECT id, email, password FROM users WHERE email = $1`,
      [email],
    );

    const existingUser = existingUserResult.rows[0];

    if (
      !existingUser ||
      !(await bcrypt.compare(password, existingUser.password))
    ) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" },
    );

    res.status(200).json({
      message: "Login successful",
      user: { id: existingUser.id, email: existingUser.email },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Failed to login" });
  }
}
