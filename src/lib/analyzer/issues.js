export function getIssues({
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
}) {
    const issues = []

    function addIssue(condition, message, severity = "High") {
        if (!condition) {
            issues.push({
                category: "SEO",
                severity,
                message
            })
        }
    }

    addIssue(hasTitle, "Missing title tag")
    addIssue(hasMetaDescription, "Missing meta description")
    addIssue(hasLang, "Missing lang attribute")
    addIssue(hasCanonical, "Missing canonical URL")
    addIssue(hasH1, "Missing H1 tag")
    addIssue(twitterCard, "Missing Twitter Card meta tag")
    addIssue(ogTitle, "Missing Open Graph title")
    addIssue(ogDescription, "Missing Open Graph description")
    addIssue(ogImage, "Missing Open Graph image")
    addIssue(favicon, "Missing favicon")
    addIssue(robots, "Missing robots meta tag")
    addIssue(structuredData > 0, "No structured data found")

    if (missingAltCount > 0) {
        issues.push({
            category: "Accessibility",
            severity: "Medium",
            message: `${missingAltCount} images are missing alt text`
        })
    }

    return issues
}