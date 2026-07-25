export default function MetricCard({
    title,
    value,
    status
}) {

    function getColor() {
        if (status === "Good")
            return "text-green-400"

        if (status === "Needs Improvement")
            return "text-yellow-400"

        return "text-red-400"
    }

    return (
        <div className="
           
            rounded-2xl
            p-6
            
        ">

            <p className="text-zinc-400">
                {title}
            </p>

            <h2 className="
                text-3xl
                font-bold
                mt-3
            ">
                {value}
            </h2>

            <p className={`${getColor()} mt-4`}>
                {status}
            </p>

        </div>
    )
}