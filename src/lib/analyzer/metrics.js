export function metricStatus(value, good, average) {
    if (value <= good) return "Good"
    if (value <= average) return "Needs Improvement"
    return "Poor"
}

export function createMetric(audit, good, average) {
    return {
        value: audit.displayValue,
        status: metricStatus(
            audit.numericValue,
            good,
            average
        )
    }
}

export function getMetrics(audits) {
    return {
        fcp: createMetric(
            audits["first-contentful-paint"],
            1800,
            3000
        ),

        lcp: createMetric(
            audits["largest-contentful-paint"],
            2500,
            4000
        ),

        cls: createMetric(
            audits["cumulative-layout-shift"],
            0.1,
            0.25
        ),

        speedIndex: createMetric(
            audits["speed-index"],
            3400,
            5800
        ),

        tbt: createMetric(
            audits["total-blocking-time"],
            200,
            600
        ),


        tti: createMetric(
            audits["interactive"],
            3800,
            7300
        ),

        ttfb: createMetric(
            audits["server-response-time"],
            800,
            1800
        ),

        totalByteWeight: createMetric(
            audits["total-byte-weight"],
            1600000,
            3500000
        ),

        domSize:
            audits["dom-size-insight"]?.displayValue,

        networkRequests:
            audits["network-requests"]?.details?.items?.length,

        renderBlocking:
            audits["render-blocking-insight"]?.displayValue,

        unusedCSS:
            audits["unused-css-rules"]?.displayValue,

        unusedJS:
            audits["unused-javascript"]?.displayValue,

        oversizedImages:
            audits["image-delivery-insight"]?.displayValue,

        cache:
            audits["cache-insight"]?.displayValue,
    }
}