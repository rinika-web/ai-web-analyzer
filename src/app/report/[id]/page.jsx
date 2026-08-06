import { prisma } from "@/lib/prisma";

export default async function ReportPage({ params }) {

    const { id } = await params;

    const analysis = await prisma.analysis.findUnique({

        where: {
            id: Number(id),
        },

        include: {
            issues: true,
            recommendations: true,
        },

    });

    if (!analysis) {
    return Response.json(
        { error: "Report not found" },
        { status: 404 }
    );
}

 if (!analysis) {
        return <h1>Report not found</h1>;
    }



    return (

        <div style={{ padding: "40px", fontFamily: "Arial" }}>

            <h1>AI Website Analyzer Report</h1>

            <hr />

            <h2>{analysis.url}</h2>

            <p>Overall Score: {analysis.overallScore}</p>

            <p>SEO Score: {analysis.seoScore}</p>

            <p>Performance Score: {analysis.performanceScore}</p>

            <p>Accessibility Score: {analysis.accessibilityScore}</p>

            <p>Best Practices Score: {analysis.bestPracticesScore}</p>

            <hr />

            <h2>Issues</h2>

            <ul>
                {analysis.issues.map((issue) => (
                    <li key={issue.id}>
                        {issue.message}
                    </li>
                ))}
            </ul>

            <hr />

            <h2>Recommendations</h2>

            <ul>
                {analysis.recommendations.map((rec) => (
                    <li key={rec.id}>
                        {rec.title}
                    </li>
                ))}
            </ul>

        </div>

    );
}   