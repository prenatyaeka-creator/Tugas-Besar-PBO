import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle, ArrowLeft, Moon, Sun, Eye, EyeOff } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { TaskMateLogo } from './TaskMateLogo';

interface RegisterProps {
  onSwitchToLogin: () => void;
  onBackToLanding?: () => void;
}

export function Register({ onSwitchToLogin, onBackToLanding }: RegisterProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState<'admin' | 'member'>('member');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError(language === 'id' ? 'Semua field harus diisi' : 'All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError(language === 'id' ? 'Password tidak cocok' : 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError(language === 'id' ? 'Password minimal 6 karakter' : 'Password must be at least 6 characters');
      return;
    }

    const success = await register(name, email, password, role);
    if (!success) {
      setError(language === 'id' ? 'Email sudah terdaftar' : 'Email already registered');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">
      {/* Vibrant Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#355070] via-[#6D597A] to-[#B56576]">
        {/* Overlay gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#E88C7D]/30 via-transparent to-[#EAAC8B]/40"></div>
      </div>

      {/* Animated Colorful Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large blobs with vibrant colors */}
        <div 
          className="absolute -top-20 -left-20 w-96 h-96 rounded-full blur-3xl opacity-60 animate-float-slow"
          style={{
            background: 'radial-gradient(circle, #E56B6F 0%, #B56576 50%, transparent 70%)',
          }}
        ></div>
        <div 
          className="absolute top-1/4 -right-32 w-[600px] h-[600px] rounded-full blur-3xl opacity-50 animate-float"
          style={{
            background: 'radial-gradient(circle, #EAAC8B 0%, #E88C7D 40%, transparent 70%)',
            animationDelay: '2s',
          }}
        ></div>
        <div 
          className="absolute -bottom-32 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl opacity-60 animate-float"
          style={{
            background: 'radial-gradient(circle, #6D597A 0%, #355070 50%, transparent 70%)',
            animationDelay: '4s',
          }}
        ></div>
        <div 
          className="absolute top-1/2 right-1/3 w-80 h-80 rounded-full blur-3xl opacity-40 animate-float-slow"
          style={{
            background: 'radial-gradient(circle, #E88C7D 0%, #E56B6F 50%, transparent 70%)',
            animationDelay: '1s',
          }}
        ></div>
        
        {/* Additional smaller accent blobs */}
        <div 
          className="absolute top-10 right-20 w-64 h-64 rounded-full blur-2xl opacity-30 animate-float"
          style={{
            background: 'radial-gradient(circle, #EAAC8B 0%, transparent 70%)',
            animationDelay: '3s',
          }}
        ></div>
        <div 
          className="absolute bottom-20 right-1/4 w-72 h-72 rounded-full blur-3xl opacity-40 animate-float-slow"
          style={{
            background: 'radial-gradient(circle, #B56576 0%, transparent 70%)',
            animationDelay: '5s',
          }}
        ></div>
      </div>

      {/* Decorative shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 border-4 border-white/10 rounded-3xl rotate-12 animate-float"></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 border-4 border-white/10 rounded-full animate-float-slow"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-white/5 rounded-2xl rotate-45 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-scale-in">
        <div className="text-center mb-8">
          {/* Top Controls */}
          <div className="flex justify-between items-start mb-6 animate-slide-down">
            {onBackToLanding ? (
              <button
                onClick={onBackToLanding}
                className="flex items-center gap-2 text-white/90 hover:text-white transition-all hover:gap-3 smooth-hover"
              >
                <ArrowLeft className="w-4 h-4" />
                {language === 'id' ? 'Kembali' : 'Back'}
              </button>
            ) : (
              <div></div>
            )}
            
            <div className="flex gap-2">
              {/* Language Switcher */}
              <div className="flex gap-1 glass-card p-1 rounded-lg smooth-hover hover-lift">
                <button
                  onClick={() => setLanguage('id')}
                  className={`px-3 py-1 rounded text-sm transition-all smooth-hover ${
                    language === 'id'
                      ? 'bg-white text-[#355070] shadow-md'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  ID
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded text-sm transition-all smooth-hover ${
                    language === 'en'
                      ? 'bg-white text-[#355070] shadow-md'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  EN
                </button>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="glass-card p-2 rounded-lg text-white/90 hover:text-white transition-all smooth-hover hover:scale-110"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button 
            onClick={onBackToLanding}
            className="flex justify-center mb-6 animate-bounce-in w-full cursor-pointer group"
          >
            <div className="card-premium rounded-[2rem] p-6 shadow-2xl group-hover:scale-110 transition-all duration-500">
              <TaskMateLogo size={90} showText={false} />
            </div>
          </button>
          <h1 className="text-white mb-3 drop-shadow-2xl animate-fade-in text-5xl">TaskMate</h1>
          <p className="text-white/90 drop-shadow-lg animate-slide-up text-xl">{t('auth.welcome')} ✨</p>
        </div>

        <Card className="card-premium border-white/60 dark:border-white/20 shadow-2xl backdrop-blur-2xl animate-slide-up">
          <CardHeader className="p-8">
            <CardTitle className="gradient-text text-3xl">{t('auth.register')}</CardTitle>
            <CardDescription className="text-lg mt-2">{t('auth.registerDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive" className="glass border-red-200/50 bg-red-50/90 dark:bg-red-900/30 animate-shake">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="animate-slide-up" style={{animationDelay: '0.1s'}}>
                <Label htmlFor="name" className="text-gray-800 dark:text-gray-200 text-base mb-2 block">{t('auth.name')}</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-luxury border-white/60 dark:border-white/20 focus:border-[#B56576] h-12 rounded-xl text-base"
                />
              </div>

              <div className="animate-slide-up" style={{animationDelay: '0.15s'}}>
                <Label htmlFor="email" className="text-gray-800 dark:text-gray-200 text-base mb-2 block">{t('auth.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={language === 'id' ? 'nama@email.com' : 'name@email.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-luxury border-white/60 dark:border-white/20 focus:border-[#B56576] h-12 rounded-xl text-base"
                />
              </div>

              <div className="animate-slide-up" style={{animationDelay: '0.2s'}}>
                <Label className="text-gray-800 dark:text-gray-200 text-base mb-3 block">{t('auth.role')}</Label>
                <RadioGroup value={role} onValueChange={(value) => setRole(value as 'admin' | 'member')} className="flex gap-4">
                  <div className="flex items-center space-x-2 flex-1">
                    <div className="relative flex-1">
                      <RadioGroupItem value="admin" id="admin" className="peer sr-only" />
                      <Label
                        htmlFor="admin"
                        className="flex items-center justify-center gap-2 rounded-xl border-2 border-white/60 dark:border-white/20 bg-white/50 dark:bg-gray-800/50 px-4 py-3 cursor-pointer transition-all hover:border-[#B56576] hover:bg-white/70 dark:hover:bg-gray-800/70 peer-data-[state=checked]:border-[#B56576] peer-data-[state=checked]:bg-[#B56576]/10 peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-[#B56576]/30"
                      >
                        <span className="text-xl">👑</span>
                        <span className="text-gray-800 dark:text-gray-200">{t('auth.admin')}</span>
                      </Label>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 flex-1">
                    <div className="relative flex-1">
                      <RadioGroupItem value="member" id="member" className="peer sr-only" />
                      <Label
                        htmlFor="member"
                        className="flex items-center justify-center gap-2 rounded-xl border-2 border-white/60 dark:border-white/20 bg-white/50 dark:bg-gray-800/50 px-4 py-3 cursor-pointer transition-all hover:border-[#B56576] hover:bg-white/70 dark:hover:bg-gray-800/70 peer-data-[state=checked]:border-[#B56576] peer-data-[state=checked]:bg-[#B56576]/10 peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-[#B56576]/30"
                      >
                        <span className="text-xl">👤</span>
                        <span className="text-gray-800 dark:text-gray-200">{t('auth.member')}</span>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div className="animate-slide-up" style={{animationDelay: '0.25s'}}>
                <Label htmlFor="password" className="text-gray-800 dark:text-gray-200 text-base mb-2 block">{t('auth.password')}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-luxury border-white/60 dark:border-white/20 focus:border-[#B56576] h-12 rounded-xl text-base pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50"
                    aria-label={showPassword ? (language === 'id' ? 'Sembunyikan password' : 'Hide password') : (language === 'id' ? 'Tampilkan password' : 'Show password')}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="animate-slide-up" style={{animationDelay: '0.3s'}}>
                <Label htmlFor="confirmPassword" className="text-gray-800 dark:text-gray-200 text-base mb-2 block">{t('profile.confirmPassword')}</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-luxury border-white/60 dark:border-white/20 focus:border-[#B56576] h-12 rounded-xl text-base pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50"
                    aria-label={showConfirmPassword ? (language === 'id' ? 'Sembunyikan password' : 'Hide password') : (language === 'id' ? 'Tampilkan password' : 'Show password')}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full btn-gradient text-white border-0 shadow-2xl hover-lift animate-slide-up h-12 text-base rounded-xl" style={{animationDelay: '0.35s'}}>
                {t('auth.register')}
              </Button>
            </form>

            <div className="text-center mt-4 relative z-10">
              <p className="text-gray-700 dark:text-gray-300">
                {t('auth.hasAccount')}{' '}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onSwitchToLogin();
                  }}
                  style={{ 
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    font: 'inherit',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                  className="text-[#355070] dark:text-[#E88C7D] hover:text-[#B56576] dark:hover:text-[#EAAC8B] transition-colors"
                >
                  {t('auth.loginHere')}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
