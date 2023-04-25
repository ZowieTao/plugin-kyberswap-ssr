import { useEffect, useState } from 'react';

interface AsyncProps {
  immediately: boolean;
}

export const useAsync = <T = any>(
  run: () => Promise<T | undefined>,
  props?: AsyncProps,
): {
  loading: boolean;
  success: boolean;
  data: T | undefined;
  run: () => Promise<T | undefined>;
} => {
  const { immediately = true } = props ?? {};
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [dataSets, setDataSets] = useState<T>();

  const runFun = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const results = await run().catch(() => {
      return undefined;
    });
    const fetchSuccess = results !== undefined;
    if (fetchSuccess) {
      setDataSets(results);
      setSuccess(true);
    } else {
      setSuccess(false);
    }
    setLoading(false);

    return results;
  };

  useEffect(() => {
    if (immediately) {
      runFun();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
    success,
    data: dataSets,
    run: runFun,
  };
};
