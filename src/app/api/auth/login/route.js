import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { loginSchema } from "@/lib/validations/auth";

export async function POST(req) {

    try {

        const body = await req.json();


        // Validate input
        const result =
            loginSchema.safeParse(body);


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


        const { email, password } =
            result.data;


        // Find user
        const user =
            await prisma.user.findUnique({

                where: {
                    email
                }

            });


        if (!user) {

            return Response.json(
                {
                    error: "User not found"
                },
                {
                    status: 404
                }
            );

        }


        // Check password
        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            return Response.json(
                {
                    error: "Invalid password"
                },
                {
                    status: 401
                }
            );

        }


        // Create token
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

            message: "Login successful",
            token

        });


    } catch (error) {

        console.error("LOGIN ERROR:", error);

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