import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export async function POST(req){

    try{

        //const {email,password}=await req.json();

const body = await req.json();
console.log(body);

const { email, password } = body;

        const user = await prisma.user.findUnique({
            where:{
                email
            }
        });


        if(!user){

            return Response.json(
                {
                    error:"User not found"
                },
                {
                    status:404
                }
            )

        }


        const passwordMatch =
        await bcrypt.compare(
            password,
            user.password
        );


        if(!passwordMatch){

            return Response.json(
                {
                    error:"Invalid password"
                },
                {
                    status:401
                }
            )

        }


        const token = jwt.sign(
            {
                userId:user.id,
                email:user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"7d"
            }
        );


        return Response.json({

            message:"Login successful",

            token

        });


    }catch(error){

        return Response.json(
            {
                error:error.message
            },
            {
                status:500
            }
        )

    }

}