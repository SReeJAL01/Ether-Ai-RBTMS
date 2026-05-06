import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/src/lib/utils';
import { useTheme } from '@/src/lib/ThemeContext';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const { theme } = useTheme();
    
    const variants = {
      primary: theme === 'dark' 
        ? 'bg-white text-black hover:bg-zinc-100 hover:scale-[0.98]' 
        : 'bg-black text-white hover:bg-zinc-900 hover:scale-[0.98]',
      secondary: theme === 'dark'
        ? 'bg-zinc-800 text-white hover:bg-zinc-700'
        : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200',
      ghost: theme === 'dark'
        ? 'bg-transparent text-zinc-400 hover:bg-white/5 hover:text-white'
        : 'bg-transparent text-zinc-500 hover:bg-black/5 hover:text-black',
      danger: 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
