import { NextApiRequest } from "next";
import jwt from "jsonwebtoken";
import { jwtPayload } from "@/types/jwt";

export function verifyToken(req: NextApiRequest): jwtPayload | null {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) return null;

        const token = authHeader.split(" ")[1]; 

        if (!token) return null;

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as jwtPayload;


        return decoded;

    } catch (error) {
        return null;
    }
}