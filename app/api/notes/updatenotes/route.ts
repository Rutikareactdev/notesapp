import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

if (!accessKeyId || !secretAccessKey) {
  throw new Error("Missing AWS credentials");
}

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId,
    secretAccessKey
  }
});

export const deleteFileFromS3 = async (key: string) => {
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: 'amzn-notesapp-private',
      Key: key,
    })
  );
};

export async function PATCH(req: Request) {
  try {
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const tags = formData.get("tags") as string;
    const summary = formData.get("summary") as string;
    const notesId = formData.get("notesId") as string;

    //  parse removed files
    const removedFiles = JSON.parse(
      (formData.get("removedFiles") as string) || "[]"
    );

    const files = formData.getAll("file") as File[];

    // ⚠️ Assume files already uploaded → names are keys
    const newFilePaths = files.map((f) => f.name);

    const existingNote = await prisma.notes.findUnique({
      where: { id: notesId },
    });

    if (!existingNote) {
      return NextResponse.json(
        { message: "Existing note not found" },
        { status: 404 }
      );
    }

    let updatedFilePaths = existingNote.filePaths || [];

    //  remove deleted files from DB
    if (removedFiles.length > 0) {
      updatedFilePaths = updatedFilePaths.filter(
        (path: string) => !removedFiles.includes(path)
      );
    }

    // add new files
    if (newFilePaths.length > 0) {
      updatedFilePaths = [...updatedFilePaths, ...newFilePaths];
    }


    const updateData: any = {};
    const parsedTags = JSON.parse(tags);

    if (title !== existingNote.title) updateData.title = title;
    if (content !== existingNote.content) updateData.content = content;
    if (summary !== existingNote.summary) updateData.summary = summary;

    if (
      JSON.stringify(parsedTags) !== JSON.stringify(existingNote.tags)
    ) {
      updateData.tags = parsedTags;
    }

    if (
      JSON.stringify(updatedFilePaths) !== JSON.stringify(existingNote.filePaths)
    ) {
      updateData.filePaths = updatedFilePaths;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: "Nothing to update" });
    }

    await prisma.notes.update({
      where: { id: notesId },
      data: updateData,
    });

    // ✅ delete from S3 AFTER DB update
    if (removedFiles.length > 0) {
      for (const key of removedFiles) {
        await deleteFileFromS3(key);
      }
    }

    return NextResponse.json(
      { message: "Notes updated successfully" },
      { status: 200 }
    );

  } catch (err) {
    console.log(err);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}