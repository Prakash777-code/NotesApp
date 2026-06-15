import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";
import { Notes } from "@/types/notes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const [rows] = await db.query("SELECT * FROM notes WHERE id=?", [id]);

      const notes = rows as Notes[];

      if (notes.length === 0) {
        return res.status(404).json({
          message: "Note not found",
        });
      }

      return res.status(200).json(notes[0]);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Unable to fetch note",
      });
    }
  }

  if(req.method === "PUT"){

    const {title, content} = req.body

    if(!title || !content){
        return res.status(400).json({
            message:"Title and Content required"
        })
    }

    try{
        const [result]:any = await db.query(
            "UPDATE notes SET title=?, content=? WHERE id=?",
            [title,content,id]
        )

        if(result.affectedRows === 0){
            return res.status(404).json({
                message:"Note not found"
            })
        }

        return res.status(200).json({
            message:"Note updated"
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            message:"Failed to update note"
        })
    }
  }

  if(req.method === "DELETE"){

    try{
        const [result]:any = await db.query(
            "DELETE FROM notes WHERE id=?",
            [id]
        )

        if(result.affectedRows === 0){
            return res.status(404).json({
                message:"Note not found"
            })
        }

        return res.status(200).json({
            message:"Note deleted"
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            message:"Failed to delete note"
        })
    }
  }

  return res.status(405).json({
    message:"Method not allowed"
  })
}
