'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

export function Tooltip({ content, children, side = 'top', className }: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current) return;
    
    const rect = triggerRef.current.getBoundingClientRect();
    const offset = 8;
    
    let top = 0;
    let left = 0;
    
    switch (side) {
      case 'top':
        top = rect.top - offset;
        left = rect.left + rect.width / 2;
        break;
      case 'right':
        top = rect.top + rect.height / 2;
        left = rect.right + offset;
        break;
      case 'bottom':
        top = rect.bottom + offset;
        left = rect.left + rect.width / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2;
        left = rect.left - offset;
        break;
    }
    
    setPosition({ top, left });
  }, [side]);

  const handleMouseEnter = () => {
    updatePosition();
    setIsVisible(true);
  };

  const transformClasses = {
    top: '-translate-x-1/2 -translate-y-full',
    right: 'translate-y-[-50%]',
    bottom: '-translate-x-1/2',
    left: '-translate-x-full translate-y-[-50%]',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-foreground border-x-transparent border-b-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-foreground border-y-transparent border-l-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-foreground border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-foreground border-y-transparent border-r-transparent',
  };

  const tooltipContent = isVisible && mounted ? createPortal(
    <div
      className={cn(
        'fixed z-[9999] px-3 py-1.5 text-xs font-medium text-primary-foreground bg-foreground rounded-md shadow-lg whitespace-nowrap animate-in fade-in-0 zoom-in-95 pointer-events-none',
        transformClasses[side],
        className
      )}
      style={{ top: position.top, left: position.left }}
      role="tooltip"
    >
      {content}
      <div
        className={cn(
          'absolute w-0 h-0 border-4',
          arrowClasses[side]
        )}
      />
    </div>,
    document.body
  ) : null;

  return (
    <div
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={handleMouseEnter}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {tooltipContent}
    </div>
  );
}
