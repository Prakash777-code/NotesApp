import db from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { Notes } from "@/types/notes";
import { verifyToken } from "@/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {

  const user = verifyToken(req)

  if(!user){
    return res.status(401).json({
      messgae:"Unauthorized"
    })
  }


  if (req.method == "GET") {
    try {
      const [rows] = await db.query("SELECT * FROM notes WHERE user_id=?", [user.userId])
      res.status(200).json(rows as Notes[]);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Failed to fetch notes",
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
      await db.query("INSERT INTO notes (title, content, user_id) VALUES (?,?,?)", [
        title,
        content,
        user.userId
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
