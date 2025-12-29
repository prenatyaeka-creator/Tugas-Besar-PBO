import { useState } from 'react';
import { Plus, Calendar, MessageSquare, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { TaskDetail } from './TaskDetail';

export function TaskBoard() {
  const { tasks, projects, addTask, getCommentsByTask } = useData();
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    projectId: '',
    assigneeId: '',
    deadline: '',
    priority: 'medium' as const,
  });

  // Get users from localStorage
  const usersData = localStorage.getItem('taskmate_users');
  const users = usersData ? JSON.parse(usersData) : [];

  const columns = [
    { id: 'todo', title: 'To Do', color: '#E88C7D', emoji: '📝' },
    { id: 'inprogress', title: 'In Progress', color: '#6D597A', emoji: '⚡' },
    { id: 'done', title: 'Done', color: '#B56576', emoji: '✅' },
  ];

  const handleAddTask = () => {
    if (newTask.title && newTask.description && newTask.projectId && user) {
      addTask({
        ...newTask,
        status: 'todo',
        assigneeId: newTask.assigneeId || user.id,
        createdBy: user.id,
      });
      setNewTask({ title: '', description: '', projectId: '', assigneeId: '', deadline: '', priority: 'medium' });
      setIsDialogOpen(false);
    }
  };

  const getUserById = (id: string) => {
    return users.find((u: any) => u.id === id);
  };

  const priorityColors = {
    high: '#E56B6F',
    medium: '#E88C7D',
    low: '#EAAC8B',
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between glass-card rounded-2xl p-4 md:p-6 border-white/40 shadow-xl gap-4 animate-slide-down hover-lift">
        <div>
          <h2 className="gradient-text flex items-center gap-2">
            <span>✅</span> Daftar Tugas
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Kelola dan pantau progres tugas tim Anda</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gradient text-white border-0 shadow-lg shadow-[#B56576]/50 w-full md:w-auto hover-lift group">
              <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              Tambah Tugas
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-white/40 w-[95vw] max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="bg-gradient-to-r from-[#355070] to-[#B56576] bg-clip-text text-transparent flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#EAAC8B]" />
                Buat Tugas Baru
              </DialogTitle>
              <DialogDescription className="sr-only">
                Form untuk membuat tugas baru dengan detail proyek, judul, deskripsi, dan prioritas
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
              <div>
                <Label htmlFor="project" className="text-gray-800 dark:text-gray-200">Proyek</Label>
                <Select value={newTask.projectId} onValueChange={(value) => setNewTask({ ...newTask, projectId: value })}>
                  <SelectTrigger className="glass border-white/40 mt-1">
                    <SelectValue placeholder="Pilih proyek" />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/40">
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        📁 {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="title" className="text-gray-800 dark:text-gray-200">Judul Tugas</Label>
                <Input
                  id="title"
                  placeholder="Masukkan judul tugas"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="glass border-white/40 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-gray-800 dark:text-gray-200">Deskripsi</Label>
                <Textarea
                  id="description"
                  placeholder="Deskripsikan tugas secara detail"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="glass border-white/40 mt-1"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="assignee" className="text-gray-800 dark:text-gray-200">Penanggung Jawab</Label>
                  <Select value={newTask.assigneeId} onValueChange={(value) => setNewTask({ ...newTask, assigneeId: value })}>
                    <SelectTrigger className="glass border-white/40 mt-1">
                      <SelectValue placeholder="Pilih anggota" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-white/40">
                      {users.map((u: any) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.role === 'admin' ? '👑' : '👤'} {u.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="deadline" className="text-gray-800 dark:text-gray-200">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newTask.deadline}
                    onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                    className="glass border-white/40 mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="priority" className="text-gray-800 dark:text-gray-200">Prioritas</Label>
                <Select value={newTask.priority} onValueChange={(value: 'high' | 'medium' | 'low') => setNewTask({ ...newTask, priority: value })}>
                  <SelectTrigger className="glass border-white/40 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/40">
                    <SelectItem value="high">🔥 Tinggi</SelectItem>
                    <SelectItem value="medium">⚡ Sedang</SelectItem>
                    <SelectItem value="low">🌱 Rendah</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddTask} className="w-full btn-gradient text-white border-0 shadow-lg hover-lift">
                Buat Tugas
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {projects.length === 0 && (
        <Card className="glass-card border-white/40 shadow-xl animate-scale-in">
          <CardContent className="p-8 md:p-12 text-center">
            <p className="text-4xl md:text-6xl mb-4 animate-bounce-in">📁</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">Belum ada proyek. {user?.role === 'admin' ? 'Buat proyek terlebih dahulu di menu Proyek.' : 'Hubungi admin untuk membuat proyek.'}</p>
          </CardContent>
        </Card>
      )}

      {projects.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {columns.map((column, colIndex) => (
            <div key={column.id} className="animate-slide-up" style={{ animationDelay: `${colIndex * 0.1}s` }}>
              <div className="flex items-center gap-2 mb-3 md:mb-4 glass-card rounded-xl p-3 border-white/40 hover-lift">
                <span className="text-xl md:text-2xl">{column.emoji}</span>
                <h3 className="text-sm md:text-base" style={{ color: column.color }}>{column.title}</h3>
                <Badge className="ml-auto text-white border-0 text-xs" style={{ backgroundColor: column.color }}>
                  {tasks.filter((t) => t.status === column.id).length}
                </Badge>
              </div>
              <div className="space-y-3">
                {tasks
                  .filter((task) => task.status === column.id)
                  .map((task, taskIndex) => {
                    const project = projects.find((p) => p.id === task.projectId);
                    const assignee = getUserById(task.assigneeId);
                    const commentCount = getCommentsByTask(task.id).length;

                    return (
                      <Card
                        key={task.id}
                        className="glass-card border-white/40 card-interactive cursor-pointer group animate-scale-in"
                        onClick={() => setSelectedTask(task.id)}
                        style={{ animationDelay: `${(colIndex * 0.1) + (taskIndex * 0.05)}s` }}
                      >
                        <CardContent className="p-3 md:p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-gray-900 dark:text-gray-100 flex-1 group-hover:text-[#355070] dark:group-hover:text-[#E88C7D] transition-colors text-sm md:text-base">{task.title}</h4>
                            <Badge
                              className="ml-2 text-white border-0 shadow-lg text-xs flex-shrink-0"
                              style={{ backgroundColor: priorityColors[task.priority] }}
                            >
                              {task.priority === 'high' ? '🔥' : task.priority === 'medium' ? '⚡' : '🌱'}
                            </Badge>
                          </div>
                          {project && (
                            <Badge
                              variant="secondary"
                              className="mb-2 glass border-white/40 text-xs"
                            >
                              📁 {project.name}
                            </Badge>
                          )}
                          <p className="text-gray-600 mb-3 md:mb-4 line-clamp-2 text-xs md:text-sm">{task.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 md:gap-3">
                              <div className="flex items-center gap-1 text-gray-500 glass-card px-2 py-1 rounded-lg">
                                <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                                <span className="text-xs">
                                  {new Date(task.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-gray-500 glass-card px-2 py-1 rounded-lg">
                                <MessageSquare className="w-3 h-3 md:w-4 md:h-4" />
                                <span className="text-xs">{commentCount}</span>
                              </div>
                            </div>
                            <Avatar className="w-7 h-7 md:w-8 md:h-8 ring-2 ring-[#B56576]/50">
                              <AvatarFallback className="bg-gradient-to-br from-[#355070] to-[#B56576] text-white text-xs">
                                {assignee?.initials || task.assigneeId}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                {tasks.filter((t) => t.status === column.id).length === 0 && (
                  <div className="glass-card border-white/40 rounded-xl p-6 md:p-8 text-center text-gray-400">
                    <p className="text-3xl md:text-4xl mb-2">{column.emoji}</p>
                    <p className="text-sm md:text-base">Tidak ada tugas</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTask && (
        <TaskDetail
          task={tasks.find((t) => t.id === selectedTask)!}
          open={!!selectedTask}
          onOpenChange={(open) => !open && setSelectedTask(null)}
        />
      )}
    </div>
  );
}