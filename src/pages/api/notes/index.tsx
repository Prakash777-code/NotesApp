import db from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { Notes } from "@/types/notes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method == "GET") {
    try {
      const [rows] = await db.query("SELECT * FROM notes");
      res.status(200).json(rows as Notes[]);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        mesaage: "Failed to fetch notes",
      });
    }
  }

  if (req.method === "POST") {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and Content are required",
      });
    }

    try {
      await db.query("INSERT INTO notes (title, content) VALUES (?,?)", [
        title,
        content,
      ]);

      return res.status(201).json({
        message: "Note created",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Failed to create note",
      });
    }
  }

}
