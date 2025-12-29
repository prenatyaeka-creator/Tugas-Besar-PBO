import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CheckCircle2, Clock, AlertCircle, TrendingUp, FolderKanban, Zap, Calendar as CalendarIcon, ChevronRight } from 'lucide-react';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';

interface DashboardProps {
  onNavigate: (view: 'dashboard' | 'tasks' | 'team' | 'discussion' | 'projects') => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { tasks, projects, currentTeam } = useData();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Filter tasks and projects by current team
  const teamTasks = currentTeam ? tasks.filter(t => t.teamId === currentTeam.id) : [];
  const teamProjects = currentTeam ? projects.filter(p => p.teamId === currentTeam.id) : [];

  // Get users from localStorage
  const usersData = localStorage.getItem('taskmate_users');
  const users = usersData ? JSON.parse(usersData) : [];

  const getUserById = (id: string) => {
    return users.find((u: any) => u.id === id);
  };

  const stats = [
    { label: 'Total Tugas', value: teamTasks.length.toString(), icon: CheckCircle2, color: '#355070', emoji: '📊' },
    { label: 'Sedang Dikerjakan', value: teamTasks.filter((t) => t.status === 'inprogress').length.toString(), icon: Clock, color: '#6D597A', emoji: '⚡' },
    { label: 'Mendesak', value: teamTasks.filter((t) => t.priority === 'high').length.toString(), icon: AlertCircle, color: '#E56B6F', emoji: '🔥' },
    { label: 'Selesai', value: teamTasks.filter((t) => t.status === 'done').length.toString(), icon: TrendingUp, color: '#B56576', emoji: '✅' },
  ];

  const recentTasks = teamTasks.slice(0, 4);

  const upcomingDeadlines = teamTasks
    .filter((t) => t.status !== 'done')
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 5);

  const statusColors = {
    todo: '#E88C7D',
    inprogress: '#6D597A',
    done: '#B56576',
  };

  const statusLabels = {
    todo: 'To Do',
    inprogress: 'In Progress',
    done: 'Done',
  };

  // Get tasks for selected date
  const getTasksForDate = (date: Date) => {
    return teamTasks.filter((task) => {
      const taskDate = new Date(task.deadline);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  // Get dates with tasks for styling
  const getDatesWithTasks = () => {
    const dates: { [key: string]: { count: number; hasHighPriority: boolean } } = {};
    teamTasks.forEach((task) => {
      const date = new Date(task.deadline);
      const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      if (!dates[dateKey]) {
        dates[dateKey] = { count: 0, hasHighPriority: false };
      }
      dates[dateKey].count++;
      if (task.priority === 'high' && task.status !== 'done') {
        dates[dateKey].hasHighPriority = true;
      }
    });
    return dates;
  };

  const datesWithTasks = getDatesWithTasks();

  const modifiers = {
    hasTasks: (date: Date) => {
      const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      return !!datesWithTasks[dateKey];
    },
    hasHighPriority: (date: Date) => {
      const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      return datesWithTasks[dateKey]?.hasHighPriority || false;
    },
  };

  const modifiersStyles = {
    hasTasks: {
      background: 'linear-gradient(135deg, #B56576, #E88C7D)',
      color: 'white',
      fontWeight: 'bold',
    } as React.CSSProperties,
    hasHighPriority: {
      background: 'linear-gradient(135deg, #E56B6F, #E88C7D)',
      color: 'white',
      fontWeight: 'bold',
      animation: 'pulse 2s ease-in-out infinite',
    } as React.CSSProperties,
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="card-premium rounded-3xl p-6 md:p-8 border-white/60 dark:border-white/20 shadow-2xl animate-slide-down hover-lift">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-[#355070] to-[#B56576] flex items-center justify-center shadow-2xl animate-pulse-glow">
            <Zap className="w-7 h-7 md:w-8 md:h-8 text-white" />
          </div>
          <div>
            <h2 className="gradient-text text-3xl md:text-4xl">Dashboard</h2>
            <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg mt-1">Selamat datang kembali, {user?.name}! ✨</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={stat.label} 
              className="card-premium border-white/60 dark:border-white/20 shadow-2xl card-interactive group animate-scale-in overflow-hidden relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-transparent group-hover:from-[#355070]/5 group-hover:to-[#E88C7D]/5 transition-all duration-700"></div>
              <CardContent className="p-5 md:p-8 relative z-10">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="w-full">
                    <p className="text-gray-600 dark:text-gray-400 mb-2 text-sm md:text-base">{stat.label}</p>
                    <p className="text-3xl md:text-5xl group-hover:scale-110 transition-transform duration-500" style={{ color: stat.color }}>{stat.value}</p>
                  </div>
                  <div 
                    className="w-16 h-16 md:w-20 md:h-20 rounded-3xl flex items-center justify-center shadow-2xl group-hover:rotate-12 group-hover:scale-110 transition-all duration-500"
                    style={{ 
                      backgroundColor: stat.color,
                      boxShadow: `0 8px 32px ${stat.color}50, 0 4px 16px ${stat.color}30`
                    }}
                  >
                    <span className="text-3xl md:text-4xl">{stat.emoji}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Calendar and Tasks Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Calendar */}
        <Card className="lg:col-span-1 card-premium border-white/60 dark:border-white/20 shadow-2xl hover-lift">
          <CardHeader className="p-6">
            <CardTitle className="bg-gradient-to-r from-[#355070] to-[#B56576] bg-clip-text text-transparent flex items-center gap-3 text-xl md:text-2xl">
              <span className="text-2xl">📅</span> Kalender Tugas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="card-premium p-4 rounded-2xl border-white/60 dark:border-white/20 shadow-lg">
              <style>{`
                .rdp-day_selected {
                  background: linear-gradient(135deg, #355070, #B56576) !important;
                  color: white !important;
                }
                .rdp-day_today {
                  background: rgba(53, 80, 112, 0.1) !important;
                  font-weight: bold !important;
                }
                .rdp {
                  --rdp-cell-size: 36px;
                }
                @media (max-width: 768px) {
                  .rdp {
                    --rdp-cell-size: 32px;
                  }
                }
              `}</style>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
                className="rounded-lg"
              />
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs md:text-sm">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-[#B56576] to-[#E88C7D]"></div>
                <span className="text-gray-600">Ada Tugas</span>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-[#E56B6F] to-[#E88C7D] animate-pulse"></div>
                <span className="text-gray-600">Prioritas Tinggi</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks for Selected Date */}
        <Card className="lg:col-span-2 card-premium border-white/60 dark:border-white/20 shadow-2xl hover-lift">
          <CardHeader className="p-6">
            <CardTitle className="bg-gradient-to-r from-[#355070] to-[#B56576] bg-clip-text text-transparent flex items-center gap-3 text-xl md:text-2xl">
              <CalendarIcon className="w-6 h-6" />
              Tugas pada {selectedDate?.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {selectedDateTasks.length > 0 ? (
                selectedDateTasks.map((task) => {
                  const project = teamProjects.find((p) => p.id === task.projectId);
                  const assignee = getUserById(task.assigneeId);
                  const priorityColor = task.priority === 'high' ? '#E56B6F' : task.priority === 'medium' ? '#E88C7D' : '#EAAC8B';

                  return (
                    <div 
                      key={task.id} 
                      className="card-premium p-4 md:p-5 rounded-2xl border-white/60 dark:border-white/20 hover:shadow-2xl transition-all duration-500 cursor-pointer group hover-lift"
                      onClick={() => onNavigate('tasks')}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-gray-900 dark:text-gray-100 group-hover:text-[#355070] dark:group-hover:text-[#E88C7D] transition-colors text-base md:text-lg">{task.title}</h3>
                            <Badge
                              className="text-white border-0 shadow-lg"
                              style={{ 
                                backgroundColor: priorityColor,
                                boxShadow: `0 4px 12px ${priorityColor}40`
                              }}
                            >
                              {task.priority === 'high' ? '🔥' : task.priority === 'medium' ? '⚡' : '🌱'}
                            </Badge>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base mb-3 line-clamp-2">{task.description}</p>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge
                              className="text-white border-0 shadow-md"
                              style={{ backgroundColor: statusColors[task.status] }}
                            >
                              {statusLabels[task.status]}
                            </Badge>
                            {project && (
                              <Badge variant="secondary" className="btn-luxury border-white/60 dark:border-white/20">
                                📁 {project.name}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Avatar className="w-10 h-10 md:w-12 md:h-12 ring-2 ring-[#B56576]/60 shadow-lg ml-3">
                          <AvatarFallback className="bg-gradient-to-br from-[#355070] to-[#B56576] text-white text-sm">
                            {assignee?.initials || task.assigneeId}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 md:py-12 text-gray-400">
                  <p className="text-3xl md:text-4xl mb-2">📭</p>
                  <p className="text-sm md:text-base">Tidak ada tugas pada tanggal ini</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Overview */}
      {teamProjects.length > 0 && (
        <Card className="glass-card border-white/40 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="bg-gradient-to-r from-[#355070] to-[#B56576] bg-clip-text text-transparent flex items-center gap-2 text-base md:text-lg">
                <span>📁</span> Proyek Aktif
              </CardTitle>
              {user?.role === 'admin' && (
                <button
                  onClick={() => onNavigate('projects')}
                  className="text-[#355070] hover:text-[#B56576] transition-colors text-sm md:text-base"
                >
                  Lihat Semua →
                </button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {teamProjects.slice(0, 3).map((project) => {
                const projectTasks = teamTasks.filter((t) => t.projectId === project.id);
                const completedTasks = projectTasks.filter((t) => t.status === 'done').length;
                const progress = projectTasks.length > 0 ? (completedTasks / projectTasks.length) * 100 : 0;

                return (
                  <div key={project.id} className="glass-card p-3 md:p-4 rounded-xl border-white/40 hover:shadow-lg transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shadow-lg"
                        style={{ backgroundColor: project.color }}
                      >
                        <FolderKanban className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-gray-900 dark:text-gray-100 text-sm md:text-base">{project.name}</h3>
                        <p className="text-gray-500 text-xs md:text-sm">{projectTasks.length} Tugas</p>
                      </div>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Recent Tasks */}
        <Card className="lg:col-span-2 glass-card border-white/40 shadow-xl">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-[#355070] to-[#B56576] bg-clip-text text-transparent flex items-center gap-2 text-base md:text-lg">
              <span>🎯</span> Tugas Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              {recentTasks.map((task) => {
                const project = teamProjects.find((p) => p.id === task.projectId);
                const assignee = getUserById(task.assigneeId);
                const progressValue = task.status === 'done' ? 100 : task.status === 'inprogress' ? 50 : 0;

                return (
                  <div key={task.id} className="glass-card p-3 md:p-4 rounded-xl border-white/40 hover:shadow-lg transition-all cursor-pointer group" onClick={() => onNavigate('tasks')}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-gray-900 dark:text-gray-100 group-hover:text-[#355070] dark:group-hover:text-[#E88C7D] transition-colors text-sm md:text-base">{task.title}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <Badge
                            className="text-white border-0 text-xs"
                            style={{ backgroundColor: statusColors[task.status] }}
                          >
                            {statusLabels[task.status]}
                          </Badge>
                          {project && (
                            <Badge variant="secondary" className="glass border-white/40 text-xs">
                              {project.name}
                            </Badge>
                          )}
                          <span className="text-gray-500 text-xs">· {new Date(task.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                        </div>
                      </div>
                      <Avatar className="w-8 h-8 md:w-10 md:h-10 ring-2 ring-[#B56576]/50 ml-2">
                        <AvatarFallback className="bg-gradient-to-br from-[#355070] to-[#B56576] text-white text-xs">
                          {assignee?.initials || task.assigneeId}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <Progress value={progressValue} className="h-2" />
                  </div>
                );
              })}
              {recentTasks.length === 0 && (
                <div className="text-center py-8 md:py-12 text-gray-400">
                  <p className="text-3xl md:text-4xl mb-2">📝</p>
                  <p className="text-sm md:text-base">Belum ada tugas. Mulai buat tugas pertama Anda!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card className="glass-card border-white/40 shadow-xl">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-[#355070] to-[#B56576] bg-clip-text text-transparent flex items-center gap-2 text-base md:text-lg">
              <span>⏰</span> Deadline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              {upcomingDeadlines.map((task) => {
                const priorityColor = task.priority === 'high' ? '#E56B6F' : task.priority === 'medium' ? '#E88C7D' : '#EAAC8B';
                return (
                  <div key={task.id} className="flex items-start gap-3 glass-card p-3 rounded-xl border-white/40 hover:shadow-lg transition-all">
                    <div 
                      className="w-3 h-3 rounded-full mt-2 shadow-lg flex-shrink-0" 
                      style={{ backgroundColor: priorityColor }}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 dark:text-gray-100 text-sm md:text-base truncate">{task.title}</p>
                      <p className="text-gray-500 text-xs md:text-sm">
                        {new Date(task.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                );
              })}
              {upcomingDeadlines.length === 0 && (
                <div className="text-center py-8 md:py-12 text-gray-400">
                  <p className="text-3xl md:text-4xl mb-2">🎉</p>
                  <p className="text-sm md:text-base">Tidak ada deadline mendatang</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}