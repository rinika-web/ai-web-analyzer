import RecommendationCard from "./Recommendations"

export default function RecommendationList({
    recommendations
}) {

    return (

        <div
            className="
                grid
                md:grid-cols-2
                gap-6
            "
        >

            {recommendations.map((recommendation) => (

                <RecommendationCard

                    key={recommendation.id}

                    {...recommendation}

                />

            ))}

        </div>

    )

}