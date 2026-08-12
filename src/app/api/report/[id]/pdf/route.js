import { launchBrowser } from "@/lib/browser";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req, { params }) {
    let browser;

    try {
        // =========================
        // 1. Authentication
        // =========================

        const authHeader = req.headers.get("authorization");

        if (!authHeader) {
            return Response.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return Response.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = verifyToken(token);

        if (!user) {
            return Response.json(
                { error: "Invalid token" },
                { status: 401 }
            );
        }


        // =========================
        // 2. Get ID
        // =========================

        const { id } = await params;

        const analysisId = Number(id);

        if (Number.isNaN(analysisId)) {
            return Response.json(
                { error: "Invalid report ID" },
                { status: 400 }
            );
        }


        // =========================
        // 3. Get Analysis
        // =========================

        const analysis = await prisma.analysis.findUnique({
            where: {
                id: analysisId
            },

            include: {
                issues: true,
                recommendations: true
            }
        });


        if (!analysis) {
            return Response.json(
                { error: "Report not found" },
                { status: 404 }
            );
        }


        // =========================
        // 4. Security
        // =========================

        if (analysis.userId !== user.userId) {
            return Response.json(
                { error: "Access denied" },
                { status: 403 }
            );
        }


        // =========================
        // 5. AI Summary
        // =========================

        const ai = analysis.aiSummary;


        // =========================
        // 6. Create HTML
        // =========================

        const html = `
        <!DOCTYPE html>

        <html>

        <head>

            <meta charset="UTF-8" />

            <title>AI Website Analyzer Report</title>

            <style>

                body {
                    font-family: Arial, sans-serif;
                    padding: 40px;
                    color: #222;
                }

                h1 {
                    font-size: 30px;
                    margin-bottom: 5px;
                }

                h2 {
                    margin-top: 30px;
                    border-bottom: 1px solid #ddd;
                    padding-bottom: 8px;
                }

                h3 {
                    margin-top: 20px;
                }

                .url {
                    color: #666;
                    margin-bottom: 30px;
                    word-break: break-all;
                }

                .scores {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 15px;
                    margin: 25px 0;
                }

                .score {
                    border: 1px solid #ddd;
                    border-radius: 10px;
                    padding: 18px;
                }

                .score-title {
                    color: #666;
                    font-size: 14px;
                }

                .score-value {
                    font-size: 30px;
                    font-weight: bold;
                    margin-top: 8px;
                }

                .health {
                    padding: 20px;
                    background: #f5f5f5;
                    border-radius: 10px;
                    margin: 25px 0;
                }

                .issue,
                .recommendation {
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 12px;
                    margin-bottom: 10px;
                }

                .ai {
                    background: #f3e8ff;
                    padding: 25px;
                    border-radius: 12px;
                    margin-top: 30px;
                }

                ul {
                    line-height: 1.7;
                }

            </style>

        </head>

        <body>

            <h1>AI Website Analyzer Report</h1>

            <p class="url">
                ${analysis.url}
            </p>


            <div class="scores">

                <div class="score">
                    <div class="score-title">
                        Overall
                    </div>

                    <div class="score-value">
                        ${analysis.overallScore}
                    </div>
                </div>


                <div class="score">
                    <div class="score-title">
                        SEO
                    </div>

                    <div class="score-value">
                        ${analysis.seoScore}
                    </div>
                </div>


                <div class="score">
                    <div class="score-title">
                        Performance
                    </div>

                    <div class="score-value">
                        ${analysis.performanceScore}
                    </div>
                </div>


                <div class="score">
                    <div class="score-title">
                        Accessibility
                    </div>

                    <div class="score-value">
                        ${analysis.accessibilityScore}
                    </div>
                </div>

            </div>


            <div class="health">

                <h2>Website Health</h2>

                <p>
                    Health:
                    <strong>${analysis.health}</strong>
                </p>

                <p>
                    Grade:
                    <strong>${analysis.grade}</strong>
                </p>

                <p>
                    Best Practices:
                    <strong>${analysis.bestPracticesScore}</strong>
                </p>

            </div>


            ${
                ai
                    ? `
                    <div class="ai">

                        <h2>🤖 AI Expert Analysis</h2>

                        <h3>Summary</h3>

                        <p>
                            ${ai.summary || ""}
                        </p>


                        <h3>Strengths</h3>

                        <ul>

                            ${
                                (ai.strengths || [])
                                    .map(
                                        item =>
                                            `<li>${item}</li>`
                                    )
                                    .join("")
                            }

                        </ul>


                        <h3>
                            Highest Priority Improvements
                        </h3>

                        <ul>

                            ${
                                (ai.priorities || [])
                                    .map(
                                        item =>
                                            `<li>${item}</li>`
                                    )
                                    .join("")
                            }

                        </ul>


                        <h3>
                            Final Recommendation
                        </h3>

                        <p>
                            ${ai.recommendation || ""}
                        </p>

                    </div>
                    `
                    : ""
            }


            <h2>Issues</h2>

            ${
                analysis.issues.length > 0
                    ? analysis.issues
                        .map(
                            issue => `
                                <div class="issue">

                                    <strong>
                                        ${issue.category}
                                    </strong>

                                    <p>
                                        ${issue.message}
                                    </p>

                                    <small>
                                        Severity:
                                        ${issue.severity}
                                    </small>

                                </div>
                            `
                        )
                        .join("")
                    : "<p>No issues found.</p>"
            }


            <h2>Recommendations</h2>

            ${
                analysis.recommendations.length > 0
                    ? analysis.recommendations
                        .map(
                            recommendation => `
                                <div class="recommendation">

                                    <strong>
                                        ${recommendation.title}
                                    </strong>

                                    <p>
                                        ${recommendation.description}
                                    </p>

                                </div>
                            `
                        )
                        .join("")
                    : "<p>No recommendations found.</p>"
            }


        </body>

        </html>
        `;


        // =========================
        // 7. Puppeteer
        // =========================

        browser = await launchBrowser();

        const page = await browser.newPage();


        // IMPORTANT:
        // We are NOT opening /report/${id}
        // anymore.

        await page.setContent(html, {
            waitUntil: "networkidle0"
        });


        // =========================
        // 8. Generate PDF
        // =========================

        const pdf = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "20px",
                right: "20px",
                bottom: "20px",
                left: "20px"
            }
        });


        // =========================
        // 9. Return PDF
        // =========================

        return new Response(pdf, {
            headers: {
                "Content-Type": "application/pdf",

                "Content-Disposition":
                    `attachment; filename="report-${analysisId}.pdf"`,

                "Content-Length":
                    String(pdf.length)
            }
        });


    } catch (error) {

        console.error(
            "PDF GENERATION ERROR:",
            error
        );

        return Response.json(
            {
                error: error.message
            },
            {
                status: 500
            }
        );

    } finally {

        if (browser) {
            await browser.close();
        }

    }
}