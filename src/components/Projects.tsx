import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { Project, User } from '@/src/types';
import { Card, CardTitle, CardDescription } from './ui/Card';
import { Button } from './ui/Button';
import { Plus, Trash2, FolderOpen, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useTheme } from '@/src/lib/ThemeContext';
import { cn } from '@/src/lib/utils';

interface ProjectsProps {
  user: User;
}

export function Projects({ user }: ProjectsProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const { theme } = useTheme();

  useEffect(() => {
    const q = query(collection(db, 'projects'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      setProjects(projectsData);
    });

    return unsubscribe;
  }, []);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      await addDoc(collection(db, 'projects'), {
        title: newTitle,
        description: newDesc,
        createdBy: user.id,
        createdAt: serverTimestamp(),
        members: [user.id]
      });
      setNewTitle('');
      setNewDesc('');
      setIsAdding(false);
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (user.role !== 'Admin') return;
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <div className="space-y-8 animate-stagger-in">
      <header className="flex items-center justify-between">
        <div>
          <h2 className={cn("text-3xl font-bold tracking-tight transition-colors duration-300", theme === 'dark' ? "text-white" : "text-zinc-950")}>Projects</h2>
          <p className="text-zinc-400 mt-1">Manage and collaborate on your group projects.</p>
        </div>
        {user.role === 'Admin' && (
          <Button onClick={() => setIsAdding(true)} className="gap-2">
            <Plus size={18} />
            New Project
          </Button>
        )}
      </header>

      {isAdding && (
        <Card className={cn(
          "transition-all duration-300",
          theme === 'dark' ? "border-white/20 bg-white/5" : "border-black/5 bg-black/5"
        )}>
          <form onSubmit={handleAddProject} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-400">Project Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className={cn(
                  "mt-1 w-full rounded-lg border p-2.5 text-sm transition-all focus:outline-none focus:ring-2",
                  theme === 'dark' 
                    ? "bg-zinc-900 border-white/10 text-white focus:ring-white/20" 
                    : "bg-white border-zinc-200 text-zinc-950 focus:ring-black/5"
                )}
                placeholder="Enter project name..."
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-400">Description</label>
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className={cn(
                  "mt-1 w-full rounded-lg border p-2.5 text-sm transition-all focus:outline-none focus:ring-2 h-24",
                  theme === 'dark' 
                    ? "bg-zinc-900 border-white/10 text-white focus:ring-white/20" 
                    : "bg-white border-zinc-200 text-zinc-950 focus:ring-black/5"
                )}
                placeholder="Briefly describe the project goals..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
              <Button type="submit">Create Project</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <div className="col-span-full py-20 text-center text-zinc-500 italic">
            No projects found. Create one to get started.
          </div>
        ) : (
          projects.map((project) => (
            <div key={project.id}>
              <Card className="group relative hover:border-zinc-400 transition-all cursor-pointer h-full">
              <div className="flex justify-between items-start mb-4">
                <div className={cn(
                  "h-10 w-10 rounded-lg flex items-center justify-center transition-all",
                  theme === 'dark' 
                    ? "bg-white/5 text-white group-hover:bg-white group-hover:text-black" 
                    : "bg-black/5 text-zinc-900 group-hover:bg-black group-hover:text-white"
                )}>
                  <FolderOpen size={20} />
                </div>
                {user.role === 'Admin' && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteProject(project.id); }}
                    className="p-1 text-zinc-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription className="line-clamp-2 mt-2 min-h-[40px]">
                {project.description || 'No description provided.'}
              </CardDescription>
              
              <div className={cn("mt-6 pt-6 border-t flex items-center justify-between text-xs text-zinc-500", theme === 'dark' ? "border-white/5" : "border-zinc-100")}>
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {project.createdAt ? format((project.createdAt as any).toDate(), 'MMM d, yyyy') : 'Recently'}
                </div>
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={cn("h-6 w-6 rounded-full border shadow-sm", theme === 'dark' ? "border-black bg-zinc-800" : "border-white bg-zinc-200")} />
                  ))}
                  <div className={cn(
                    "h-6 w-6 rounded-full border flex items-center justify-center text-[10px] font-bold shadow-sm",
                    theme === 'dark' ? "border-black bg-zinc-700 text-white" : "border-white bg-zinc-400 text-white"
                  )}>
                    +{project.members?.length || 1}
                  </div>
                </div>
              </div>
            </Card>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
