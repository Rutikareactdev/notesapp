import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { error } from "console";

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { name, email } = body;

        if (!name || !email) {
            return NextResponse.json({ error: "All fields are required" },
                { status: 400 })

        }
        const userId = req.headers.get("user-id");

        if (!userId) {
            return NextResponse.json({
                message: "Unauthorized user"
            }, { status: 200 })
        }


        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                name: name,
                email: email,
            }
        })


        return NextResponse.json({
            message: "Updated successfully"
        }, { status: 200 })

    } catch (err) {
        return NextResponse.json({
            message: err
        }, { status: 500 })
    }
}