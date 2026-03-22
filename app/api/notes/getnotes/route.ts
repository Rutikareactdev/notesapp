import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET(req: Request) {
    try {

        const userId = req.headers.get("user-id");

        const notes = await prisma.notes.findMany({
            where: {
                userId: userId ?? undefined,
            }
        });
        return NextResponse.json({
            message: "Fetch succesfully",
            data: notes,
        }, { status: 200 })

    } catch (err) {
        return NextResponse.json({
            message: "Internal server error"
        }, { status: 500 })
    }
}