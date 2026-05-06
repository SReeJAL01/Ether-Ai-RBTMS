import React, { ReactNode, useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { Card, CardTitle, CardDescription } from './ui/Card';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus,
  ArrowRight
} from 'lucide-react';
import { Button } from './ui/Button';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { Task, Project } from '@/src/types';
import { cn } from '@/src/lib/utils';
import { useTheme } from '@/src/lib/ThemeContext';

export function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const { theme } = useTheme();

  useEffect(() => {
    const unsubTasks = onSnapshot(query(collection(db, 'tasks')), (snap) => {
      setTasks(snap.docs.map(doc => doc.data() as Task));
    });
    const unsubProjects = onSnapshot(query(collection(db, 'projects')), (snap) => {
      setProjects(snap.docs.map(doc => doc.data() as Project));
    });
    return () => {
      unsubTasks();
      unsubProjects();
    };
  }, []);

  const totalTasks = tasks.length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const done = tasks.filter(t => t.status === 'Done').length;
  const overdue = tasks.filter(t => {
    if (!t.dueDate) return false;
    return new Date(t.dueDate) < new Date() && t.status !== 'Done';
  }).length;

  const activityData = [
    { name: 'Total', tasks: totalTasks },
    { name: 'Pending', tasks: totalTasks - done },
    { name: 'Done', tasks: done },
  ];

  return (
    <div className="space-y-8 animate-stagger-in">
      <header className="flex items-center justify-between">
        <div>
          <h2 className={cn("text-3xl font-bold tracking-tight transition-colors duration-300", theme === 'dark' ? "text-white" : "text-black")}>Dashboard</h2>
          <p className="text-zinc-400 mt-1">Welcome back, here's what's happening today.</p>
        </div>
        <Button className="gap-2">
          <Plus size={18} />
          Quick Task
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Tasks" 
          value={totalTasks.toString()} 
          change="Updated just now" 
          icon={<CheckCircle2 className={theme === 'dark' ? "text-white" : "text-black"} size={20} />} 
        />
        <StatCard 
          label="In Progress" 
          value={inProgress.toString()} 
          change={`${inProgress} tasks active`} 
          icon={<Clock className="text-zinc-400" size={20} />} 
        />
        <StatCard 
          label="Overdue" 
          value={overdue.toString()} 
          change={overdue > 0 ? "Needs attention" : "Everything on track"} 
          icon={<AlertCircle className={cn(overdue > 0 ? "text-red-500" : "text-zinc-600")} size={20} />} 
        />
        <StatCard 
          label="Completed" 
          value={done.toString()} 
          change={`${done} tasks resolved`} 
          icon={<CheckCircle2 className="text-green-500" size={20} />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="h-[400px]">
            <CardTitle>Activity Overview</CardTitle>
            <CardDescription>Task distribution by status</CardDescription>
            <div className="mt-8 h-[280px] w-full text-zinc-500">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? "#27272a" : "#e4e4e7"} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: theme === 'dark' ? '#71717a' : '#52525b', fontSize: 12 }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: theme === 'dark' ? '#71717a' : '#52525b', fontSize: 12 }} 
                  />
                  <Tooltip 
                    cursor={{ fill: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' }} 
                    contentStyle={{ 
                      backgroundColor: theme === 'dark' ? '#18181b' : '#ffffff', 
                      border: theme === 'dark' ? '1px solid #27272a' : '1px solid #e4e4e7', 
                      borderRadius: '8px',
                      color: theme === 'dark' ? '#ffffff' : '#000000'
                    }}
                  />
                  <Bar dataKey="tasks" fill={theme === 'dark' ? "#ffffff" : "#000000"} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="h-[400px] flex flex-col">
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>Active projects this week</CardDescription>
            <div className="mt-6 flex-1 space-y-4 overflow-y-auto">
              {projects.slice(0, 5).map(p => (
                <div key={p.id}>
                  <ProjectItem name={p.title} progress={Math.floor(Math.random() * 100)} />
                </div>
              ))}
              {projects.length === 0 && <p className="text-zinc-500 text-sm italic">No projects yet.</p>}
            </div>
            <button className={cn(
              "mt-6 flex items-center justify-center gap-2 text-sm font-medium transition-colors",
              theme === 'dark' ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-black"
            )}>
              View all projects <ArrowRight size={14} />
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, change, icon }: { label: string; value: string; change: string; icon: ReactNode }) {
  const { theme } = useTheme();
  return (
    <Card className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-zinc-400">{label}</p>
        <p className={cn("mt-2 text-3xl font-bold transition-colors", theme === 'dark' ? "text-white" : "text-zinc-950")}>{value}</p>
        <p className="mt-1 text-xs text-zinc-500">{change}</p>
      </div>
      <div className={cn("rounded-lg p-2.5", theme === 'dark' ? "bg-white/5" : "bg-zinc-100")}>
        {icon}
      </div>
    </Card>
  );
}

function ProjectItem({ name, progress }: { name: string; progress: number }) {
  const { theme } = useTheme();
  return (
    <div className="group cursor-pointer">
      <div className="flex items-center justify-between mb-2">
        <span className={cn(
          "text-sm font-medium transition-colors",
          theme === 'dark' ? "text-white group-hover:text-white/80" : "text-zinc-900 group-hover:text-black"
        )}>{name}</span>
        <span className="text-xs text-zinc-500">{progress}%</span>
      </div>
      <div className={cn("h-1.5 w-full rounded-full overflow-hidden", theme === 'dark' ? "bg-zinc-800" : "bg-zinc-200")}>
        <div 
          className={cn("h-full transition-all duration-500 ease-out", theme === 'dark' ? "bg-white" : "bg-black")} 
          style={{ width: `${progress}%` }} 
        />
      </div>
    </div>
  );
}
