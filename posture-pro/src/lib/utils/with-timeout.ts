/**
 * Races a promise against a timeout. Some browser APIs (getUserMedia under an
 * OS-level camera restriction, MediaPipe's first CDN model fetch on a slow
 * connection) can hang indefinitely instead of rejecting, which otherwise
 * leaves the UI stuck forever with no error to react to.
 */
export function withTimeout<T>(promise: Promise<T>, timeoutMs: number, timeoutMessage = 'Timed out'): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}
