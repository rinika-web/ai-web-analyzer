export function getRecommendations(audits) {

    const IGNORED_AUDITS = [
        "metrics",
        "diagnostics",
        "network-requests",
        "resource-summary",
        "script-treemap-data",
        "screenshot-thumbnails",
        "final-screenshot"
    ]

    return Object.values(audits)

        .filter(audit =>
            (
                audit.scoreDisplayMode === "metricSavings" ||
                audit.scoreDisplayMode === "informative"
            ) &&
            audit.score !== 1 &&
            !IGNORED_AUDITS.includes(audit.id)
        )

        .sort((a, b) => a.score - b.score)

        .map(audit => ({

            id: audit.id,

            title: audit.title,

            description: audit.description,

            displayValue: audit.displayValue,

            score: audit.score,

            numericValue: audit.numericValue,

            savingsMs: audit.details?.overallSavingsMs,

            savingsBytes: audit.details?.overallSavingsBytes,

            learnMore:
                audit.description?.match(
                    /https?:\/\/[^\s)]+/
                )?.[0]

        }))
}