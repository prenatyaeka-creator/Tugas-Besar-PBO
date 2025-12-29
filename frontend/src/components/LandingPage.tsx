import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { TaskMateLogo } from './TaskMateLogo';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  Users, 
  Calendar, 
  MessageSquare, 
  FolderOpen, 
  Zap, 
  Mail, 
  Phone, 
  MapPin, 
  Target, 
  Eye, 
  Heart,
  Send,
  Moon,
  Sun,
  Menu,
  X
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { toast } from 'sonner@2.0.3';

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
}

export function LandingPage({ onLogin, onRegister }: LandingPageProps) {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  // Advanced scroll animations with direction detection
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [lastScrollY, setLastScrollY] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Track scroll direction
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection('up');
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Intersection Observer with improved thresholds
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          } else {
            // Remove from visible when scrolling out (for re-animation)
            setVisibleSections((prev) => {
              const newSet = new Set(prev);
              newSet.delete(entry.target.id);
              return newSet;
            });
          }
        });
      },
      { threshold: 0.15, rootMargin: '-50px 0px -50px 0px' }
    );

    // Observe all sections
    const sections = document.querySelectorAll('[data-scroll-section]');
    sections.forEach((section) => {
      if (observerRef.current) {
        observerRef.current.observe(section);
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [lastScrollY]);

  const features = [
    {
      icon: <CheckCircle2 className="w-8 h-8" strokeWidth={2.5} />,
      title: t('feature.taskManagement'),
      description: t('feature.taskManagement.desc'),
      color: '#4A6FA5',
      gradientFrom: '#5B7EC8',
      gradientTo: '#355070',
    },
    {
      icon: <Users className="w-8 h-8" strokeWidth={2.5} />,
      title: t('feature.teamCollaboration'),
      description: t('feature.teamCollaboration.desc'),
      color: '#8B6FA0',
      gradientFrom: '#A584C7',
      gradientTo: '#6D597A',
    },
    {
      icon: <Calendar className="w-8 h-8" strokeWidth={2.5} />,
      title: t('feature.calendar'),
      description: t('feature.calendar.desc'),
      color: '#D97891',
      gradientFrom: '#FF8FA3',
      gradientTo: '#B56576',
    },
    {
      icon: <MessageSquare className="w-8 h-8" strokeWidth={2.5} />,
      title: t('feature.discussion'),
      description: t('feature.discussion.desc'),
      color: '#FF7A7E',
      gradientFrom: '#FF9B9F',
      gradientTo: '#E56B6F',
    },
    {
      icon: <FolderOpen className="w-8 h-8" strokeWidth={2.5} />,
      title: t('feature.fileManagement'),
      description: t('feature.fileManagement.desc'),
      color: '#FFA694',
      gradientFrom: '#FFC3B6',
      gradientTo: '#E88C7D',
    },
    {
      icon: <Zap className="w-8 h-8" strokeWidth={2.5} />,
      title: t('feature.multiTeam'),
      description: t('feature.multiTeam.desc'),
      color: '#FFC4A3',
      gradientFrom: '#FFD9BB',
      gradientTo: '#EAAC8B',
    },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending message
    console.log('Contact form submitted:', contactForm);
    toast.success(t('contact.form.success'));
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F0] via-[#FFE8E0] to-[#FFD6CC] dark:from-[#1a1625] dark:via-[#251d30] dark:to-[#2d2438] gradient-mesh transition-colors duration-300">
      {/* Decorative floating blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#355070]/20 dark:bg-[#355070]/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 right-20 w-[500px] h-[500px] bg-[#B56576]/20 dark:bg-[#B56576]/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-[450px] h-[450px] bg-[#E88C7D]/20 dark:bg-[#E88C7D]/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 glass-card border-b border-white/40 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TaskMateLogo size={40} showText={true} />
            </div>

            <div className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-gray-700 dark:text-gray-300 hover:text-[#B56576] dark:hover:text-[#E88C7D] transition-colors"
              >
                {t('landing.features')}
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-gray-700 dark:text-gray-300 hover:text-[#B56576] dark:hover:text-[#E88C7D] transition-colors"
              >
                {t('landing.aboutUs')}
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-gray-700 dark:text-gray-300 hover:text-[#B56576] dark:hover:text-[#E88C7D] transition-colors"
              >
                {t('landing.contact')}
              </button>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              {/* Language Switcher */}
              <div className="flex gap-1 card-premium p-1.5 rounded-xl shadow-lg">
                <button
                  onClick={() => setLanguage('id')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer ${
                    language === 'id'
                      ? 'btn-gradient text-white shadow-lg scale-105'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white/30 dark:hover:bg-white/10'
                  }`}
                  type="button"
                >
                  ID
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer ${
                    language === 'en'
                      ? 'btn-gradient text-white shadow-lg scale-105'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white/30 dark:hover:bg-white/10'
                  }`}
                  type="button"
                >
                  EN
                </button>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="btn-luxury p-3 rounded-xl text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 shadow-lg hover:scale-110 transition-transform"
                aria-label="Toggle theme"
                type="button"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              <Button
                onClick={onLogin}
                variant="outline"
                className="btn-luxury border-white/60 dark:border-white/20 hidden sm:flex shadow-lg hover:shadow-xl"
              >
                {t('landing.login')}
              </Button>
              <Button
                onClick={onRegister}
                className="btn-gradient text-white border-0 shadow-xl hover:shadow-2xl"
              >
                {t('landing.register')}
              </Button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden glass-card p-2 rounded-lg text-gray-700 dark:text-gray-300 transition-colors"
                type="button"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-white/40 space-y-3 animate-fade-in">
              <button 
                onClick={() => {
                  scrollToSection('features');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left text-gray-700 dark:text-gray-300 hover:text-[#B56576] dark:hover:text-[#E88C7D] transition-colors py-2"
              >
                {t('landing.features')}
              </button>
              <button 
                onClick={() => {
                  scrollToSection('about');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left text-gray-700 dark:text-gray-300 hover:text-[#B56576] dark:hover:text-[#E88C7D] transition-colors py-2"
              >
                {t('landing.aboutUs')}
              </button>
              <button 
                onClick={() => {
                  scrollToSection('contact');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left text-gray-700 dark:text-gray-300 hover:text-[#B56576] dark:hover:text-[#E88C7D] transition-colors py-2"
              >
                {t('landing.contact')}
              </button>
              <Button
                onClick={onLogin}
                variant="outline"
                className="w-full glass border-white/40"
              >
                {t('landing.login')}
              </Button>
            </div>
          )}
        </div>
      </nav>

      <div className="relative container mx-auto px-4 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center mb-20 md:mb-32" id="home" data-scroll-section>
          <motion.div 
            initial={{ opacity: 0, scale: 0.5, rotateY: -30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", type: "spring", stiffness: 100 }}
            className="flex justify-center mb-10"
          >
            <div className="card-liquid p-10 md:p-12 rounded-[2.5rem] inline-block shadow-2xl hover-lift relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#355070]/10 via-transparent to-[#E88C7D]/10 animate-gradient-flow"></div>
              <div className="absolute inset-0 animate-liquid-blob opacity-20"></div>
              <div className="relative">
                <TaskMateLogo size={120} showText={false} />
              </div>
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 80 }}
            className="gradient-text text-6xl md:text-8xl lg:text-9xl mb-8 tracking-tight drop-shadow-2xl animate-gradient-text-flow"
          >
            TaskMate
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-2xl md:text-4xl lg:text-5xl text-gray-800 dark:text-gray-200 mb-6 max-w-5xl mx-auto leading-tight"
          >
            {t('landing.subtitle')}
          </motion.p>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-400 mb-14 max-w-4xl mx-auto leading-relaxed"
          >
            {t('landing.description')}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex gap-6 justify-center flex-wrap"
          >
            <Button
              onClick={onRegister}
              size="lg"
              className="btn-gradient text-white border-0 shadow-2xl px-16 py-7 text-xl hover-lift hover:shadow-[#B56576]/50 rounded-2xl liquid-glass-hover"
            >
              <Zap className="w-6 h-6 mr-3" />
              {t('landing.getStarted')}
            </Button>
            <Button
              onClick={onLogin}
              size="lg"
              variant="outline"
              className="btn-luxury border-white/60 dark:border-white/20 px-16 py-7 text-xl smooth-hover hover:border-[#B56576] rounded-2xl shadow-xl liquid-glass-hover"
            >
              {t('landing.login')}
            </Button>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="mb-20 md:mb-32" id="features" data-scroll-section>
          <motion.h2 
            initial={{ opacity: 0, y: scrollDirection === 'down' ? 50 : -50, scale: 0.9 }}
            animate={visibleSections.has('features') ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: scrollDirection === 'down' ? 50 : -50, scale: 0.9 }}
            transition={{ duration: 0.7, type: "spring", stiffness: 80 }}
            className="text-center gradient-text text-3xl md:text-5xl mb-4"
          >
            {t('landing.features')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: scrollDirection === 'down' ? 40 : -40 }}
            animate={visibleSections.has('features') ? { opacity: 1, y: 0 } : { opacity: 0, y: scrollDirection === 'down' ? 40 : -40 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="text-center text-gray-600 dark:text-gray-400 mb-12 md:mb-16 max-w-2xl mx-auto"
          >
            {language === 'id' ? 'Fitur-fitur lengkap untuk kolaborasi tim yang efektif' : 'Complete features for effective team collaboration'}
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ 
                  opacity: 0, 
                  y: scrollDirection === 'down' ? 60 : -60,
                  scale: 0.8,
                  rotateX: scrollDirection === 'down' ? 20 : -20
                }}
                animate={visibleSections.has('features') ? { 
                  opacity: 1, 
                  y: 0,
                  scale: 1,
                  rotateX: 0
                } : {
                  opacity: 0, 
                  y: scrollDirection === 'down' ? 60 : -60,
                  scale: 0.8,
                  rotateX: scrollDirection === 'down' ? 20 : -20
                }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.1 * index,
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                <Card 
                  className="card-liquid border-white/60 dark:border-white/20 card-interactive group overflow-hidden relative shadow-2xl h-full"
                >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-transparent group-hover:from-[#B56576]/8 group-hover:to-[#E88C7D]/8 transition-all duration-700 liquid-shimmer"></div>
                <div className="absolute inset-0 animate-liquid-blob opacity-0 group-hover:opacity-10 transition-opacity duration-700"></div>
                <CardHeader className="relative z-10 p-8">
                  <div 
                    className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 liquid-glass [&>svg]:text-white [&>svg]:stroke-white"
                    style={{ 
                      background: `linear-gradient(135deg, ${feature.gradientFrom}, ${feature.gradientTo})`,
                      boxShadow: `0 12px 40px ${feature.color}60, 0 6px 20px ${feature.color}40, inset 0 2px 8px rgba(255, 255, 255, 0.3)`,
                      color: '#ffffff'
                    }}
                  >
                    {feature.icon}
                  </div>
                  <CardTitle className="text-gray-900 dark:text-gray-100 group-hover:text-[#B56576] dark:group-hover:text-[#E88C7D] transition-colors mb-3 text-xl">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="dark:text-gray-400 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* About Us Section */}
        <div className="mb-20 md:mb-32" id="about" data-scroll-section>
          <motion.h2 
            initial={{ opacity: 0, y: scrollDirection === 'down' ? 50 : -50, scale: 0.9 }}
            animate={visibleSections.has('about') ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: scrollDirection === 'down' ? 50 : -50, scale: 0.9 }}
            transition={{ duration: 0.7, type: "spring", stiffness: 80 }}
            className="text-center gradient-text text-3xl md:text-5xl mb-4"
          >
            {t('landing.aboutUs')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: scrollDirection === 'down' ? 40 : -40 }}
            animate={visibleSections.has('about') ? { opacity: 1, y: 0 } : { opacity: 0, y: scrollDirection === 'down' ? 40 : -40 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="text-center text-gray-600 dark:text-gray-400 mb-12 md:mb-16 max-w-2xl mx-auto"
          >
            {language === 'id' ? 'Kenali lebih dekat tentang TaskMate' : 'Get to know more about TaskMate'}
          </motion.p>

          <motion.div 
            initial={{ 
              opacity: 0, 
              scale: 0.9,
              y: scrollDirection === 'down' ? 60 : -60,
              rotateX: scrollDirection === 'down' ? 15 : -15
            }}
            animate={visibleSections.has('about') ? { 
              opacity: 1, 
              scale: 1,
              y: 0,
              rotateX: 0
            } : {
              opacity: 0, 
              scale: 0.9,
              y: scrollDirection === 'down' ? 60 : -60,
              rotateX: scrollDirection === 'down' ? 15 : -15
            }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="card-liquid p-10 md:p-16 rounded-[2.5rem] shadow-2xl mb-10 hover-lift relative overflow-hidden"
          >
            <div className="absolute inset-0 animate-liquid-blob opacity-5"></div>
            <motion.p 
              initial={{ opacity: 0, y: scrollDirection === 'down' ? 30 : -30 }}
              animate={visibleSections.has('about') ? { opacity: 1, y: 0 } : { opacity: 0, y: scrollDirection === 'down' ? 30 : -30 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="text-center text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-16 max-w-4xl mx-auto leading-relaxed relative z-10"
            >
              {t('about.description')}
            </motion.p>

            <div className="grid md:grid-cols-2 gap-10 mb-10 relative z-10">
              {/* Mission */}
              <motion.div
                initial={{ 
                  opacity: 0, 
                  x: scrollDirection === 'down' ? -60 : 60,
                  rotateY: scrollDirection === 'down' ? -20 : 20
                }}
                animate={visibleSections.has('about') ? { 
                  opacity: 1, 
                  x: 0,
                  rotateY: 0
                } : {
                  opacity: 0, 
                  x: scrollDirection === 'down' ? -60 : 60,
                  rotateY: scrollDirection === 'down' ? -20 : 20
                }}
                transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <Card className="card-liquid border-white/60 dark:border-white/20 card-interactive group shadow-2xl h-full overflow-hidden relative">
                  <div className="absolute inset-0 animate-liquid-blob opacity-0 group-hover:opacity-10 transition-opacity duration-700"></div>
                  <CardHeader className="p-8 relative z-10">
                    <div 
                      className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 liquid-glass [&>svg]:text-white [&>svg]:stroke-white"
                      style={{ 
                        background: 'linear-gradient(135deg, #5B7EC8, #355070)',
                        boxShadow: '0 12px 40px #4A6FA560, 0 6px 20px #4A6FA540, inset 0 2px 8px rgba(255, 255, 255, 0.3)',
                        color: '#ffffff'
                      }}
                    >
                      <Target className="w-8 h-8" strokeWidth={2.5} />
                    </div>
                    <CardTitle className="text-gray-900 dark:text-gray-100 group-hover:text-[#355070] dark:group-hover:text-[#6D597A] transition-colors mb-3 text-xl">
                      {t('about.mission.title')}
                    </CardTitle>
                    <CardDescription className="dark:text-gray-400 text-base leading-relaxed">
                      {t('about.mission.desc')}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>

              {/* Vision */}
              <motion.div
                initial={{ 
                  opacity: 0, 
                  x: scrollDirection === 'down' ? 60 : -60,
                  rotateY: scrollDirection === 'down' ? 20 : -20
                }}
                animate={visibleSections.has('about') ? { 
                  opacity: 1, 
                  x: 0,
                  rotateY: 0
                } : {
                  opacity: 0, 
                  x: scrollDirection === 'down' ? 60 : -60,
                  rotateY: scrollDirection === 'down' ? 20 : -20
                }}
                transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <Card className="card-liquid border-white/60 dark:border-white/20 card-interactive group shadow-2xl h-full overflow-hidden relative">
                  <div className="absolute inset-0 animate-liquid-blob opacity-0 group-hover:opacity-10 transition-opacity duration-700"></div>
                  <CardHeader className="p-8 relative z-10">
                    <div 
                      className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 liquid-glass [&>svg]:text-white [&>svg]:stroke-white"
                      style={{ 
                        background: 'linear-gradient(135deg, #FF8FA3, #B56576)',
                        boxShadow: '0 12px 40px #D9789160, 0 6px 20px #D9789140, inset 0 2px 8px rgba(255, 255, 255, 0.3)',
                        color: '#ffffff'
                      }}
                    >
                      <Eye className="w-8 h-8" strokeWidth={2.5} />
                    </div>
                    <CardTitle className="text-gray-900 dark:text-gray-100 group-hover:text-[#B56576] dark:group-hover:text-[#E56B6F] transition-colors mb-3 text-xl">
                      {t('about.vision.title')}
                    </CardTitle>
                    <CardDescription className="dark:text-gray-400 text-base leading-relaxed">
                      {t('about.vision.desc')}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            </div>

            {/* Values */}
            <div className="mt-10 relative z-10">
              <motion.h3 
                initial={{ opacity: 0, y: scrollDirection === 'down' ? 40 : -40, scale: 0.9 }}
                animate={visibleSections.has('about') ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: scrollDirection === 'down' ? 40 : -40, scale: 0.9 }}
                transition={{ duration: 0.7, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="text-3xl md:text-4xl gradient-text text-center mb-12"
              >
                {t('about.values.title')}
              </motion.h3>
              <div className="grid md:grid-cols-3 gap-8 md:gap-10">
                {[
                  { 
                    icon: Zap, 
                    title: t('about.values.simplicity'), 
                    desc: t('about.values.simplicity.desc'), 
                    gradientFrom: '#5B7EC8', 
                    gradientTo: '#355070',
                    color: '#4A6FA5'
                  },
                  { 
                    icon: Users, 
                    title: t('about.values.collaboration'), 
                    desc: t('about.values.collaboration.desc'), 
                    gradientFrom: '#FF8FA3', 
                    gradientTo: '#B56576',
                    color: '#D97891'
                  },
                  { 
                    icon: Heart, 
                    title: t('about.values.innovation'), 
                    desc: t('about.values.innovation.desc'), 
                    gradientFrom: '#FFC3B6', 
                    gradientTo: '#E88C7D',
                    color: '#FFA694'
                  }
                ].map((value, index) => {
                  const Icon = value.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ 
                        opacity: 0, 
                        scale: 0.7,
                        y: scrollDirection === 'down' ? 50 : -50,
                        rotateY: scrollDirection === 'down' ? 30 : -30
                      }}
                      animate={visibleSections.has('about') ? { 
                        opacity: 1, 
                        scale: 1,
                        y: 0,
                        rotateY: 0
                      } : {
                        opacity: 0, 
                        scale: 0.7,
                        y: scrollDirection === 'down' ? 50 : -50,
                        rotateY: scrollDirection === 'down' ? 30 : -30
                      }}
                      transition={{ duration: 0.6, delay: 0.8 + index * 0.15, ease: [0.22, 1, 0.36, 1] }}
                      className="text-center group card-liquid p-8 rounded-2xl shadow-xl hover-lift overflow-hidden relative"
                    >
                      <div className="absolute inset-0 animate-liquid-blob opacity-0 group-hover:opacity-10 transition-opacity duration-700"></div>
                      <div 
                        className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 liquid-glass [&>svg]:text-white [&>svg]:stroke-white"
                        style={{ 
                          background: `linear-gradient(135deg, ${value.gradientFrom}, ${value.gradientTo})`,
                          boxShadow: `0 12px 40px ${value.color}60, 0 6px 20px ${value.color}40, inset 0 2px 8px rgba(255, 255, 255, 0.3)`,
                          color: '#ffffff'
                        }}
                      >
                        <Icon className="w-8 h-8" strokeWidth={2.5} />
                      </div>
                      <h4 className="text-gray-900 dark:text-gray-100 mb-3 text-xl">{value.title}</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">{value.desc}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Contact Section */}
        <div className="mb-20" id="contact" data-scroll-section>
          <motion.h2 
            initial={{ opacity: 0, y: scrollDirection === 'down' ? 50 : -50, scale: 0.9 }}
            animate={visibleSections.has('contact') ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: scrollDirection === 'down' ? 50 : -50, scale: 0.9 }}
            transition={{ duration: 0.7, type: "spring", stiffness: 80 }}
            className="text-center gradient-text text-3xl md:text-5xl mb-4"
          >
            {t('landing.contact')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: scrollDirection === 'down' ? 40 : -40 }}
            animate={visibleSections.has('contact') ? { opacity: 1, y: 0 } : { opacity: 0, y: scrollDirection === 'down' ? 40 : -40 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="text-center text-gray-600 dark:text-gray-300 mb-12 md:mb-16 max-w-2xl mx-auto"
          >
            {t('contact.description')}
          </motion.p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              {[
                { 
                  icon: Mail, 
                  title: t('contact.email'), 
                  info: ['hello@taskmate.app', 'support@taskmate.app'], 
                  gradientFrom: '#5B7EC8',
                  gradientTo: '#355070',
                  color: '#4A6FA5'
                },
                { 
                  icon: Phone, 
                  title: t('contact.phone'), 
                  info: ['+62 812-3456-7890', '+62 821-9876-5432'], 
                  gradientFrom: '#FF8FA3',
                  gradientTo: '#B56576',
                  color: '#D97891'
                },
                { 
                  icon: MapPin, 
                  title: t('contact.address'), 
                  info: ['Jl. Teknologi No. 123', 'Jakarta Selatan, DKI Jakarta 12345', 'Indonesia'], 
                  gradientFrom: '#FFC3B6',
                  gradientTo: '#E88C7D',
                  color: '#FFA694'
                }
              ].map((contact, index) => {
                const Icon = contact.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ 
                      opacity: 0, 
                      x: scrollDirection === 'down' ? -60 : 60,
                      rotateY: scrollDirection === 'down' ? -15 : 15
                    }}
                    animate={visibleSections.has('contact') ? { 
                      opacity: 1, 
                      x: 0,
                      rotateY: 0
                    } : {
                      opacity: 0, 
                      x: scrollDirection === 'down' ? -60 : 60,
                      rotateY: scrollDirection === 'down' ? -15 : 15
                    }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className="group"
                  >
                    <Card className="card-liquid border-white/60 dark:border-white/20 hover-lift shadow-xl overflow-hidden relative">
                      <div className="absolute inset-0 animate-liquid-blob opacity-0 hover:opacity-10 transition-opacity duration-700"></div>
                      <CardContent className="p-8 relative z-10">
                        <div className="flex items-start gap-5">
                          <div 
                            className="w-24 h-24 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-2xl liquid-glass group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 [&>svg]:text-white [&>svg]:stroke-white"
                            style={{
                              background: `linear-gradient(135deg, ${contact.gradientFrom}, ${contact.gradientTo})`,
                              boxShadow: `0 12px 40px ${contact.color}60, 0 6px 20px ${contact.color}40, inset 0 2px 8px rgba(255, 255, 255, 0.3)`,
                              color: '#ffffff'
                            }}
                          >
                            <Icon className="w-8 h-8" strokeWidth={2.5} />
                          </div>
                          <div>
                            <h4 className="text-gray-900 dark:text-gray-100 mb-2 text-xl">{contact.title}</h4>
                            {contact.info.map((line, i) => (
                              <p key={i} className="text-gray-600 dark:text-gray-400 text-base">{line}{i < contact.info.length - 1 && contact.icon === MapPin && <br />}</p>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Contact Form */}
            <motion.div
              initial={{ 
                opacity: 0, 
                x: scrollDirection === 'down' ? 60 : -60,
                rotateY: scrollDirection === 'down' ? 15 : -15
              }}
              animate={visibleSections.has('contact') ? { 
                opacity: 1, 
                x: 0,
                rotateY: 0
              } : {
                opacity: 0, 
                x: scrollDirection === 'down' ? 60 : -60,
                rotateY: scrollDirection === 'down' ? 15 : -15
              }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <Card className="card-liquid border-white/60 dark:border-white/20 card-interactive shadow-2xl overflow-hidden relative">
              <div className="absolute inset-0 animate-liquid-blob opacity-5"></div>
              <CardHeader className="p-8 relative z-10">
                <CardTitle className="text-gray-900 dark:text-gray-100 text-2xl">
                  {t('contact.form.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-800 dark:text-gray-200">
                      {t('contact.form.name')}
                    </Label>
                    <Input
                      id="name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="glass border-white/40 mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-gray-800 dark:text-gray-200">
                      {t('contact.form.email')}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="glass border-white/40 mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-gray-800 dark:text-gray-200">
                      {t('contact.form.subject')}
                    </Label>
                    <Input
                      id="subject"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="glass border-white/40 mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-gray-800 dark:text-gray-200">
                      {t('contact.form.message')}
                    </Label>
                    <Textarea
                      id="message"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="glass border-white/40 mt-1 min-h-[120px]"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full btn-gradient text-white border-0 hover-lift group"
                  >
                    <Send className="w-4 h-4 mr-2 group-hover:rotate-45 transition-transform duration-300" />
                    {t('contact.form.send')}
                  </Button>
                </form>
              </CardContent>
            </Card>
            </motion.div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="card-premium p-12 md:p-16 rounded-[2.5rem] shadow-2xl mb-20 hover-lift animate-scale-in overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#355070]/5 via-transparent to-[#E88C7D]/5 pointer-events-none"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center relative z-10">
            <div className="animate-fade-in" style={{animationDelay: '0s'}}>
              <div className="gradient-text text-5xl md:text-7xl mb-3">100%</div>
              <div className="text-base md:text-lg text-gray-600 dark:text-gray-400">{t('stats.free')}</div>
            </div>
            <div className="animate-fade-in" style={{animationDelay: '0.1s'}}>
              <div className="gradient-text text-5xl md:text-7xl mb-3">∞</div>
              <div className="text-base md:text-lg text-gray-600 dark:text-gray-400">{t('stats.unlimitedTeams')}</div>
            </div>
            <div className="animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="gradient-text text-5xl md:text-7xl mb-3">24/7</div>
              <div className="text-base md:text-lg text-gray-600 dark:text-gray-400">{t('stats.availability')}</div>
            </div>
            <div className="animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="gradient-text text-5xl md:text-7xl mb-3">99%</div>
              <div className="text-base md:text-lg text-gray-600 dark:text-gray-400">{t('stats.satisfaction')}</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-10 mt-20 border-t border-white/40 dark:border-white/20">
          <div className="flex justify-center mb-6">
            <TaskMateLogo size={60} showText={true} />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {language === 'id' ? '© 2024 TaskMate. Semua hak dilindungi.' : '© 2024 TaskMate. All rights reserved.'}
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm">
            {language === 'id' ? 'Dibuat dengan ❤️ untuk kolaborasi tim yang lebih baik' : 'Made with ❤️ for better team collaboration'}
          </p>
        </footer>
      </div>
    </div>
  );
}
