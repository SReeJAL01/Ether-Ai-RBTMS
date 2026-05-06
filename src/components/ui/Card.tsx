import { ReactNode } from 'react';
import { cn } from '@/src/lib/utils';
import { useTheme } from '@/src/lib/ThemeContext';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  const { theme } = useTheme();
  return (
    <div className={cn(
      'rounded-xl border transition-all duration-300 backdrop-blur-sm', 
      theme === 'dark' 
        ? 'border-white/10 bg-zinc-900/50' 
        : 'border-zinc-200 bg-white/70 shadow-sm shadow-zinc-200/50',
      className
    )}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: CardProps) {
  const { theme } = useTheme();
  return (
    <h3 className={cn(
      'text-lg font-medium transition-colors duration-300', 
      theme === 'dark' ? 'text-white' : 'text-zinc-900',
      className
    )}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className }: CardProps) {
  const { theme } = useTheme();
  return (
    <p className={cn(
      'mt-1 text-sm transition-colors duration-300', 
      theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500',
      className
    )}>
      {children}
    </p>
  );
}
