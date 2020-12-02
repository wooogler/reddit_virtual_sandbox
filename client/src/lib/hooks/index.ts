import { useEffect } from 'react';

type Input = {
  root?: Element | null,
  target: any,
  onIntersect: IntersectionObserverCallback,
  threshold?: number,
  rootMargin?: string
}

type UseInfiniteScroll = (input: Input) => void

export const useInfiniteScroll: UseInfiniteScroll  = ({
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
