import { useState, useEffect } from 'react';

export default function useGet<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let ignore = false;
    if (url) {
      (async function () {
        try {
          setLoading(true);
          const res = await fetch(url);
          const json: T = await res.json();
          if (!ignore) setData(json);
        } catch (error: any) {
          if (!ignore) setError(error);
        } finally {
          if (!ignore) setLoading(false);
        }
      })();
    }
    return () => {
      ignore = true;
    };
  }, [url]);

  return { data, error, loading };
}
