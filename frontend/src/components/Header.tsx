import { useState } from 'react';
import { Bell, Search, LogOut, Menu, Users, ChevronDown, Moon, Sun, RefreshCw, Home, CheckSquare, FolderKanban, FolderOpen, MessageSquare, Zap, UserCircle, X, CheckCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import { TaskMateLogo } from './TaskMateLogo';
import { ScrollArea } from './ui/scroll-area';
import { cn } from './ui/utils';
import { motion } from 'motion/react';

interface HeaderProps {
  onSwitchTeam?: () => void;
  activeView: 'dashboard' | 'tasks' | 'team' | 'discussion' | 'projects' | 'teams' | 'files' | 'profile';
  onViewChange: (view: 'dashboard' | 'tasks' | 'team' | 'discussion' | 'projects' | 'teams' | 'files' | 'profile') => void;
}

export function Header({ onSwitchTeam, activeView, onViewChange }: HeaderProps) {
  const { user, logout } = useAuth();
  const { currentTeam, getUserTeams, setCurrentTeam, getUserNotifications, getUnreadCount, markNotificationAsRead, deleteNotification } = useData();
  const { theme, toggleTheme } = useTheme();
  const { t, language, setLanguage } = useLanguage();
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const userTeams = user ? getUserTeams(user.id) : [];
  const userNotifications = user ? getUserNotifications(user.id) : [];
  const unreadCount = user ? getUnreadCount(user.id) : 0;

  const menuItems = [
    { id: 'dashboard' as const, label: t('sidebar.dashboard'), icon: Home, emoji: '🏠', color: '#355070', adminOnly: false },
    { id: 'tasks' as const, label: t('sidebar.tasks'), icon: CheckSquare, emoji: '✅', color: '#6D597A', adminOnly: false },
    { id: 'projects' as const, label: t('sidebar.projects'), icon: FolderKanban, emoji: '📁', color: '#B56576', adminOnly: true },
    { id: 'files' as const, label: t('sidebar.files'), icon: FolderOpen, emoji: '📂', color: '#E88C7D', adminOnly: false },
    { id: 'team' as const, label: t('sidebar.teams'), icon: Users, emoji: '👥', color: '#E56B6F', adminOnly: false },
    { id: 'discussion' as const, label: 'Diskusi', icon: MessageSquare, emoji: '💬', color: '#EAAC8B', adminOnly: false },
    { id: 'teams' as const, label: 'Kelola Tim', icon: Zap, emoji: '⚡', color: '#6D597A', adminOnly: true },
    { id: 'profile' as const, label: t('sidebar.profile'), icon: UserCircle, emoji: '👤', color: '#E56B6F', adminOnly: false },
  ];

  const visibleMenuItems = menuItems.filter(
    (item) => !item.adminOnly || user?.role === 'admin'
  );

  return (
    <header className="card-premium border-b border-white/60 dark:border-white/20 sticky top-0 z-50 shadow-2xl transition-all duration-500 animate-slide-down backdrop-blur-2xl">
      <div className="flex items-center justify-between px-4 md:px-6 py-4 md:py-5">
        <div className="flex items-center gap-3 md:gap-8">
          <div className="smooth-hover hover:scale-110 transition-all duration-500 cursor-pointer">
            <TaskMateLogo size={48} showText={true} className="hidden md:flex" />
            <TaskMateLogo size={38} showText={false} className="md:hidden" />
          </div>

          {/* Team Switcher */}
          {userTeams.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="btn-luxury border-white/60 dark:border-white/20 hover:bg-[#E88C7D]/10 hidden lg:flex items-center gap-3 smooth-hover hover-lift shadow-lg px-5 py-6">
                  <div
                    className="w-7 h-7 rounded-xl flex items-center justify-center smooth-hover shadow-lg"
                    style={{ backgroundColor: currentTeam?.color || '#355070' }}
                  >
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-800 dark:text-gray-200 max-w-[120px] xl:max-w-[200px] truncate">
                    {currentTeam?.name || 'Pilih Tim'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="card-premium border-white/60 dark:border-white/20 w-72 animate-scale-in shadow-2xl">
                <DropdownMenuLabel className="dark:text-gray-200">Tim Saya</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/30 dark:bg-white/10" />
                {userTeams.map((team) => (
                  <DropdownMenuItem
                    key={team.id}
                    onClick={() => setCurrentTeam(team.id)}
                    className={`hover:bg-[#E88C7D]/10 smooth-hover ${currentTeam?.id === team.id ? 'bg-[#E88C7D]/10' : ''}`}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: team.color }}
                      >
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 dark:text-gray-200 truncate">{team.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{team.members.length} anggota</p>
                      </div>
                      {currentTeam?.id === team.id && (
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#355070] to-[#B56576]"></div>
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          {/* Desktop Search */}
          <div className="relative w-64 xl:w-96 hidden md:block">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <Input
              placeholder="Cari tugas, anggota, atau diskusi..."
              className="pl-12 input-luxury border-white/60 dark:border-white/20 focus:border-[#B56576] smooth-hover h-12 rounded-xl shadow-lg"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3 md:gap-4">
          {/* Mobile Search Button */}
          <Button variant="ghost" size="icon" className="md:hidden btn-luxury hover:bg-[#E88C7D]/10 smooth-hover shadow-lg">
            <Search className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </Button>

          {/* Language Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
            className="btn-luxury hover:bg-[#E88C7D]/10 smooth-hover hover:scale-110 shadow-lg w-11 h-11"
            title={language === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
            aria-label={language === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
          >
            <span className="text-sm pointer-events-none">
              {language === 'id' ? 'ID' : 'EN'}
            </span>
          </Button>

          {/* Dark Mode Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="btn-luxury hover:bg-[#E88C7D]/10 smooth-hover hover:scale-110 shadow-lg w-11 h-11"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
            )}
          </Button>
          
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative btn-luxury hover:bg-[#E88C7D]/10 smooth-hover shadow-lg w-11 h-11">
                <Bell className="w-5 h-5 md:w-6 md:h-6 text-gray-700 dark:text-gray-300" />
                {unreadCount > 0 && (
                  <>
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-gradient-to-r from-[#E56B6F] to-[#E88C7D] rounded-full animate-pulse shadow-lg"></span>
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#E56B6F] to-[#E88C7D] rounded-full flex items-center justify-center text-white text-xs shadow-lg">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="card-premium border-white/60 dark:border-white/20 w-80 md:w-96 animate-scale-in shadow-2xl p-0">
              <div className="p-4 border-b border-white/40 dark:border-white/20">
                <div className="flex items-center justify-between">
                  <DropdownMenuLabel className="text-lg dark:text-gray-200 p-0">
                    🔔 Notifikasi
                  </DropdownMenuLabel>
                  {unreadCount > 0 && (
                    <Badge className="bg-gradient-to-r from-[#E56B6F] to-[#E88C7D] text-white border-0">
                      {unreadCount} baru
                    </Badge>
                  )}
                </div>
              </div>
              <ScrollArea className="max-h-[400px]">
                <div className="p-2">
                  {userNotifications.length > 0 ? (
                    userNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          'group relative p-3 rounded-lg transition-all duration-300 mb-2',
                          notification.isRead 
                            ? 'bg-white/30 dark:bg-white/5' 
                            : 'bg-gradient-to-r from-[#E88C7D]/20 to-[#EAAC8B]/20 dark:from-[#E88C7D]/10 dark:to-[#EAAC8B]/10'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 dark:text-gray-100 mb-1">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              {new Date(notification.createdAt).toLocaleString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markNotificationAsRead(notification.id);
                                }}
                              >
                                <CheckCheck className="w-4 h-4 text-green-600" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                            >
                              <X className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Tidak ada notifikasi</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 btn-luxury hover:bg-[#E88C7D]/10 smooth-hover px-3 md:px-4 shadow-lg hover:shadow-xl">
                <Avatar className="ring-2 ring-[#B56576]/60 shadow-lg w-10 h-10 md:w-11 md:h-11 smooth-hover hover:scale-110">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-to-br from-[#355070] to-[#B56576] text-white text-sm">
                    {user?.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left hidden xl:block">
                  <p className="text-gray-800 dark:text-gray-200 text-sm">{user?.name}</p>
                  <Badge className="text-xs btn-gradient text-white border-0 shadow-md">
                    {user?.role === 'admin' ? '👑 Admin' : '👤 Member'}
                  </Badge>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="card-premium border-white/60 dark:border-white/20 animate-scale-in shadow-2xl">
              <DropdownMenuLabel>
                <div className="xl:hidden">
                  <p className="text-sm dark:text-gray-200">{user?.name}</p>
                  <Badge className="text-xs bg-gradient-to-r from-[#355070] to-[#B56576] text-white border-0 mt-1">
                    {user?.role === 'admin' ? '👑 Admin' : '👤 Member'}
                  </Badge>
                </div>
                <div className="hidden xl:block dark:text-gray-200">Akun Saya</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/30 dark:bg-white/10" />
              {onSwitchTeam && (
                <DropdownMenuItem onClick={onSwitchTeam} className="hover:bg-[#E88C7D]/10 smooth-hover">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Ganti Tim
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={logout} className="hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 smooth-hover">
                <LogOut className="w-4 h-4 mr-2" />
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <Input
            placeholder="Cari..."
            className="pl-10 glass border-white/40 dark:border-white/10 dark:bg-white/5 focus:border-[#B56576]"
          />
        </div>
      </div>

      {/* Tab Navigation Bar - Full Width with Expanding Labels */}
      <div className="border-t border-white/40 dark:border-white/20 bg-white/30 dark:bg-black/20 backdrop-blur-sm overflow-hidden">
        <div className="flex items-center justify-center gap-2 py-4 sm:py-5 px-2">
          {visibleMenuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            const isHovered = hoveredTab === item.id;
            const showLabel = isActive || isHovered;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                onMouseEnter={() => setHoveredTab(item.id)}
                onMouseLeave={() => setHoveredTab(null)}
                className={cn(
                  'group relative flex items-center justify-center gap-2 h-14 rounded-xl sm:rounded-2xl overflow-hidden transition-colors',
                  isActive
                    ? 'text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-200'
                )}
                style={isActive ? {
                  background: `linear-gradient(135deg, ${item.color}, ${item.color}dd)`,
                  boxShadow: `0 4px 16px ${item.color}50, 0 2px 8px ${item.color}30`
                } : {}}
                animate={{
                  width: showLabel ? 'auto' : '3.5rem',
                  paddingLeft: showLabel ? '1rem' : '0',
                  paddingRight: showLabel ? '1rem' : '0',
                  y: showLabel ? -4 : 0,
                }}
                whileTap={{ 
                  scale: 0.96,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 450,
                  damping: 35,
                  mass: 0.7
                }}
              >
                {/* Hover background for non-active items */}
                {!isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-xl sm:rounded-2xl -z-10"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: isHovered ? 1 : 0,
                    }}
                    transition={{ 
                      duration: 0.2
                    }}
                    style={{
                      background: `linear-gradient(135deg, ${item.color}25, ${item.color}40)`
                    }}
                  />
                )}
                
                {/* Content wrapper for better alignment */}
                <div className="flex items-center gap-1.5">
                  {/* Emoji/Icon - Always visible */}
                  <motion.span 
                    className="text-2xl flex-shrink-0"
                    animate={{ 
                      scale: isActive ? 1.1 : 1,
                      rotate: isHovered && !isActive ? [0, -8, 8, -4, 4, 0] : 0
                    }}
                    transition={{ 
                      scale: { 
                        type: 'spring',
                        stiffness: 450,
                        damping: 25
                      },
                      rotate: { 
                        duration: 0.5
                      }
                    }}
                  >
                    {item.emoji}
                  </motion.span>
                  
                  {/* Label - Expands on hover/active */}
                  {showLabel && (
                    <motion.span
                      className="whitespace-nowrap text-sm overflow-hidden"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{
                        opacity: 1,
                        width: 'auto',
                      }}
                      exit={{
                        opacity: 0,
                        width: 0,
                      }}
                      transition={{
                        opacity: { 
                          duration: 0.2,
                          delay: 0.05
                        },
                        width: { 
                          type: 'spring',
                          stiffness: 450,
                          damping: 35,
                          mass: 0.7
                        }
                      }}
                      style={{
                        fontWeight: isActive ? '600' : '500',
                      }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </div>
                
                {/* Active indicator with motion */}
                {isActive && (
                  <motion.div
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-[70%] bg-white rounded-full shadow-lg"
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ 
                      opacity: 1,
                      scaleX: 1
                    }}
                    transition={{ 
                      type: 'spring',
                      stiffness: 450,
                      damping: 35
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </header>
  );
}