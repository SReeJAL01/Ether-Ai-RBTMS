import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { User } from '@/src/types';
import { useTheme } from '@/src/lib/ThemeContext';
import { cn } from '@/src/lib/utils';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: User;
  onLogout: () => void;
}

export function Layout({ children, activeTab, onTabChange, user, onLogout }: LayoutProps) {
  const { theme } = useTheme();

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300",
      theme === 'dark' 
        ? "bg-black text-white selection:bg-white selection:text-black" 
        : "bg-zinc-50 text-zinc-950 selection:bg-black selection:text-white"
    )}>
      <Sidebar activeTab={activeTab} onTabChange={onTabChange} user={user} onLogout={onLogout} />
      <main className="ml-64 min-h-screen transition-all duration-500">
        <div className="mx-auto max-w-7xl px-8 py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
