import { Suspense } from "react"
import Score from "@/component/performance/Score"

export default function ScorePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
                Loading...
            </div>
        }>
            <Score />
        </Suspense>
    )
}