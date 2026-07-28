export function getSummary({
    scores,
    //issues,
    recommendations
}) {
    const strengths = []
    const weaknesses = []

    // Strengths
    if (scores.seo.score >= 90)
        strengths.push("SEO score is excellent")

    if (scores.performance.score >= 90)
        strengths.push("Performance is excellent")

    if (scores.accessibility.score >= 90)
        strengths.push("Accessibility is high")

    if (scores.bestPractices.score >= 90)
        strengths.push("Best Practices passed")

    // Weaknesses
    if (
        recommendations.some(r => r.id === "unused-javascript")
    ) {
        weaknesses.push("Unused JavaScript detected")
    }

    if (
        recommendations.some(r => r.id === "render-blocking-insight")
    ) {
        weaknesses.push("Render-blocking resources found")
    }

    if (
        recommendations.some(r => r.id === "unused-css-rules")
    ) {
        weaknesses.push("Unused CSS detected")
    }

    let short

    if (scores.overall.score >= 90) {
        short =
            "Excellent website with only minor optimization opportunities."
    } else if (scores.overall.score >= 75) {
        short =
            "Good website, but several improvements are recommended."
    } else {
        short =
            "Website requires significant optimization."
    }

    return {
        health: scores.overall.health,
        short,
        strengths,
        weaknesses
    }
}