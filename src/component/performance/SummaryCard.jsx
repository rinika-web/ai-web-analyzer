export default function SummaryCard({ summary }) {
    return (
        <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">

            <h2 className="text-2xl font-bold">
                Overall Summary
            </h2>

            <p className="text-zinc-400 mt-3">
                {summary.short}
            </p>

            <div className="mt-6">

                <h3 className="font-semibold mb-2">
                    Strengths
                </h3>

                <ul className="space-y-2">
                    {summary.strengths.map((item, index) => (
                        <li key={index}>✅ {item}</li>
                    ))}
                </ul>

            </div>

            <div className="mt-6">

                <h3 className="font-semibold mb-2">
                    Improvements
                </h3>

                <ul className="space-y-2">
                    {summary.weaknesses.map((item, index) => (
                        <li key={index}>⚠️ {item}</li>
                    ))}
                </ul>

            </div>

        </div>
    )
}