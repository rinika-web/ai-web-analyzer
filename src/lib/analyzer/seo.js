export function getSeoData($, title) {

    const metaDescription =
        $('meta[name="description"]').attr("content")

    const canonical =
        $('link[rel="canonical"]').attr("href")

    const twitterCard =
        $('meta[name="twitter:card"]').attr("content")

    const ogTitle =
        $('meta[property="og:title"]').attr("content")

    const ogDescription =
        $('meta[property="og:description"]').attr("content")

    const ogImage =
        $('meta[property="og:image"]').attr("content")

    const favicon =
        $('link[rel="icon"]').attr("href")

    const robots =
        $('meta[name="robots"]').attr("content")

    const htmlLang =
        $("html").attr("lang")

    const structuredData =
        $('script[type="application/ld+json"]').length

    const h1 =
        $("h1").length

    const h2 =
        $("h2").length

    const h3 =
        $("h3").length

    const imageCount =
        $("img").length

    const scriptCount =
        $("script").length

    let missingAltCount = 0

    $("img").each((_, img) => {

        if (!$(img).attr("alt")) {
            missingAltCount++
        }

    })

    return {

        // Basic SEO
        title,
        metaDescription,
        canonical,
        twitterCard,
        ogTitle,
        ogDescription,
        ogImage,
        favicon,
        robots,
        htmlLang,
        structuredData,

        // Page Stats
        imageCount,
        scriptCount,
        missingAltCount,

        // Headings
        headings: {
            h1,
            h2,
            h3
        },

        // Validation Flags
        hasTitle:
            title.length > 0,

        hasMetaDescription:
            !!metaDescription,

        hasCanonical:
            !!canonical,

        hasLang:
            !!htmlLang,

        hasH1:
            h1 > 0

    }

}