import axios from 'axios';
import { useEffect, useState } from 'react';

type Input = {
  root?: Element | null;
  target: any;
  onIntersect: IntersectionObserverCallback;
  threshold?: number;
  rootMargin?: string;
};

type UseInfiniteScroll = (input: Input) => void;

export const useInfiniteScroll: UseInfiniteScroll = ({
  root = null,
  target,
  onIntersect,
  threshold = 1.0,
  rootMargin = '0px',
}) => {
  useEffect(() => {
    const observer = new IntersectionObserver(onIntersect, {
      root,
      rootMargin,
      threshold,
    });

    if (!target) {
      return;
    }

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [target, root, rootMargin, onIntersect, threshold]);
};

export function useGetApi<T>(
  token: string,
  api: string,
): [T | null, Error | null, boolean] {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const process = async () => {
      setError(null);
      setLoading(true);

      try {
        const response = await axios.get<T>(api, {
          headers: { Authorization: `Token ${token}` },
        });
        setData(response.data);
      } catch (error) {
        setError(error);
      }

      setLoading(false);
    };
    process();
  }, [token, api]);

  return [data, error, loading];
}

export function useGetApiWithParam<T>(
  token: string,
  api: string,
  param: string,
): [T | null, Error | null, boolean] {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (param !== '') {
      const process = async () => {
        setError(null);
        setLoading(true);

        try {
          const response = await axios.get<T>(api, {
            headers: { Authorization: `Token ${token}` },
            params: { param },
          });
          setData(response.data);
        } catch (error) {
          setError(error);
        }

        setLoading(false);
      };
      process();
    }
  }, [token, api, param]);

  return [data, error, loading];
}
