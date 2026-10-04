export async function measureStage(timings, name, fn) {
    const start = performance.now();

    try {
        return await fn();
    } finally {
        timings[name] = Math.round(performance.now() - start);
    }
}