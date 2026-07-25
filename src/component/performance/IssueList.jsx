export default function IssueList({ issues }) {
    return (
        <div className="space-y-4">
            {issues.map((issue, index) => (
                <div
                    key={index}
                    className="bg-zinc-900 rounded-xl p-4"
                >
                     <h3 className="text-lg font-bold">{issue.category}</h3>
        <p>{issue.message}</p>
        <span className="text-red-500 font-semibold">{issue.severity}</span>
                </div>
            ))}
        </div>
    );
}