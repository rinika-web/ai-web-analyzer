'use client'
import React from 'react'
import { useState, useEffect } from 'react'
import { useSearchParams } from "next/navigation"
import ScoreCard from "./ScoreCard"
import ScreenshotPreview from "./ScreenshotPreview"
import IssueList from "./IssueList"
import RecommendationList from "./recommendations/RecommendationList";
import OverallSummary from './OverallSummary'
import MetricCard from './MetricCard'
import SummaryCard from "./SummaryCard"

const Score = () => {
    const [scores, setScores] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")


    const searchParams = useSearchParams()

    const url = searchParams.get("url")
    useEffect(() => {
        async function analyzeWebsite() {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ url }),
                })
                //console.log(response, "Response from API")

                const data = await response.json()
                console.log("API Response:", data);
                if (!response.ok) {
                    throw new Error(data.error || "Failed to analyze website")
                }

                setScores(data)
                console.log(data, "Data from API")

            } catch (error) {
                //console.error(error)
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }


        if (url) {
            analyzeWebsite()
        }

    }, [url])
    console.log(scores, "Scores state")
    console.log(scores?.screenshot)

    if (!url) {
        return (
            <div className="h-screen flex justify-center items-center">
                No URL provided
            </div>
        )
    }


    if (loading) {
        return (
            <div className="h-screen flex justify-center items-center text-white">
                Analyzing Website...
            </div>
        )
    }


    if (error) {
        return (
            <div className="h-screen flex justify-center items-center text-red-500">
                this is an error: {error}
            </div>
        )
    }


    console.log(scores);
    console.log(scores.recommendations);
    return (

        <div className="min-h-screen bg-zinc-950 text-white">
            <div className="max-w-6xl mx-auto px-4 py-10">

                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold">
                        Report Overview
                    </h1>

                    <p className="mt-3 text-zinc-400 break-all">
                        {url}
                    </p>
                </div>

                {/* Screenshot */}
                {scores?.screenshot && (
                    <div className="mt-12">
                        <h2 className="text-3xl font-semibold mb-5">
                            Website Screenshot
                        </h2>

                        <ScreenshotPreview
                            screenshot={scores.screenshot}
                        />
                    </div>
                )}

                <div className="mt-10">
                    <SummaryCard
                        summary={scores.summary}
                    />
                </div>

                <div className="mt-10">

                    <OverallSummary overall={scores?.overall} />

                </div>

                {/* Score Cards */}


                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                    <ScoreCard
                        title="SEO"
                        score={scores?.seo}
                    />

                    <ScoreCard
                        title="Performance"
                        score={scores?.performance}
                    />

                    <ScoreCard
                        title="Accessibility"
                        score={scores?.accessibility}
                    />

                    <ScoreCard
                        title="Best Practices"
                        score={scores?.bestPractices}
                    />

                </div>

                <div className="mt-10">
                    <h2 className="text-3xl font-bold mb-6">
                        Core Web Vitals
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

                        <div className="
                        bg-zinc-900 border-zinc-800
                        hover:border-zinc-600 
                        border transition rounded-xl 
                        p-5"
                        >
                            <MetricCard
                                title="FCP"
                                value={scores.details.metrics.webVitals.fcp.value}
                                status={scores.details.metrics.webVitals.fcp.status}
                            />

                        </div>
                        <div className="
                        bg-zinc-900 border-zinc-800
                        hover:border-zinc-600 
                        border transition rounded-xl 
                        p-5"
                        >
                            <MetricCard
                                title="LCP"
                                value={scores.details.metrics.webVitals.lcp.value}
                                status={scores.details.metrics.webVitals.lcp.status}
                            />
                        </div>
                        <div className="
                        bg-zinc-900 border-zinc-800
                        hover:border-zinc-600 
                        border transition rounded-xl 
                        p-5"
                        >
                            <MetricCard
                                title="CLS"
                                value={scores.details.metrics.webVitals.cls.value}
                                status={scores.details.metrics.webVitals.cls.status}
                            />
                        </div>

                        <div className="
                        bg-zinc-900 border-zinc-800
                        hover:border-zinc-600 
                        border transition rounded-xl 
                        p-5"
                        >
                            <MetricCard
                                title="Speed Index"
                                value={scores.details.metrics.performance.speedIndex.value}
                                status={scores.details.metrics.performance.speedIndex.status}
                            />
                        </div>

                        <div className="
                        bg-zinc-900 border-zinc-800
                        hover:border-zinc-600 
                        border transition rounded-xl 
                        p-5"
                        >
                            <MetricCard
                                title="TBT"
                                value={scores.details.metrics.performance.tbt.value}
                                status={scores.details.metrics.performance.tbt.status}
                            />
                        </div>

                        <div className="
                        bg-zinc-900 border-zinc-800
                        hover:border-zinc-600 
                        border transition rounded-xl 
                        p-5"
                        >
                            <MetricCard
                                title="TTI"
                                value={scores.details.metrics.performance.tti.value}
                                status={scores.details.metrics.performance.tti.status}
                            />
                        </div>
                        <div className="
                        bg-zinc-900 border-zinc-800
                        hover:border-zinc-600 
                        border transition rounded-xl 
                        p-5"
                        >
                            <MetricCard
                                title="TTFB"
                                value={scores.details.metrics.performance.ttfb.value}
                                status={scores.details.metrics.performance.ttfb.status}
                            />
                        </div>
                        <div className="
                        bg-zinc-900 border-zinc-800
                        hover:border-zinc-600 
                        border transition rounded-xl 
                        p-5"
                        >
                            <MetricCard
                                title="Total Byte Weight"
                                value={scores.details.metrics.performance.totalByteWeight.value}
                                status={scores.details.metrics.performance.totalByteWeight.status}
                            />
                        </div>


                        <div className="bg-zinc-900 border-zinc-800
                        hover:border-zinc-600 
                        border transition rounded-xl p-5">
                            <p className="text-zinc-400">DOM Size</p>
                            <h3 className="text-3xl font-bold mt-2">
                                {scores.details.metrics.diagnostics.domSize}
                            </h3>
                        </div>
                        <div className="bg-zinc-900 border-zinc-800
                        hover:border-zinc-600 
                        border transition rounded-xl p-5">
                            <p className="text-zinc-400">Network Requests</p>
                            <h3 className="text-3xl font-bold mt-2">
                                {scores.details.metrics.diagnostics.networkRequests}
                            </h3>
                        </div>
                        <div className="bg-zinc-900 border-zinc-800
                        hover:border-zinc-600 
                        border transition rounded-xl p-5">
                            <p className="text-zinc-400">Render Blocking</p>
                            <h3 className="text-3xl font-bold mt-2">
                                {scores.details.metrics.diagnostics.renderBlocking}
                            </h3>
                        </div>
                        <div className="bg-zinc-900 border-zinc-800
                        hover:border-zinc-600 
                        border transition rounded-xl p-5">
                            <p className="text-zinc-400">Unused CSS</p>
                            <h3 className="text-3xl font-bold mt-2">
                                {scores.details.metrics.diagnostics.unusedCSS}
                            </h3>
                        </div>
                        <div className="bg-zinc-900 border-zinc-800
                        hover:border-zinc-600 
                        border transition rounded-xl p-5">
                            <p className="text-zinc-400">Unused JavaScript</p>
                            <h3 className="text-3xl font-bold mt-2">
                                {scores.details.metrics.diagnostics.unusedJS}
                            </h3>
                        </div>
                        <div className="bg-zinc-900 border-zinc-800
                        hover:border-zinc-600 
                        border transition rounded-xl p-5">
                            <p className="text-zinc-400">Oversized Images</p>
                            <h3 className="text-3xl font-bold mt-2">
                                {scores.details.metrics.diagnostics.oversizedImages}
                            </h3>
                        </div>
                        <div className="bg-zinc-900 border-zinc-800
                        hover:border-zinc-600 
                        border transition rounded-xl p-5">
                            <p className="text-zinc-400">Cache</p>
                            <h3 className="text-3xl font-bold mt-2">
                                {scores.details.metrics.diagnostics.cache}
                            </h3>
                        </div>


                    </div>
                    <div className="mt-10">

                    </div>
                </div>
                {/* Screenshot 
                {scores?.screenshot && (
                    <div className="mt-12">
                        <h2 className="text-3xl font-semibold mb-5">
                            Website Screenshot
                        </h2>

                        <ScreenshotPreview
                            screenshot={scores.screenshot}
                        />
                    </div>
                )}*/}

                {/* Issues */}
                <div className="mt-12">
                    <h2 className="text-3xl font-semibold mb-5">
                        Issues Found
                    </h2>
                    <IssueList issues={scores?.issues} />
                </div>
                <div className="mt-10">
                    <h2 className="text-3xl font-bold mb-6">
                        Performance Recommendations
                    </h2>

                    <RecommendationList
                        recommendations={scores.recommendations}
                    />
                </div>

                {
                    scores?.aiSummary && (

                        <div className="
        mt-12
        bg-gradient-to-br
        from-zinc-700
        to-zinc-900
        rounded-2xl
        p-8
        shadow-xl
        ">

                            <h2 className="text-3xl font-bold mb-8">
                                🤖 AI Expert Analysis
                            </h2>


                            {/* Summary */}

                            <div className="
            bg-zinc-900
            rounded-xl
            p-5
            mb-6
            ">

                                <h3 className="text-xl font-semibold mb-3">
                                    Summary
                                </h3>

                                <p className="text-zinc-300">
                                    {scores.aiSummary.summary}
                                </p>

                            </div>



                            {/* Strengths */}

                            <div className="mb-6">

                                <h3 className="text-xl font-semibold mb-3">
                                    🚀 Strengths
                                </h3>


                                <div className="space-y-1">

                                    {
                                        scores.aiSummary.strengths.map(
                                            (item, index) => (

                                                <div
                                                    key={index}
                                                    className="
                                bg-zinc-900
                                rounded-lg
                                p-4
                                "
                                                >

                                                    ✅ {item}

                                                </div>

                                            )
                                        )
                                    }

                                </div>

                            </div>





                            {/* Priorities */}

                            <div className="mb-6">

                                <h3 className="text-xl font-semibold mb-3">
                                    🔥 Priority Improvements
                                </h3>


                                <div className="space-y-1">

                                    {
                                        scores.aiSummary.priorities.map(
                                            (item, index) => (

                                                <div
                                                    key={index}
                                                    className="
                                bg-zinc-900
                                rounded-lg
                                p-4
                                "
                                                >

                                                    ⚡ {item}

                                                </div>

                                            )
                                        )
                                    }


                                </div>


                            </div>






                            {/* Final Recommendation */}

                            <div className="
            bg-black
            border
            border-purple-500
            rounded-xl
            p-5
            ">


                                <h3 className="text-xl font-semibold mb-3">
                                    AI Recommendation
                                </h3>


                                <p className="text-purple-200">
                                    {scores.aiSummary.recommendation}
                                </p>


                            </div>


                        </div>

                    )
                }

            </div>
        </div>
    )

}

export default Score


