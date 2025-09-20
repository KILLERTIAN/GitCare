import { useState, useEffect, RefObject } from 'react';

interface IntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  triggerOnce?: boolean;
}

/**
 * A hook to observe when an element enters or exits the viewport
 * 
 * @param elementRef - Reference to the element to observe
 * @param options - IntersectionObserver options plus triggerOnce flag
 * @returns isIntersecting - Whether the element is currently intersecting the viewport
 */
export function useIntersectionObserver(
  elementRef: RefObject<Element | null>,
  {
    root = null,
    rootMargin = '0px',
    threshold = 0,
    triggerOnce = false
  }: IntersectionObserverOptions = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;
        setIsIntersecting(isElementIntersecting);

        // Unobserve after first intersection if triggerOnce is true
        if (isElementIntersecting && triggerOnce) {
          observer.unobserve(element);
        }
      },
      { root, rootMargin, threshold }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, root, rootMargin, threshold, triggerOnce]);

  return isIntersecting;
}

/**
 * A hook that applies a staggered delay based on intersection
 * 
 * @param elementRef - Reference to the element to observe
 * @param options - IntersectionObserver options
 * @returns Object containing isIntersecting status and calculated delay
 */
export function useStaggeredIntersection(
  elementRef: RefObject<Element>,
  index: number = 0,
  options: IntersectionObserverOptions = {}
): { isIntersecting: boolean; delay: number } {
  const isIntersecting = useIntersectionObserver(elementRef, options);
  const baseDelay = 0.1;
  const delay = baseDelay * index;

  return { isIntersecting, delay };
}

/**
 * A hook to create parallax scrolling effects
 * 
 * @param elementRef - Reference to the element to apply parallax to
 * @param speed - Speed of the parallax effect (1 = normal, < 1 = slower, > 1 = faster)
 * @returns The calculated transform value for the element
 */
export function useParallaxEffect(
  elementRef: RefObject<Element>,
  speed: number = 0.5
): string {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return;
      const scrollY = window.scrollY;
      const rect = (elementRef.current as HTMLElement).getBoundingClientRect();
      const elementTop = rect.top + scrollY;
      const elementCenter = elementTop + rect.height / 2;
      const windowCenter = scrollY + window.innerHeight / 2;
      const distance = windowCenter - elementCenter;
      
      const translateY = distance * speed;
      setOffset(translateY);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [elementRef, speed]);

  return `translateY(${offset}px)`;
}

/**
 * A hook that detects when an element is fully in the viewport
 * 
 * @param elementRef - Reference to the element to observe
 * @returns isFullyVisible - Whether the element is fully visible in the viewport
 */
export function useFullVisibility(
  elementRef: RefObject<Element>
): boolean {
  const [isFullyVisible, setIsFullyVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFullyVisible(entry.intersectionRatio === 1);
      },
      { threshold: 1.0 }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [elementRef]);

  return isFullyVisible;
}
