import * as cheerio from "cheerio"
import puppeteer from "puppeteer"

import { getPageSpeed } from "@/lib/pagespeed"

import { getScores } from "@/lib/analyzer/scores"
import { getMetrics } from "@/lib/analyzer/metrics"
import { getSeoData } from "@/lib/analyzer/seo"
import { getLinks } from "@/lib/analyzer/links"
import { getIssues } from "@/lib/analyzer/issues"
import { getRecommendations } from "@/lib/analyzer/recommendations"
import { takeScreenshot } from "@/lib/analyzer/screenshot"
import { getSummary } from "@/lib/analyzer/summary"
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(req) {
    let browser

    try {
const authHeader = req.headers.get("authorization");
if (!authHeader) {
    return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
    );
}
if (!authHeader.startsWith("Bearer ")) {
    return Response.json(
        { error: "Invalid authorization format" },
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
        // Validate URL
        const { url } = await req.json()
        new URL(url)

        // Launch browser
        browser = await puppeteer.launch({
            headless: true
        })

        const page = await browser.newPage()

        await page.setViewport({
            width: 1920,
            height: 1080
        })

        const start = Date.now()

        await page.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: 25000
        })

        // Lighthouse
        const pageSpeed = await getPageSpeed(url)

        const lighthouse = pageSpeed.lighthouseResult

        // HTML
        const html = await page.content()

        const $ = cheerio.load(html)

        const title = await page.title()

       const screenshot = await takeScreenshot(page)

        const loadTime = Date.now() - start

        // Analyzer modules
       
        const scores = getScores(lighthouse.categories)

        const metrics = getMetrics(lighthouse.audits)

        const seo = getSeoData($, title)

        const links = getLinks($)

        const issues = getIssues({
            ...seo,
        })

        const recommendations =
            getRecommendations(lighthouse.audits)
 const summary = getSummary({
    scores,
    issues,
    recommendations
})


const analysis = await prisma.analysis.create({
    data: {

        url,

        screenshot,

        overallScore: scores.overall.score,

        seoScore: scores.seo.score,

        performanceScore: scores.performance.score,

        accessibilityScore: scores.accessibility.score,

        bestPracticesScore: scores.bestPractices.score,


        grade: scores.overall.grade,

        health: scores.overall.health,


        userId: user.userId

    }
})

await prisma.issue.createMany({

    data: issues.map((issue)=>({

        category: issue.category,

        severity: issue.severity,

        message: issue.message,

        analysisId: analysis.id

    }))

})

await prisma.recommendation.createMany({

    data: recommendations.map((rec)=>({

        title: rec.title,

        description: rec.description,

        score: rec.score,

        displayValue: rec.displayValue,

        savingsMs: rec.savingsMs,

        savingsBytes: rec.savingsBytes,

        learnMore: rec.learnMore,

        analysisId: analysis.id

    }))

})


        // Response
        return Response.json({

            overall: scores.overall,

            seo: scores.seo,

            performance: scores.performance,

            accessibility: scores.accessibility,

            bestPractices: scores.bestPractices,

            details: {

                seo: {

                    ...seo,

                    loadTime

                },

                metrics,

                links

            },
            summary,

            recommendations,

            issues,

             screenshot

        })

    } catch (error) {

        return Response.json(

            {
                error:
                    error.message ||
                    "Invalid URL or failed to analyze website"
            },

            {
                status: 400
            }

        )

    } finally {

        if (browser) {
            await browser.close()
        }

    }
}