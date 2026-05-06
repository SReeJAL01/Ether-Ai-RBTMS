import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, updateDoc, where } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { Task, Project, User, TaskStatus, TaskPriority } from '@/src/types';
import { Card, CardTitle, CardDescription } from './ui/Card';
import { Button } from './ui/Button';
import { Plus, Trash2, CheckCircle2, Clock, AlertTriangle, Filter, FolderOpen, User as UserIcon } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface TasksProps {
  user: User;
}

export function Tasks({ user }: TasksProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'All'>('All');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'All'>('All');
  const [assigneeFilter, setAssigneeFilter] = useState<string | 'All'>('All');

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newProjectId, setNewProjectId] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('Medium');

  useEffect(() => {
    const qTasks = query(collection(db, 'tasks'));
    const unsubscribeTasks = onSnapshot(qTasks, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
      setTasks(tasksData);
    });

    const qProjects = query(collection(db, 'projects'));
    const unsubscribeProjects = onSnapshot(qProjects, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      setProjects(projectsData);
      if (projectsData.length > 0 && !newProjectId) setNewProjectId(projectsData[0].id);
    });

    const qUsers = query(collection(db, 'users'));
    const unsubscribeUsers = onSnapshot(qUsers, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
      setUsers(usersData);
    });

    return () => {
      unsubscribeTasks();
      unsubscribeProjects();
      unsubscribeUsers();
    };
  }, []);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newProjectId) return;

    try {
      await addDoc(collection(db, 'tasks'), {
        title: newTitle,
        status: 'To Do',
        priority: newPriority,
        projectId: newProjectId,
        assignedTo: user.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setNewTitle('');
      setIsAdding(false);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const filteredTasks = tasks.filter(t => {
    const matchStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    const matchAssignee = assigneeFilter === 'All' || t.assignedTo === assigneeFilter;
    return matchStatus && matchPriority && matchAssignee;
  });

  const statusIcons = {
    'To Do': <Clock size={16} className="text-zinc-500" />,
    'In Progress': <Clock size={16} className="text-blue-500" />,
    'Done': <CheckCircle2 size={16} className="text-green-500" />,
  };

  const priorityColors = {
    'Low': 'bg-zinc-800 text-zinc-400',
    'Medium': 'bg-blue-500/10 text-blue-500',
    'High': 'bg-red-500/10 text-red-500',
  };

  return (
    <div className="space-y-8 animate-stagger-in">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Tasks</h2>
          <p className="text-zinc-400 mt-1">Track and manage your team assignments.</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="gap-2">
          <Plus size={18} />
          New Task
        </Button>
      </header>

      <div className="flex flex-wrap items-center gap-6 pb-2">
        <div className="flex items-center gap-2 text-zinc-500">
          <Filter size={16} />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        
        <div className="flex items-center gap-2">
          {(['All', 'To Do', 'In Progress', 'Done'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all border",
                statusFilter === s 
                  ? "bg-white text-black border-white" 
                  : "bg-zinc-900 text-zinc-500 border-white/5 hover:border-white/10"
              )}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-white/10" />

        <div className="flex items-center gap-3">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="bg-zinc-900 border border-white/5 text-[10px] font-bold uppercase rounded-md px-3 py-1.5 text-zinc-400 focus:outline-none focus:border-white/20 transition-colors"
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="bg-zinc-900 border border-white/5 text-[10px] font-bold uppercase rounded-md px-3 py-1.5 text-zinc-400 focus:outline-none focus:border-white/20 transition-colors"
          >
            <option value="All">All Assignees</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
      </div>

      {isAdding && (
        <Card className="border-white/20 bg-white/5">
          <form onSubmit={handleAddTask} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-zinc-400">Task Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="mt-1 w-full rounded-lg bg-zinc-900 border border-white/10 p-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="What needs to be done?"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-400">Project</label>
              <select
                value={newProjectId}
                onChange={(e) => setNewProjectId(e.target.value)}
                className="mt-1 w-full rounded-lg bg-zinc-900 border border-white/10 p-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                required
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-400">Priority</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                className="mt-1 w-full rounded-lg bg-zinc-900 border border-white/10 p-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
              <Button type="submit">Create Task</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-4">
        {filteredTasks.length === 0 ? (
          <div className="py-20 text-center text-zinc-500 italic">
            No tasks found. Get moving!
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} onClick={() => setSelectedTask(task)}>
              <Card className="p-4 flex items-center gap-6 border-white/5 hover:border-white/10 transition-all cursor-pointer">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange(task.id, task.status === 'Done' ? 'To Do' : 'Done');
                }}
                className={cn(
                  "h-6 w-6 rounded-md border flex items-center justify-center transition-all",
                  task.status === 'Done' 
                    ? "bg-green-500 border-green-500 text-black" 
                    : "border-white/20 text-transparent hover:border-white/40"
                )}
              >
                <CheckCircle2 size={16} />
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h4 className={cn(
                    "font-medium truncate",
                    task.status === 'Done' ? "text-zinc-500 line-through" : "text-white"
                  )}>
                    {task.title}
                  </h4>
                  <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase", priorityColors[task.priority])}>
                    {task.priority}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-1 flex flex-wrap items-center gap-x-6 gap-y-2">
                  <span className="flex items-center gap-1.5">
                    <FolderOpen size={12} />
                    {projects.find(p => p.id === task.projectId)?.title || 'Unknown Project'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <UserIcon size={12} />
                    {users.find(u => u.id === task.assignedTo)?.name || 'Unassigned'}
                  </span>
                  <span className="flex items-center gap-1.5 capitalize">
                    {statusIcons[task.status]}
                    {task.status}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={task.status}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
                  className="bg-zinc-900 border border-white/5 text-[10px] rounded px-2 py-1 text-zinc-400 focus:outline-none"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTask(task.id);
                  }}
                  className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
            </div>
          ))
        )}
      </div>

      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-2xl border-white/20 bg-zinc-950 p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold">Edit Task</h3>
              <Button variant="ghost" onClick={() => setSelectedTask(null)} size="sm">✕</Button>
            </div>

            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                try {
                  await updateDoc(doc(db, 'tasks', selectedTask.id), {
                    title: formData.get('title'),
                    description: formData.get('description'),
                    status: formData.get('status'),
                    priority: formData.get('priority'),
                    assignedTo: formData.get('assignedTo'),
                    projectId: formData.get('projectId'),
                    dueDate: formData.get('dueDate'),
                    updatedAt: serverTimestamp()
                  });
                  setSelectedTask(null);
                } catch (err) {
                  console.error(err);
                }
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="text-xs font-bold uppercase text-zinc-500 mb-2 block">Title</label>
                  <input
                    name="title"
                    defaultValue={selectedTask.title}
                    className="w-full rounded-lg bg-zinc-900 border border-white/10 p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-bold uppercase text-zinc-500 mb-2 block">Description</label>
                  <textarea
                    name="description"
                    defaultValue={selectedTask.description}
                    className="w-full rounded-lg bg-zinc-900 border border-white/10 p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20 h-32"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-zinc-500 mb-2 block">Status</label>
                  <select
                    name="status"
                    defaultValue={selectedTask.status}
                    className="w-full rounded-lg bg-zinc-900 border border-white/10 p-3 text-sm text-white focus:outline-none"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-zinc-500 mb-2 block">Priority</label>
                  <select
                    name="priority"
                    defaultValue={selectedTask.priority}
                    className="w-full rounded-lg bg-zinc-900 border border-white/10 p-3 text-sm text-white focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-zinc-500 mb-2 block">Assignee</label>
                  <select
                    name="assignedTo"
                    defaultValue={selectedTask.assignedTo}
                    className="w-full rounded-lg bg-zinc-900 border border-white/10 p-3 text-sm text-white focus:outline-none"
                  >
                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-zinc-500 mb-2 block">Project</label>
                  <select
                    name="projectId"
                    defaultValue={selectedTask.projectId}
                    className="w-full rounded-lg bg-zinc-900 border border-white/10 p-3 text-sm text-white focus:outline-none"
                  >
                    {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-zinc-500 mb-2 block">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    defaultValue={selectedTask.dueDate}
                    className="w-full rounded-lg bg-zinc-900 border border-white/10 p-3 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
                <Button type="button" variant="ghost" onClick={() => setSelectedTask(null)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
