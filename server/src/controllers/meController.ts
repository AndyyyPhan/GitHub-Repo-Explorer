import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware.js";
import pool from "../db.js";

export async function getFavorites(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  // If we reach here, token is already valid and req.user exists
  // because middleware already handled invalid / missing tokens
  const userId = req.user!.userId;

  try {
    const { rows } = await pool.query(
      `SELECT * FROM favorites WHERE user_id = $1`,
      [userId],
    );

    res.json({ favorites: rows });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
}

// Define what the request body should look like
interface AddFavoriteBody {
  repo_id: number;
  repo_name: string;
  repo_url: string;
  description?: string;
  language?: string;
  stars_count?: number;
}

export async function addFavorite(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  const userId = req.user!.userId;
  const {
    repo_id,
    repo_name,
    repo_url,
    description,
    language,
    stars_count,
  }: AddFavoriteBody = req.body;

  // Validates required fields
  if (!repo_id || !repo_name || !repo_url) {
    res
      .status(400)
      .json({ error: "Missing required fields: repo_id, repo_name, repo_url" });
    return;
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO favorites (user_id, repo_id, repo_name, repo_url, description, language, stars_count)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
      [
        userId,
        repo_id,
        repo_name,
        repo_url,
        description || null,
        language || null,
        stars_count || 0,
      ],
    );

    res.status(201).json({ favorite: rows[0] });
  } catch (err: any) {
    // Handle duplicate favorite (unique constraint violation)
    if (err.code === "23505") {
      res.status(409).json({ error: "Repo already in favorites" });
      return;
    }

    console.error("Error adding favorite:", err);
    res.status(500).json({ error: "Failed to add favorite" });
  }
}

export async function removeFavorite(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  const userId = req.user!.userId;
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: "Favorite repo ID is required" });
    return;
  }

  try {
    const { rowCount } = await pool.query(
      `DELETE FROM favorites WHERE id = $1 AND user_id = $2`,
      [id, userId],
    );

    if (rowCount === 0) {
      res.status(404).json({ error: "Favorite repo not found" });
      return;
    }

    res.status(200).json({ message: "Favorite repo removed" });
  } catch (err) {
    console.error("Error removing favorite repo:", err);
    res.status(500).json({ error: "Failed to remove favorite repo" });
  }
}
