import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
         const formData = await req.formData();

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const tags = formData.get("tags") as string;
    const summary = formData.get("summary") as string;

    const files = formData.getAll("file") as File[];

    if (!title || !content || !tags) {
      return NextResponse.json(
        { message: "fields are required" },
        { status: 401 }
      );
    }

        const filepaths: string[]= [];
        
        files.forEach((f)=>filepaths.push(f.name))

        const userId = req.headers.get("user-id");
        const note = await prisma.notes.create({
            data: {
                title,
                content,
                tags,
                summary,
                filePaths:filepaths,
                userId: userId ?? undefined,
            },
        });

        return NextResponse.json({
            message: "Notes created sucessfully",
        }, { status: 201 })

    } catch (err) {
        console.log(err)
        return NextResponse.json({
            message: "Internal server error",
        }, { status: 500 })
    }
}