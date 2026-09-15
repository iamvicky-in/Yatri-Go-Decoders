import { useCallback, useEffect, useState } from "react";

export function useSupabaseQuery<T>(
  queryFn: () => any,
  deps: any[] = [],
  options: { enabled?: boolean } = { enabled: true },
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(options.enabled !== false);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    if (options.enabled === false) return;
    setLoading(true);
    const { data, error } = await queryFn();
    if (error) {
      setError(new Error(error.message));
    } else {
      setItems((Array.isArray(data) ? data : data ? [data] : []) as T[]);
    }
    setLoading(false);
  }, [...deps, options.enabled]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { items, loading, refresh, error };
}

export async function handleSupabaseError(
  promise: PromiseLike<{ error: { message: string } | null }>,
) {
  const { error } = await promise;
  if (error) throw new Error(error.message);
}
