import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { User, UserRole } from '@/src/types';
import { Card, CardTitle, CardDescription } from './ui/Card';
import { Button } from './ui/Button';
import { Shield, User as UserIcon, ShieldCheck } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useTheme } from '@/src/lib/ThemeContext';

interface TeamProps {
  currentUser: User;
}

export function Team({ currentUser }: TeamProps) {
  const [users, setUsers] = useState<User[]>([]);
  const isAdmin = currentUser.role === 'Admin';
  const { theme } = useTheme();

  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
      setUsers(usersData);
    });

    return unsubscribe;
  }, []);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    if (!isAdmin) return;
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole
      });
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  return (
    <div className="space-y-8 animate-stagger-in">
      <header className="flex items-center justify-between">
        <div>
          <h2 className={cn("text-3xl font-bold tracking-tight transition-colors duration-300", theme === 'dark' ? "text-white" : "text-zinc-950")}>Team Directory</h2>
          <p className="text-zinc-400 mt-1">Manage team members and their access levels.</p>
        </div>
        <div className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors",
          theme === 'dark' ? "bg-white/5 border-white/10" : "bg-zinc-100 border-zinc-200"
        )}>
          <Shield size={16} className={cn(isAdmin ? (theme === 'dark' ? "text-white" : "text-black") : "text-zinc-500")} />
          <span className={cn("text-sm font-medium", theme === 'dark' ? "text-zinc-400" : "text-zinc-500")}>
            Role: <span className={theme === 'dark' ? "text-white" : "text-black"}>{currentUser.role}</span>
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user.id}>
            <Card className="h-full flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className={cn(
                  "h-20 w-20 rounded-full border-2 flex items-center justify-center overflow-hidden shadow-xl transition-all",
                  theme === 'dark' ? "bg-zinc-800 border-white/10 shadow-black" : "bg-zinc-100 border-zinc-200 shadow-zinc-200"
                )}>
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <UserIcon size={32} className="text-zinc-500" />
                  )}
                </div>
                <div className={cn(
                  "absolute -bottom-1 -right-1 h-7 w-7 rounded-full border-2 flex items-center justify-center shadow-lg transition-all",
                  user.role === 'Admin' 
                    ? (theme === 'dark' ? "bg-white text-black border-zinc-950" : "bg-black text-white border-white") 
                    : (theme === 'dark' ? "bg-zinc-800 text-zinc-400 border-zinc-950" : "bg-zinc-200 text-zinc-500 border-white")
                )}>
                  {user.role === 'Admin' ? <ShieldCheck size={14} /> : <UserIcon size={14} />}
                </div>
              </div>

              <CardTitle className="text-xl">{user.name}</CardTitle>
              <CardDescription className="mb-6 truncate w-full">{user.email}</CardDescription>

              <div className={cn("mt-auto w-full pt-6 border-t", theme === 'dark' ? "border-white/5" : "border-zinc-100")}>
                {isAdmin && user.id !== currentUser.id ? (
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider mb-2">Change Role</p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        size="sm"
                        variant={user.role === 'Admin' ? 'primary' : 'secondary'}
                        onClick={() => handleRoleChange(user.id, 'Admin')}
                        className="text-[10px] py-1"
                      >
                        Admin
                      </Button>
                      <Button
                        size="sm"
                        variant={user.role === 'Member' ? 'primary' : 'secondary'}
                        onClick={() => handleRoleChange(user.id, 'Member')}
                        className="text-[10px] py-1"
                      >
                        Member
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className={cn(
                    "py-2 inline-flex items-center gap-2 px-3 rounded-full border transition-colors",
                    theme === 'dark' ? "bg-zinc-900 border-white/5" : "bg-zinc-100 border-zinc-200"
                  )}>
                    <Shield size={12} className="text-zinc-500" />
                    <span className="text-xs font-medium text-zinc-400">{user.role}</span>
                  </div>
                )}
                
                {user.id === currentUser.id && (
                  <p className="mt-3 text-[10px] text-zinc-500 font-medium">(You)</p>
                )}
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
