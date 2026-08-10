import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(req) {
    try {

        const body = await req.json();

        // Validate request
        const result = registerSchema.safeParse(body);

        if (!result.success) {

            return Response.json(
                {
                    error: result.error.issues[0].message
                },
                {
                    status: 400
                }
            );

        }

        const { name, email, password } = result.data;


        // Check existing user
        const existingUser =
            await prisma.user.findUnique({
                where: {
                    email
                }
            });


        if (existingUser) {

            return Response.json(
                {
                    error: "User already exists"
                },
                {
                    status: 400
                }
            );

        }


        // Hash password
        const hashedPassword =
            await bcrypt.hash(password, 10);


        // Create user
        const user =
            await prisma.user.create({

                data: {
                    name,
                    email,
                    password: hashedPassword
                }

            });


        // Create JWT
        const token =
            jwt.sign(
                {
                    userId: user.id,
                    email: user.email
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "7d"
                }
            );


        return Response.json({

            message: "User created",
            token

        });


    } catch (error) {

        console.error("REGISTER ERROR:", error);

        return Response.json(
            {
                error: "Something went wrong"
            },
            {
                status: 500
            }
        );

    }
}