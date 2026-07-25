export default function OverallSummary({ overall }) {
    return (
        <div className="
            bg-zinc-900
            rounded-2xl
            p-8
            mb-10
        ">
            <h2 className="text-3xl font-bold mb-8">
                Website Health
            </h2>

            <div className="grid md:grid-cols-3 gap-8">

                {/* Overall Score */}

                <div className="text-center">

                    <p className="text-zinc-400">
                        Overall Score
                    </p>

                    <h1 className="text-7xl font-black mt-3">
                        {overall.score}
                    </h1>

                </div>

                {/* Grade */}

                <div className="text-center">

                    <p className="text-zinc-400">
                        Grade
                    </p>

                    <h1 className="text-7xl font-black mt-3 text-green-400">
                        {overall.grade}
                    </h1>

                </div>

                {/* Health */}

                <div className="text-center">

                    <p className="text-zinc-400">
                        Health
                    </p>

                    <h1 className="text-5xl font-bold mt-6">
                        {overall.health}
                    </h1>

                </div>

            </div>
        </div>
    )
}