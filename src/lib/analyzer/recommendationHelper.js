export function getSeverity(score) {
    if (score >= 0.9) {
        return {
            text: "Low",
            color: "bg-green-500/20 text-green-400"
        }
    }

    if (score >= 0.5) {
        return {
            text: "Medium",
            color: "bg-yellow-500/20 text-yellow-400"
        }
    }

    return {
        text: "High",
        color: "bg-red-500/20 text-red-400"
    }
}