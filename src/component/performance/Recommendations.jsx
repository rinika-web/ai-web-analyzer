export default function Recommendations({ recommendations }) {
  return (
    <div className="space-y-4">
      {recommendations.map((item) => (
        <div
          key={item.id}
          className="bg-zinc-900 rounded-xl p-5"
        >
          <h3 className="text-xl font-bold">
            {item.title}
          </h3>

          <p className="text-zinc-400 mt-2">
            {item.description}
          </p>

          <p className="mt-3 text-red-400">
            {item.displayValue}
          </p>
        </div>
      ))}
    </div>
  );
}