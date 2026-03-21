import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"


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




export async function POST(req: Request) {
  try {

    const formData = await req.formData()
    const files = formData.getAll("file") as File[]

    const uploadResults = []

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer())

      const command = new PutObjectCommand({
        Bucket: "amzn-notesapp-private",
        Key: `uploads/usernotes/${file.name}`,
        Body: buffer,
        ContentType: file.type
      })

      const result = await s3Client.send(command)
      uploadResults.push(result)
    }



    return NextResponse.json({
      message: "Files uploaded successfully",
      count: uploadResults.length,
    })

  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: error }, { status: 500 })
  }
}

