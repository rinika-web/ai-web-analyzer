const requests = new Map();

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 5;

export function rateLimit(userId) {
    const now = Date.now();

    const userRequests = requests.get(userId) || [];

    // Remove expired requests
    const recentRequests = userRequests.filter(
        (timestamp) => now - timestamp < WINDOW_MS
    );

    if (recentRequests.length >= MAX_REQUESTS) {
        return {
            allowed: false,
            retryAfter: Math.ceil(
                (WINDOW_MS - (now - recentRequests[0])) / 1000
            )
        };
    }

    recentRequests.push(now);

    requests.set(userId, recentRequests);

    return {
        allowed: true
    };
}