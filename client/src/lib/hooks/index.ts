import { useEffect, useState } from 'react';
import { getModSubreddits } from '../api/modsandbox/post';

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

export const useModSubApi: (
  token: string,
) => [string[], Error | null, boolean] = (token) => {
  const [data, setData] = useState<string[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const process = async () => {
      setError(null);
      setLoading(true);

      try {
        const modSubreddits = await getModSubreddits(token);
        setData(modSubreddits);
      } catch (error) {
        setError(error);
      }

      setLoading(false);
    };

    process();
  }, [token]);

  return [data, error, loading];
};
