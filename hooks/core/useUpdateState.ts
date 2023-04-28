import { useEffect, useState } from 'react';

// (info: T, initial?:boolean, updateDependence:T)=>[T, (update: T) => void]
export function useUpdateState<T>(info: T): [T, (update: T) => void] {
  const [data, setData] = useState(info);
  useEffect(() => {
    setData(info);
  }, [info]);

  return [data, setData];
}
