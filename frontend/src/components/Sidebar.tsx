import { Home, CheckSquare, Users, MessageSquare, FolderKanban, LogOut, Zap, FolderOpen, UserCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { cn } from './ui/utils';
import { motion } from 'motion/react';
import { ScrollArea } from './ui/scroll-area';

interface SidebarProps {
  activeView: 'dashboard' | 'tasks' | 'team' | 'discussion' | 'projects' | 'teams' | 'files' | 'profile';
  onViewChange: (view: 'dashboard' | 'tasks' | 'team' | 'discussion' | 'projects' | 'teams' | 'files' | 'profile') => void;
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

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
    <nav className="card-premium border-b border-white/60 dark:border-white/20 shadow-xl sticky top-[81px] md:top-[89px] z-40 backdrop-blur-xl">
      <ScrollArea className="w-full">
        <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-500 group whitespace-nowrap flex-shrink-0',
                  isActive
                    ? 'text-white shadow-lg scale-105'
                    : 'btn-luxury text-gray-700 dark:text-gray-200 hover:scale-105 hover:shadow-md'
                )}
                style={isActive ? {
                  background: `linear-gradient(135deg, ${item.color}, ${item.color}dd)`,
                  boxShadow: `0 4px 16px ${item.color}50, 0 2px 8px ${item.color}30`
                } : {}}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg group-hover:scale-110 transition-transform duration-300">{item.emoji}</span>
                <span className="text-sm hidden sm:inline">{item.label}</span>
              </motion.button>
            );
          })}
          
          {/* Logout Button */}
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0"
          >
            <Button
              onClick={logout}
              variant="ghost"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-500 btn-luxury text-gray-700 dark:text-gray-200 hover:scale-105 hover:bg-red-50 dark:hover:bg-red-950/20 hover:shadow-md group whitespace-nowrap"
            >
              <span className="text-lg group-hover:scale-110 transition-transform duration-300">🚪</span>
              <span className="text-sm hidden sm:inline">{t('sidebar.logout')}</span>
            </Button>
          </motion.div>
        </div>
      </ScrollArea>
    </nav>
  );
}