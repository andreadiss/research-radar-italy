const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);

export async function fetchTextWithRetry(url, options = {}) {
  const {
    attempts = 3,
    delaysMs = [1000, 3000],
    fetchFn = fetch,
    sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay)),
    ...fetchOptions
  } = options;

  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    let response;
    try {
      response = await fetchFn(url, fetchOptions);
    } catch (error) {
      if (attempt === attempts - 1) throw error;
      lastError = error;
    }

    if (response?.ok) return response.text();
    if (response) {
      const error = new Error(`Failed ${response.status} ${response.statusText}: ${url}`);
      if (!RETRYABLE_STATUS.has(response.status) || attempt === attempts - 1) throw error;
      lastError = error;
    }

    await sleep(delaysMs[Math.min(attempt, delaysMs.length - 1)] ?? 0);
  }

  throw lastError;
}
