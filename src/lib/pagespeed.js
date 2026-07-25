export async function getPageSpeed(url) {
  const apiKey = process.env.PAGESPEED_API_KEY;

  const response = await fetch(
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
      url
    )}&category=PERFORMANCE&category=ACCESSIBILITY&category=SEO&category=BEST_PRACTICES&strategy=DESKTOP&key=${apiKey}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch PageSpeed report");
  }

  return await response.json();
}