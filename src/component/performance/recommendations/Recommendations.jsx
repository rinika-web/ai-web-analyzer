import Link from "next/link"
import { getSeverity } from "@/lib/analyzer/recommendationHelper"

export default function RecommendationCard({
    title,
    description,
    displayValue,
    score,
    learnMore
}) {
    const severity = getSeverity(score)

    return (

        <div
            className="
                bg-zinc-900
                border
                border-zinc-800
                rounded-2xl
                p-6
                hover:border-blue-500
                transition
            "
        >

            <div className="flex justify-between items-center mb-4">

                <span
                    className={`
            px-3
            py-1
            rounded-full
            text-sm
            font-semibold
            ${severity.color}
        `}
                >
                    {severity.text}
                </span>

                <span className="text-zinc-500 text-sm">
                    {Math.round(score * 100)}%
                </span>

            </div>

            <h3
                className="
                    text-xl
                    font-bold
                    mb-3
                "
            >
                {title}
            </h3>

            <p
                className="
                    text-zinc-400
                    mb-5
                "
            >
                {description}
            </p>

            {displayValue && (
                <div className="mt-5">

                    <p className="text-xs uppercase tracking-wide text-zinc-500">
                        Estimated Savings
                    </p>

                    <p className="text-lg font-bold text-blue-400">
                        {displayValue}
                    </p>

                </div>

            )}

            {learnMore && (
                <Link
                    href={learnMore}
                    target="_blank"
                    className="inline-flex mt-5 text-blue-500 hover:underline"
                >
                    Learn More →
                </Link>

            )}

        </div>

    )

}