import { generateAISummary } from "@/lib/gemini";

export async function GET() {

    const result = await generateAISummary({

        url: "https://github.com",

        overallScore: 82,

        seo: 100,

        performance: 45,

        accessibility: 98,

        bestPractices: 96,

        issues: [
            "Large JavaScript bundle",
            "Unused CSS"
        ]

    });


    return Response.json({
        ai: result
    });

}