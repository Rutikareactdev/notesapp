import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const { notesId } = body;

        const existingNote = await prisma.notes.findUnique({
            where: { id: notesId },
        });

        if(!existingNote)
        {
           return NextResponse.json({
            message: "Not found notes to delete"
        }, { status: 200 })   
        }

        await prisma.notes.delete({
            where: { id: notesId },
        })

        return NextResponse.json({
            message: "Notes deleted successfully"
        }, { status: 200 })

    } catch (err) {
        return NextResponse.json({
            message: "Internal server error"
        }, { status: 500 })
    }
}