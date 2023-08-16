import { useState, useEffect } from 'react';

export default function useGet<T>(url: string | URL) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const abort = new AbortController();
    if (url) {
      (async function () {
        try {
          setLoading(true);
          const res = await fetch(url, { signal: abort.signal });
          const json: T = await res.json();
          setData(json);
        } catch (error: any) {
          setError(error);
        } finally {
          setLoading(false);
        }
      })();
    }
    return () => {
      abort.abort();
    };
  }, [url]);

  return { data, error, loading };
}
