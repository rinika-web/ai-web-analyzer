import * as cheerio from "cheerio"
import puppeteer from "puppeteer"

import { getPageSpeed } from "@/lib/pagespeed"

import { getScores } from "@/lib/analyzer/scores"
import { getMetrics } from "@/lib/analyzer/metrics"
import { getSeoData } from "@/lib/analyzer/seo"
import { getLinks } from "@/lib/analyzer/links"
import { getIssues } from "@/lib/analyzer/issues"
import { getRecommendations } from "@/lib/analyzer/recommendations"

export async function POST(req) {
    let browser

    try {

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

        // Screenshot
        const fileName = `website-${Date.now()}.png`

        await page.screenshot({
            path: `public/${fileName}`,
            fullPage: false
        })

        const loadTime = Date.now() - start

        // Analyzer modules
        const scores = getScores(lighthouse.categories)

        const metrics = getMetrics(lighthouse.audits)

        const seo = getSeoData($, title)

        const links = getLinks($)

        // Count missing ALT text
        let missingAltCount = 0

        $("img").each((_, img) => {

            if (!$(img).attr("alt")) {
                missingAltCount++
            }

        })

        const issues = getIssues({
            ...seo,
            missingAltCount
        })

        const recommendations =
            getRecommendations(lighthouse.audits)

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

            recommendations,

            issues,

            screenshot: `/${fileName}`

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