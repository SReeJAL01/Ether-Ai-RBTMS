import React from 'react';
import { Card, CardTitle, CardDescription } from './ui/Card';
import { Button } from './ui/Button';
import { User, Shield, Bell, Lock, Eye, Palette } from 'lucide-react';
import { useTheme } from '@/src/lib/ThemeContext';
import { cn } from '@/src/lib/utils';
import { User as UserType } from '@/src/types';

interface SettingsProps {
  user: UserType;
}

export function Settings({ user }: SettingsProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-8 animate-stagger-in">
      <header>
        <h2 className={cn("text-3xl font-bold tracking-tight transition-colors duration-300", theme === 'dark' ? "text-white" : "text-zinc-950")}>Settings</h2>
        <p className="text-zinc-400 mt-1">Manage your account preferences and application settings.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center gap-4 mb-6">
              <div className={cn("p-2 rounded-lg", theme === 'dark' ? "bg-white/5 text-white" : "bg-black/5 text-black")}>
                <User size={20} />
              </div>
              <div>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details and how others see you.</CardDescription>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-zinc-500 mb-2 block">Display Name</label>
                  <input
                    type="text"
                    defaultValue={user.name}
                    className={cn(
                      "w-full rounded-lg border p-2.5 text-sm transition-all focus:outline-none focus:ring-2",
                      theme === 'dark' ? "bg-zinc-900 border-white/10 text-white focus:ring-white/20" : "bg-white border-zinc-200 text-zinc-950 focus:ring-black/5"
                    )}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-zinc-500 mb-2 block">Email Address</label>
                  <input
                    type="email"
                    defaultValue={user.email}
                    disabled
                    className={cn(
                      "w-full rounded-lg border p-2.5 text-sm transition-all opacity-50 cursor-not-allowed",
                      theme === 'dark' ? "bg-zinc-900 border-white/10 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-500"
                    )}
                  />
                </div>
              </div>
              <Button>Save Profile</Button>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4 mb-6">
              <div className={cn("p-2 rounded-lg", theme === 'dark' ? "bg-white/5 text-white" : "bg-black/5 text-black")}>
                <Palette size={20} />
              </div>
              <div>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize the visual interface of the application.</CardDescription>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-black/20">
              <div>
                <p className="text-sm font-medium">Dark Mode</p>
                <p className="text-xs text-zinc-500">Switch between light and dark themes.</p>
              </div>
              <button 
                onClick={toggleTheme}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2",
                  theme === 'dark' ? "bg-white" : "bg-zinc-300"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 transform rounded-full transition-transform",
                    theme === 'dark' ? "translate-x-6 bg-black" : "translate-x-1 bg-white"
                  )}
                />
              </button>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4 mb-6">
              <div className={cn("p-2 rounded-lg", theme === 'dark' ? "bg-white/5 text-white" : "bg-black/5 text-black")}>
                <Bell size={20} />
              </div>
              <div>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Configure how and when you receive alerts.</CardDescription>
              </div>
            </div>
            <p className="text-sm text-zinc-500">Notification preferences coming soon.</p>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="text-indigo-400" size={24} />
              <CardTitle className="text-indigo-400">Security Status</CardTitle>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Account Role</span>
                <span className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                  user.role === 'Admin' ? "bg-indigo-500 text-white" : "bg-zinc-800 text-zinc-400"
                )}>
                  {user.role}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Two-Factor Auth</span>
                <span className="text-zinc-500">Disabled</span>
              </div>
              <Button variant="secondary" className="w-full text-xs">Manage Security</Button>
            </div>
          </Card>

          <Card>
            <CardTitle className="text-sm">Quick Links</CardTitle>
            <div className="mt-4 space-y-2">
              <button className="w-full text-left px-3 py-2 text-xs text-zinc-400 hover:text-white hover:bg-white/5 rounded-md transition-colors flex items-center gap-2">
                <Lock size={14} /> Change Password
              </button>
              <button className="w-full text-left px-3 py-2 text-xs text-zinc-400 hover:text-white hover:bg-white/5 rounded-md transition-colors flex items-center gap-2">
                <Eye size={14} /> Privacy Settings
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
