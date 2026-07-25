import CircularProgress from "./CircularProgress"
export default function ScoreCard({ title, score }) {

  function getColor(score) {
    if (score >= 90) return "text-green-400"
    if (score >= 70) return "text-yellow-400"
    return "text-red-400"
  }

  function getBackground(score) {
    if (score >= 90) return "bg-green-500/10"
    if (score >= 70) return "bg-yellow-500/10"
    return "bg-red-500/10"
  }

  return (
    <div className={`
                rounded-2xl
                p-6
                shadow-lg
                border
                border-zinc-800
                ${getBackground(score.score)}
                hover:scale-105
                transition
            `}>
      <h3>{title}</h3>

      <div className={`
                    text-6xl
                    font-black
                    mt-5
                    ${getColor(score.score)}
                `}>
        <CircularProgress
          score={score.score}
        />
      </div>

      <p className="
                       
                        px-3
                        py-1
                        text-base
                        rounded-full
                    ">
        {score?.status}
      </p>

    </div>
  )
}

