import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function DELETE(req, { params }) {

    try {

        const authHeader = req.headers.get("authorization");

        if (!authHeader) {
            return Response.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const token = authHeader.split(" ")[1];

        const user = verifyToken(token);

        if (!user) {
            return Response.json(
                { error: "Invalid token" },
                { status: 401 }
            );
        }

          const { id } = await params;

    const analysisId = Number(id); 
        const analysis = await prisma.analysis.findUnique({
            where: {
                id: analysisId
            }
        });

        if (!analysis) {

            return Response.json(
                { error: "Analysis not found" },
                { status: 404 }
            );

        }

        // Security check

        if (analysis.userId !== user.userId) {

            return Response.json(
                { error: "Forbidden" },
                { status: 403 }
            );

        }

        await prisma.analysis.delete({

            where: {
                id: analysisId
            }

        });

        return Response.json({

            message: "Analysis deleted"

        });

    }
    catch (error) {

        return Response.json(
            {
                error: error.message
            },
            {
                status: 500
            }
        );

    }

}