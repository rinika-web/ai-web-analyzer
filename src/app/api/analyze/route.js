import * as cheerio from "cheerio"
import puppeteer from "puppeteer"
import { getPageSpeed } from "@/lib/pagespeed"
import { getMetrics } from "@/lib/analyzer/metrics"
import { getScores } from "@/lib/analyzer/scores"
import { getIssues } from "@/lib/analyzer/issues"
export async function POST(req) {
    let browser
    try {
        /*Validate URL*/

        const body = await req.json()

        const url = body.url

        new URL(url)

        /*Launch Puppeteer*/

        browser = await puppeteer.launch({
            headless: true
        })
        const page = await browser.newPage()

        await page.setViewport({
            width: 1920,
            height: 1080
        })

        //const start = Date.now()

        await page.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: 25000,
        })

        /*Fetch PageSpeed Insights*/

        const pageSpeed = await getPageSpeed(url)
        console.log(pageSpeed, "pagespeed data")

        const lighthouse = pageSpeed.lighthouseResult

const scores = getScores(lighthouse.categories)
const metrics = getMetrics(lighthouse.audits)


/*Extract Metrics

        function createMetric(audit, good, average) {
            return {
                value: audit.displayValue,
                status: metricStatus(
                    audit.numericValue,
                    good,
                    average
                )
            }
        }
        const audits = lighthouse.audits;

        const fcp = createMetric(
            audits["first-contentful-paint"],
            1800,
            3000
        )

        const lcp = createMetric(
            audits["largest-contentful-paint"],
            2500,
            4000
        )

        const cls = createMetric(
            audits["cumulative-layout-shift"],
            0.1,
            0.25
        )

        function metricStatus(value, good, average) {
            if (value <= good) return "Good"
            if (value <= average) return "Needs Improvement"
            return "Poor"
        }



        const speedIndexValue =
            audits["speed-index"].numericValue


        const speedIndex = {
            value:
                audits["speed-index"].displayValue,
            status:
                metricStatus(speedIndexValue, 3400, 5800)
        }

        const tbtValue =
            audits["total-blocking-time"].numericValue


        const tbt = {
            value:
                audits["total-blocking-time"].displayValue,
            status:
                metricStatus(tbtValue, 200, 600)
        }

        const ttiValue =
            audits["interactive"].numericValue


        const tti = {
            value:
                audits["interactive"].displayValue,
            status:
                metricStatus(ttiValue, 3800, 7300)
        }

        const ttfbValue =
            audits["server-response-time"].numericValue


        const ttfb = {
            value:
                audits["server-response-time"].displayValue,
            status:
                metricStatus(ttfbValue, 800, 1800)
        }
        const totalByteWeightValue =
            audits["total-byte-weight"].numericValue


        const totalByteWeight = {
            value:
                audits["total-byte-weight"].displayValue,
            status:
                metricStatus(totalByteWeightValue, 1600000, 3500000)
        }

        const domSize =
            audits["dom-size-insight"]?.displayValue

        const networkRequests =
            audits["network-requests"]?.details?.items?.length

        const renderBlocking =
            audits["render-blocking-insight"]?.displayValue

        const unusedCSS =
            audits["unused-css-rules"]?.displayValue

        const unusedJS =
            audits["unused-javascript"]?.displayValue

        const oversizedImages =
            audits["image-delivery-insight"]?.displayValue

        const cache =
            audits["cache-insight"]?.displayValue
*/

       // const loadTime = Date.now() - start

      
        /*Extract Scores*/

        const html = await page.content()
       // const title = await page.title()


        const $ = cheerio.load(html)

        const title = await page.title();

const htmlLang = $("html").attr("lang");
const hasLang = !!htmlLang;

const hasTitle = title.length > 0;

const h1 = $("h1").length;
const hasH1 = h1 > 0;

const metaDescription =
    $('meta[name="description"]').attr("content");

const hasMetaDescription = !!metaDescription;

const canonical =
    $('link[rel="canonical"]').attr("href");

const hasCanonical = !!canonical;

const twitterCard =
    $('meta[name="twitter:card"]').attr("content");

const ogTitle =
    $('meta[property="og:title"]').attr("content");

const ogDescription =
    $('meta[property="og:description"]').attr("content");

const ogImage =
    $('meta[property="og:image"]').attr("content");

const favicon =
    $('link[rel="icon"]').attr("href");

const robots =
    $('meta[name="robots"]').attr("content");

const structuredData =
    $('script[type="application/ld+json"]').length;

       // const issues = []


        //const htmlLang = $("html").attr("lang")

        //const hasLang = !!htmlLang


        //const hasTitle = title.length > 0

      //  const h1 = $("h1").length
        //const h2 = $("h2").length
        //const h3 = $("h3").length

   /*     const metaDescription =
            $('meta[name="description"]').attr("content")

        const canonical =
            $('link[rel="canonical"]').attr("href")

        const hasCanonical = !!canonical

        const twitterCard =
            $('meta[name="twitter:card"]').attr("content")

        const ogTitle =
            $('meta[property="og:title"]').attr("content")

        const ogDescription =
            $('meta[property="og:description"]').attr("content")

        const ogImage =
            $('meta[property="og:image"]').attr("content")


        const hasMetaDescription =
            !!metaDescription
*/


        //const hasH1 = h1 > 0

        //const imageCount = $("img").length
        //const scriptCount = $("script").length
        let internalLinks = 0
        let externalLinks = 0

        $("a").each((i, link) => {

            const href = $(link).attr("href")

            if (!href) return

            if (
                href.startsWith("/") ||
                href.startsWith("#")
            ) {
                internalLinks++
            } else {
                externalLinks++
            }

        })

        let missingAltCount = 0

        $("img").each((i, img) => {
            const alt = $(img).attr("alt")

            if (!alt) {
                missingAltCount++
            }
        })

        if (missingAltCount > 0) {
            issues.push(
                `${missingAltCount} images missing alt text`
            )
        }

      /*  const favicon =
            $('link[rel="icon"]').attr("href")
        const robots =
            $('meta[name="robots"]').attr("content")

        const structuredData =
            $('script[type="application/ld+json"]').length

/*

        console.log(lighthouse.categories);

       /* function categoryScore(name) {
            return Math.round(
                (lighthouse.categories[name]?.score ?? 0) * 100
            )
        }

        const seoScore = categoryScore("seo")

        const performanceScore = categoryScore("performance")

        const accessibilityScore = categoryScore("accessibility")


        const bestPracticesScore =
            categoryScore("best-practices")

        const overallScore = Math.round(
            (
                performanceScore +
                seoScore +
                accessibilityScore +
                bestPracticesScore
            ) / 4
        )
        function getGrade(score) {
            if (score >= 90) return "A"
            if (score >= 80) return "B"
            if (score >= 70) return "C"
            if (score >= 60) return "D"
            return "F"
        }
        const overallGrade = getGrade(overallScore)
        function getHealth(score) {
            if (score >= 90)
                return "Excellent"

            if (score >= 75)
                return "Good"

            if (score >= 50)
                return "Needs Improvement"

            return "Poor"
        }
        const health = getHealth(overallScore)

        function getCategoryStatus(score) {
            if (score >= 90) return "Good"

            if (score >= 50)
                return "Needs Improvement"

            return "Poor"
        }
        function createScore(score) {
            return {
                score,
                status: getCategoryStatus(score)
            }
        }    
        */


        /*Extract Images*/

          const fileName = `website-${Date.now()}.png`
        await page.screenshot({
            path: `public/${fileName}`,
            fullPage: false
        })

/*Generate Issues

        if (structuredData === 0) {
            issues.push({
                category: "SEO",
                severity: "High",
                message: "No structured data found"
            })
        }

        function addIssue(condition, message) {
            if (!condition) {
                issues.push({
                    category: "SEO",
                    severity: "High",
                    message
                })
            }
        }
*/
     //   addIssue(hasTitle, "Missing title tag")

      //  addIssue(hasMetaDescription, "Missing meta description")
      //  addIssue(hasLang, "Missing lang attribute")

      //  addIssue(hasCanonical, "Missing canonical URL")

        //(hasH1, "Missing H1 tag")

       /* addIssue(twitterCard, "Missing Twitter card meta tag")

        addIssue(ogDescription, "Missing Open Graph description")

        addIssue(ogImage, "Missing Open Graph image")

        addIssue(favicon, "Missing favicon")


        addIssue(robots, "Missing robots meta tag")

        addIssue(ogTitle, "Missing Open Graph title")*/
    
        const issues = getIssues({
    hasTitle,
    hasMetaDescription,
    hasLang,
    hasCanonical,
    hasH1,
    twitterCard,
    ogTitle,
    ogDescription,
    ogImage,
    favicon,
    robots,
    structuredData,
    missingAltCount
})


/*

        /*Generate Recommendations*/

        const recommendations = Object.values(lighthouse.audits)
            .filter(
                audit =>
                    audit.scoreDisplayMode === "metricSavings" ||
                    audit.scoreDisplayMode === "informative"
            )
            .map(audit => ({
                id: audit.id,
                title: audit.title,
                description: audit.description,
                displayValue: audit.displayValue,

                score: audit.score,

                numericValue: audit.numericValue,

                savingsMs: audit.details?.overallSavingsMs,

                savingsBytes: audit.details?.overallSavingsBytes,

                learnMore: audit.description?.match(
                    /https?:\/\/[^\s)]+/
                )?.[0]
            }));

            /*Return Response*/

        return Response.json({
    overall: scores.overall,

    categories: {
        seo: scores.seo,
        performance: scores.performance,
        accessibility: scores.accessibility,
        bestPractices: scores.bestPractices,
    },

    details: {
        metrics,
        links: {
            internal: internalLinks,
            external: externalLinks,
        }
    },

    recommendations,
    issues,
    screenshot: `/${fileName}`,
})

    } catch (error) {
        return Response.json(
            {
                error: error.message || "Invalid URL or failed to fetch website"
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