import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";
import { Notes } from "@/types/notes";
import { verifyToken } from "@/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;

  const user = verifyToken(req)
  if(!user){
    return res.status(401).json({
        message:"Unauthorized"
    })
  }

  if (req.method === "GET") {
    try {
      const [rows] = await db.query("SELECT * FROM notes WHERE id=? AND user_id=?", [id,user.userId]);

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
            "UPDATE notes SET title=?, content=? WHERE id=? AND user_id=?",
            [title,content,id,user.userId]
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
            "DELETE FROM notes WHERE id=? AND user_id=?",
            [id,user.userId]
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
}
