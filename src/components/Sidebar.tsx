import { ReactNode } from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Users, 
  Settings, 
  LogOut,
  ChevronRight,
  User as UserIcon,
  Sun,
  Moon
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { User } from '@/src/types';
import { useTheme } from '@/src/lib/ThemeContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: User;
  onLogout: () => void;
}

export function Sidebar({ activeTab, onTabChange, user, onLogout }: SidebarProps) {
  const { theme, toggleTheme } = useTheme();
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className={cn(
      'fixed left-0 top-0 h-screen w-64 border-r p-6 flex flex-col transition-colors duration-300',
      theme === 'dark' ? 'bg-zinc-950 border-white/10' : 'bg-white border-zinc-200'
    )}>
      <div className="mb-10 flex items-center gap-3">
        <div className={cn(
          "h-8 w-8 rounded-lg flex items-center justify-center transition-colors",
          theme === 'dark' ? "bg-white" : "bg-black"
        )}>
          <span className={cn("font-bold text-xl", theme === 'dark' ? "text-black" : "text-white")}>E</span>
        </div>
        <h1 className={cn("text-xl font-bold tracking-tight transition-colors", theme === 'dark' ? "text-white" : "text-black")}>EtherAi</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              'flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200',
              activeTab === item.id
                ? (theme === 'dark' ? 'bg-white text-black font-semibold' : 'bg-black text-white font-semibold')
                : (theme === 'dark' ? 'text-zinc-400 hover:bg-white/5 hover:text-white' : 'text-zinc-500 hover:bg-black/5 hover:text-black')
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon size={18} />
              {item.label}
            </div>
            {activeTab === item.id && <ChevronRight size={14} />}
          </button>
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        <div className={cn("flex items-center gap-3 px-4 py-3 border-t pt-6", theme === 'dark' ? "border-white/10" : "border-zinc-200")}>
          <div className={cn("h-10 w-10 rounded-full flex items-center justify-center overflow-hidden border", theme === 'dark' ? "bg-zinc-800 border-white/10" : "bg-zinc-100 border-zinc-200")}>
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <UserIcon size={20} className="text-zinc-500" />
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className={cn("text-sm font-medium truncate", theme === 'dark' ? "text-white" : "text-black")}>{user.name}</p>
            <p className="text-xs text-zinc-500 truncate">{user.role}</p>
          </div>
        </div>

        <div className="space-y-1">
          <button 
            onClick={toggleTheme}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-all",
              theme === 'dark' ? "text-zinc-400 hover:bg-white/5 hover:text-white" : "text-zinc-500 hover:bg-black/5 hover:text-black"
            )}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button 
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all font-semibold"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </div>
    </aside>
  );
}
