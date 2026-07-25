export default function CircularProgress({ score }) {

    const radius = 65
    const stroke = 10

    const normalizedRadius = radius - stroke / 2

    const circumference =
        normalizedRadius * 2 * Math.PI

    const offset =
        circumference -
        (score / 100) * circumference

    function getColor(score) {

        if (score >= 90)
            return "#22c55e"

        if (score >= 70)
            return "#facc15"

        return "#ef4444"
    }

    return (
        <div className="flex justify-center">

            <svg
                width="140"
                height="140"
            >

                {/* Background Circle */}

                <circle
                    stroke="#27272a"
                    fill="transparent"
                    strokeWidth={stroke}
                    r={normalizedRadius}
                    cx="70"
                    cy="70"
                />

                {/* Progress Circle */}

                <circle
                    stroke={getColor(score)}
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    r={normalizedRadius}
                    cx="70"
                    cy="70"
                    transform="rotate(-90 70 70)"
                />

                {/* Score */}

                <text
                    x="50%"
                    y="50%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    className="fill-white text-3xl font-bold"
                >
                    {score}
                </text>

            </svg>

        </div>
    )
}