import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"


export async function GET(req){

    try{


        // Get authorization header

        const authHeader =
        req.headers.get("authorization")


        if(!authHeader){

            return Response.json(
                {
                    error:"Unauthorized"
                },
                {
                    status:401
                }
            )

        }



        const token =
        authHeader.split(" ")[1]



        const user =
        verifyToken(token)



        if(!user){

            return Response.json(
                {
                    error:"Invalid token"
                },
                {
                    status:401
                }
            )

        }




        // Fetch all reports


        const history =
        await prisma.analysis.findMany({

            where:{
                userId:user.userId
            },

            orderBy:{
                createdAt:"desc"
            },


            include:{
                issues:true,
                recommendations:true
            }

        })




        return Response.json({

            history

        })



    }
    catch(error){


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