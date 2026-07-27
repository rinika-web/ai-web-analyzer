export function metricStatus(value, good, average) {

    if (value <= good)
        return "Good"

    if (value <= average)
        return "Needs Improvement"

    return "Poor"

}

export function getCategoryStatus(score) {

    if (score >= 90)
        return "Good"

    if (score >= 50)
        return "Needs Improvement"

    return "Poor"

}

export function getGrade(score) {

    if (score >= 90)
        return "A"

    if (score >= 80)
        return "B"

    if (score >= 70)
        return "C"

    if (score >= 60)
        return "D"

    return "F"

}

export function getHealth(score) {

    if (score >= 90)
        return "Excellent"

    if (score >= 75)
        return "Good"

    if (score >= 50)
        return "Needs Improvement"

    return "Poor"

}