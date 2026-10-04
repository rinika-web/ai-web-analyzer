import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"


export async function GET(req) {
    

    try {

        // Get JWT

        const authHeader =
            req.headers.get("authorization")


        if (!authHeader) {

            return Response.json(
                {
                    error: "Unauthorized"
                },
                {
                    status: 401
                }
            )

        }


        const token =
            authHeader.split(" ")[1]


        const user =
            verifyToken(token)


        if (!user) {

            return Response.json(
                {
                    error: "Invalid token"
                },
                {
                    status: 401
                }
            )

        }



        // Get user analyses


        const analyses =
            await prisma.analysis.findMany({

                where: {
                    userId: user.userId
                },

                orderBy: {
                    createdAt: "desc"
                },

                take: 5

            })



        // Total count

        const total =
            await prisma.analysis.count({

                where: {
                    userId: user.userId
                }

            })



        // Average score

        const average =
            await prisma.analysis.aggregate({

                where: {
                    userId: user.userId
                },

                _avg: {
                    overallScore: true
                }

            })



        return Response.json({

            total,

            averageScore:
                Math.round(
                    average._avg.overallScore || 0
                ),

            recent: analyses

        })


    }
    catch (error) {

        return Response.json(
            {
                error: error.message
            },
            {
                status: 500
            }
        )

    }

}