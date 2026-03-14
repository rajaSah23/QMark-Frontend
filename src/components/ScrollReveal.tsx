import { ReactNode } from 'react';
import { useInView } from 'react-intersection-observer';

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

const ScrollReveal = ({ children, className = '', delay = 0 }: ScrollRevealProps) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.14,
  });

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${inView ? 'scroll-reveal--visible' : ''} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
