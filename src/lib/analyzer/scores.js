function categoryScore(categories, name) {
    return Math.round(
        (categories[name]?.score ?? 0) * 100
    )
}

function getGrade(score) {
    if (score >= 90) return "A"
    if (score >= 80) return "B"
    if (score >= 70) return "C"
    if (score >= 60) return "D"
    return "F"
}

function getHealth(score) {
    if (score >= 90) return "Excellent"

    if (score >= 75) return "Good"

    if (score >= 50) return "Needs Improvement"

    return "Poor"
}

function getCategoryStatus(score) {
    if (score >= 90) return "Good"

    if (score >= 50) return "Needs Improvement"

    return "Poor"
}

function createScore(score) {
    return {
        score,
        status: getCategoryStatus(score)
    }
}

export function getScores(categories) {
    const seoScore =
        categoryScore(categories, "seo")

    const performanceScore =
        categoryScore(categories, "performance")

    const accessibilityScore =
        categoryScore(categories, "accessibility")

    const bestPracticesScore =
        categoryScore(categories, "best-practices")

    const overallScore = Math.round(
        (
            seoScore +
            performanceScore +
            accessibilityScore +
            bestPracticesScore
        ) / 4
    )

    return {
        overall: {
            score: overallScore,
            grade: getGrade(overallScore),
            health: getHealth(overallScore)
        },

        seo: createScore(seoScore),

        performance: createScore(performanceScore),

        accessibility: createScore(accessibilityScore),

        bestPractices: createScore(bestPracticesScore)
    }
}