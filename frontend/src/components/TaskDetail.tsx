import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Task, useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Calendar, MessageSquare, User, Send, FolderOpen } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { FileManager } from './FileManager';

interface TaskDetailProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskDetail({ task, open, onOpenChange }: TaskDetailProps) {
  const { getCommentsByTask, addComment, projects } = useData();
  const { user } = useAuth();
  const [commentInput, setCommentInput] = useState('');

  const comments = getCommentsByTask(task.id);
  const project = projects.find((p) => p.id === task.projectId);

  const handleAddComment = () => {
    if (!commentInput.trim() || !user) return;

    addComment({
      taskId: task.id,
      userId: user.id,
      userName: user.name,
      userInitials: user.initials,
      message: commentInput,
    });

    setCommentInput('');
  };

  const priorityColors = {
    high: '#E56B6F',
    medium: '#E88C7D',
    low: '#EAAC8B',
  };

  const statusColors = {
    todo: '#B56576',
    inprogress: '#E88C7D',
    done: '#6D597A',
  };

  const statusLabels = {
    todo: 'To Do',
    inprogress: 'In Progress',
    done: 'Done',
  };

  const priorityLabels = {
    high: 'Tinggi',
    medium: 'Sedang',
    low: 'Rendah',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col glass-card border-white/40">
        <DialogHeader>
          <DialogTitle className="bg-gradient-to-r from-[#355070] to-[#B56576] bg-clip-text text-transparent">
            {task.title}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Detail lengkap tugas termasuk status, prioritas, komentar, dan berkas terkait
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="glass border-white/40">
            <TabsTrigger value="details" className="data-[state=active]:bg-[#E88C7D]/20">
              <MessageSquare className="w-4 h-4 mr-2" />
              Detail & Komentar
            </TabsTrigger>
            <TabsTrigger value="files" className="data-[state=active]:bg-[#E88C7D]/20">
              <FolderOpen className="w-4 h-4 mr-2" />
              Berkas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="flex-1 overflow-y-auto mt-4 space-y-6">
            {/* Task Info */}
            <div className="space-y-4">
            <div className="flex gap-2">
              <Badge style={{ backgroundColor: statusColors[task.status] }}>
                {statusLabels[task.status]}
              </Badge>
              <Badge
                variant="outline"
                style={{ borderColor: priorityColors[task.priority], color: priorityColors[task.priority] }}
              >
                {priorityLabels[task.priority]}
              </Badge>
              {project && (
                <Badge variant="secondary" style={{ backgroundColor: `${project.color}20`, color: project.color }}>
                  {project.name}
                </Badge>
              )}
            </div>

            <div>
              <h3 className="text-[#355070] dark:text-[#E88C7D] mb-2">Deskripsi</h3>
              <p className="text-gray-900 dark:text-gray-100">{task.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Deadline</p>
                  <p className="text-gray-900 dark:text-gray-100">
                    {new Date(task.deadline).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-4 h-4" />
                <div>
                  <p className="text-gray-500">Penanggung Jawab</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-[#355070] text-white text-xs">
                        {task.assigneeId}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-gray-900 dark:text-gray-100">{task.assigneeId}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

            {/* Comments Section */}
            <div className="border-t pt-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-[#355070]" />
                <h3 className="text-[#355070]">Komentar ({comments.length})</h3>
              </div>

              <ScrollArea className="h-64 mb-4">
                <div className="space-y-4 pr-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-[#6D597A] text-white text-xs">
                          {comment.userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 glass-card rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[#355070]">{comment.userName}</span>
                          <span className="text-gray-400">
                            {new Date(comment.createdAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-gray-900 dark:text-gray-100">{comment.message}</p>
                      </div>
                    </div>
                  ))}

                  {comments.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      Belum ada komentar. Jadilah yang pertama berkomentar!
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="flex gap-2">
                <Textarea
                  placeholder="Tulis komentar..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment();
                    }
                  }}
                  className="flex-1 glass border-white/40"
                />
                <Button
                  onClick={handleAddComment}
                  className="bg-gradient-to-r from-[#355070] to-[#B56576] hover:from-[#355070]/90 hover:to-[#B56576]/90 text-white border-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="files" className="flex-1 overflow-y-auto mt-4">
            <FileManager taskId={task.id} projectId={task.projectId} viewMode="task" />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
