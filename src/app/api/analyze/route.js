import * as cheerio from "cheerio";
import crypto from "crypto";

import { launchBrowser } from "@/lib/browser";
import { getPageSpeed } from "@/lib/pagespeed";

import { getScores } from "@/lib/analyzer/scores";
import { getMetrics } from "@/lib/analyzer/metrics";
import { getSeoData } from "@/lib/analyzer/seo";
import { getLinks } from "@/lib/analyzer/links";
import { getIssues } from "@/lib/analyzer/issues";
import { getRecommendations } from "@/lib/analyzer/recommendations";
import { takeScreenshot } from "@/lib/analyzer/screenshot";
import { getSummary } from "@/lib/analyzer/summary";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { generateAISummary } from "@/lib/gemini";
import { analyzeSchema } from "@/lib/validations/analyze";
import { rateLimit } from "@/lib/rateLimit";

import { measureStage } from "@/lib/analysisMetrics";

export async function POST(req) {
    let browser;

    // Step 1: Baseline instrumentation
    const requestId = crypto.randomUUID();
    const timings = {};
    const analysisStart = performance.now();

    try {
        const body = await req.json();

        const result =
            analyzeSchema.safeParse(body);

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

        const { url } = result.data;

        // Authentication

        const authHeader =
            req.headers.get("authorization");

        if (!authHeader) {
            return Response.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        if (!authHeader.startsWith("Bearer ")) {
            return Response.json(
                {
                    error: "Invalid authorization format"
                },
                {
                    status: 401
                }
            );
        }

        const token =
            authHeader.split(" ")[1];

        const user = verifyToken(token);

        if (!user) {
            return Response.json(
                { error: "Invalid token" },
                { status: 401 }
            );
        }

        // Rate limiting

        const limit =
            rateLimit(user.userId);

        if (!limit.allowed) {
            return Response.json(
                {
                    error:
                        "Too many analysis requests. Please try again later.",
                    retryAfter:
                        limit.retryAfter
                },
                {
                    status: 429,
                    headers: {
                        "Retry-After":
                            String(limit.retryAfter)
                    }
                }
            );
        }

        // --------------------------------------------------
        // Browser launch
        // --------------------------------------------------

        browser = await measureStage(
            timings,
            "browserLaunch",
            () => launchBrowser()
        );

        const page =
            await browser.newPage();

        await page.setViewport({
            width: 1920,
            height: 1080
        });

        // --------------------------------------------------
        // Website page load
        // --------------------------------------------------

        await measureStage(
            timings,
            "pageLoad",
            () =>
                page.goto(url, {
                    waitUntil:
                        "domcontentloaded",
                    timeout: 30000
                })
        );

        // --------------------------------------------------
        // Lighthouse / PageSpeed
        // --------------------------------------------------

        const pageSpeed =
            await measureStage(
                timings,
                "pageSpeed",
                () => getPageSpeed(url)
            );

        const lighthouse =
            pageSpeed.lighthouseResult;

        // --------------------------------------------------
        // HTML extraction
        // --------------------------------------------------

        const html =
            await measureStage(
                timings,
                "htmlExtraction",
                () => page.content()
            );

        const $ =
            cheerio.load(html);

        const title =
            await page.title();

        // --------------------------------------------------
        // Screenshot
        // --------------------------------------------------

        const screenshot =
            await measureStage(
                timings,
                "screenshot",
                () => takeScreenshot(page)
            );

        // --------------------------------------------------
        // Analyzer modules
        // --------------------------------------------------

        const analyzerResults =
            await measureStage(
                timings,
                "analyzers",
                async () => {

                    const scores =
                        getScores(
                            lighthouse.categories
                        );

                    const metrics =
                        getMetrics(
                            lighthouse.audits
                        );

                    const seo =
                        getSeoData(
                            $,
                            title
                        );

                    const links =
                        getLinks($);

                    const issues =
                        getIssues({
                            ...seo,
                        });

                    const recommendations =
                        getRecommendations(
                            lighthouse.audits
                        );

                    const summary =
                        getSummary({
                            scores,
                            issues,
                            recommendations
                        });

                    return {
                        scores,
                        metrics,
                        seo,
                        links,
                        issues,
                        recommendations,
                        summary
                    };
                }
            );

        const {
            scores,
            metrics,
            seo,
            links,
            issues,
            recommendations,
            summary
        } = analyzerResults;

        // --------------------------------------------------
        // Gemini AI analysis
        // --------------------------------------------------

        const aiSummary =
            await measureStage(
                timings,
                "gemini",
                () =>
                    generateAISummary({

                        url,

                        overallScore:
                            scores.overall.score,

                        seo:
                            scores.seo.score,

                        performance:
                            scores.performance.score,

                        accessibility:
                            scores.accessibility.score,

                        bestPractices:
                            scores.bestPractices.score,

                        issues,

                        recommendations

                    })
            );

        // --------------------------------------------------
        // Database
        // --------------------------------------------------

        const analysis =
            await measureStage(
                timings,
                "database",
                async () => {

                    const analysis =
                        await prisma.analysis.create({
                            data: {

                                url,

                                screenshot,

                                overallScore:
                                    scores.overall.score,

                                seoScore:
                                    scores.seo.score,

                                performanceScore:
                                    scores.performance.score,

                                accessibilityScore:
                                    scores.accessibility.score,

                                bestPracticesScore:
                                    scores.bestPractices.score,

                                grade:
                                    scores.overall.grade,

                                health:
                                    scores.overall.health,

                                aiSummary,

                                userId:
                                    user.userId

                            }
                        });

                    await prisma.issue.createMany({
                        data:
                            issues.map(
                                (issue) => ({
                                    category:
                                        issue.category,

                                    severity:
                                        issue.severity,

                                    message:
                                        issue.message,

                                    analysisId:
                                        analysis.id
                                })
                            )
                    });

                    await prisma.recommendation.createMany({
                        data:
                            recommendations.map(
                                (rec) => ({
                                    title:
                                        rec.title,

                                    description:
                                        rec.description,

                                    score:
                                        rec.score,

                                    displayValue:
                                        rec.displayValue,

                                    savingsMs:
                                        rec.savingsMs,

                                    savingsBytes:
                                        rec.savingsBytes,

                                    learnMore:
                                        rec.learnMore,

                                    analysisId:
                                        analysis.id
                                })
                            )
                    });

                    return analysis;
                }
            );

        // --------------------------------------------------
        // Baseline measurement log
        // --------------------------------------------------

        const totalMs =
            Math.round(
                performance.now() -
                analysisStart
            );

        console.log(
            JSON.stringify({
                event:
                    "analysis_completed",

                requestId,

                userId:
                    user.userId,

                url,

                timings,

                totalMs
            })
        );

        // --------------------------------------------------
        // Response
        // --------------------------------------------------

        return Response.json({

            overall:
                scores.overall,

            seo:
                scores.seo,

            performance:
                scores.performance,

            accessibility:
                scores.accessibility,

            bestPractices:
                scores.bestPractices,

            details: {

                seo: {

                    ...seo,

                    loadTime:
                        timings.pageLoad

                },

                metrics,

                links

            },

            summary,

            recommendations,

            issues,

            aiSummary,

            screenshot

        });

    } catch (error) {

        const totalMs =
            Math.round(
                performance.now() -
                analysisStart
            );

        console.error(
            JSON.stringify({
                event:
                    "analysis_failed",

                requestId,

                timings,

                totalMs,

                error:
                    error instanceof Error
                        ? error.message
                        : String(error)
            })
        );

        console.log(
            "ANALYZE ERROR:",
            error
        );

        return Response.json(
            {
                error:
                    error.message ||
                    "Invalid URL or failed to analyze website"
            },
            {
                status: 400
            }
        );

    } finally {

        if (browser) {
            await browser.close();
        }

    }
}