import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {

    if(req.method !== "POST"){
        return res.status(405).json({
            message:"Method not allowed"
        })
    }

    const cookie = serialize("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });

  res.setHeader("Set-Cookie", cookie)

  return res.status(200).json({
    message:"Logged out successfully"
  })
    
}