import { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  User, 
  Mail, 
  Lock, 
  Camera, 
  Save, 
  CheckCircle2, 
  Calendar,
  Users,
  ListTodo,
  Trophy,
  Bell,
  Shield,
  Palette,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function Profile() {
  const { user } = useAuth();
  const { tasks, teams } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: '',
    avatarUrl: '',
  });

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Password visibility state
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Preferences state
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    taskReminders: true,
    weeklyDigest: false,
    darkMode: false,
  });

  // Avatar upload handler
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, avatarUrl: reader.result as string });
        toast.success('Foto profil berhasil diupdate!');
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile handler
  const handleSaveProfile = () => {
    // Save to localStorage
    const usersData = localStorage.getItem('taskmate_users');
    const users = usersData ? JSON.parse(usersData) : [];
    
    const updatedUsers = users.map((u: any) => {
      if (u.id === user?.id) {
        return { 
          ...u, 
          name: profileData.name, 
          email: profileData.email,
          bio: profileData.bio,
          avatarUrl: profileData.avatarUrl,
          initials: profileData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        };
      }
      return u;
    });

    localStorage.setItem('taskmate_users', JSON.stringify(updatedUsers));
    
    // Update current user
    const currentUser = updatedUsers.find((u: any) => u.id === user?.id);
    if (currentUser) {
      const { password, ...userWithoutPassword } = currentUser;
      localStorage.setItem('taskmate_user', JSON.stringify(userWithoutPassword));
    }

    toast.success('Profil berhasil diperbarui!');
  };

  // Change password handler
  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Password baru tidak cocok!');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password minimal 6 karakter!');
      return;
    }

    // Verify current password and update
    const usersData = localStorage.getItem('taskmate_users');
    const users = usersData ? JSON.parse(usersData) : [];
    
    const currentUser = users.find((u: any) => u.id === user?.id && u.password === passwordData.currentPassword);
    
    if (!currentUser) {
      toast.error('Password saat ini salah!');
      return;
    }

    const updatedUsers = users.map((u: any) => {
      if (u.id === user?.id) {
        return { ...u, password: passwordData.newPassword };
      }
      return u;
    });

    localStorage.setItem('taskmate_users', JSON.stringify(updatedUsers));
    
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });

    toast.success('Password berhasil diubah!');
  };

  // Save preferences handler
  const handleSavePreferences = () => {
    localStorage.setItem(`taskmate_preferences_${user?.id}`, JSON.stringify(preferences));
    toast.success('Preferensi berhasil disimpan!');
  };

  // Calculate user statistics
  const userTasks = tasks.filter(t => t.assigneeId === user?.id);
  const completedTasks = userTasks.filter(t => t.status === 'done');
  const userTeams = teams.filter(t => t.members.includes(user?.id || ''));
  
  // Calculate join date (mock data)
  const joinDate = new Date(2024, 0, 15);

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 glass-card bg-gradient-to-br from-[#355070]/10 via-[#B56576]/10 to-[#E88C7D]/10 dark:from-[#355070]/20 dark:via-[#B56576]/20 dark:to-[#E88C7D]/20">
        {/* Animated blobs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#E56B6F]/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#6D597A]/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-[#EAAC8B]/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>

        <div className="relative flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative group">
            <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-700 shadow-xl">
              <AvatarImage src={profileData.avatarUrl} />
              <AvatarFallback className="bg-gradient-to-br from-[#355070] to-[#B56576] text-white text-3xl">
                {user?.initials}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={handleAvatarClick}
              className="absolute bottom-0 right-0 p-3 bg-gradient-to-r from-[#E56B6F] to-[#E88C7D] rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110"
            >
              <Camera className="w-5 h-5 text-white" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-gray-900 dark:text-gray-100 text-2xl md:text-3xl mb-2">
              {user?.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-3">{user?.email}</p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <Badge className="bg-gradient-to-r from-[#355070] to-[#6D597A] text-white border-0">
                <Shield className="w-3 h-3 mr-1" />
                {user?.role === 'admin' ? 'Admin' : 'Member'}
              </Badge>
              <Badge variant="outline" className="border-[#B56576]/40 text-gray-800 dark:text-gray-200">
                <Calendar className="w-3 h-3 mr-1" />
                Bergabung {joinDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
              </Badge>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-6">
            <div className="text-center glass-card p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50">
              <ListTodo className="w-6 h-6 text-[#355070] dark:text-[#E88C7D] mx-auto mb-1" />
              <p className="text-2xl text-gray-900 dark:text-gray-100">{userTasks.length}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Tugas</p>
            </div>
            <div className="text-center glass-card p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50">
              <CheckCircle2 className="w-6 h-6 text-[#6D597A] dark:text-[#B56576] mx-auto mb-1" />
              <p className="text-2xl text-gray-900 dark:text-gray-100">{completedTasks.length}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Selesai</p>
            </div>
            <div className="text-center glass-card p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50">
              <Users className="w-6 h-6 text-[#E56B6F] dark:text-[#EAAC8B] mx-auto mb-1" />
              <p className="text-2xl text-gray-900 dark:text-gray-100">{userTeams.length}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Tim</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 glass-card p-1 h-auto">
          <TabsTrigger value="profile" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#355070] data-[state=active]:to-[#6D597A] data-[state=active]:text-white">
            <User className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Profil</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#B56576] data-[state=active]:to-[#E56B6F] data-[state=active]:text-white">
            <Lock className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Keamanan</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#E88C7D] data-[state=active]:to-[#EAAC8B] data-[state=active]:text-white">
            <Palette className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Preferensi</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4 mt-6">
          <Card className="glass-card border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <User className="w-5 h-5 text-[#355070] dark:text-[#E88C7D]" />
                Informasi Pribadi
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Update informasi profil Anda di sini
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-800 dark:text-gray-200">Nama Lengkap</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="glass-card border-gray-200 dark:border-gray-700"
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-800 dark:text-gray-200">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="glass-card border-gray-200 dark:border-gray-700"
                  placeholder="email@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-gray-800 dark:text-gray-200">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="glass-card border-gray-200 dark:border-gray-700 min-h-[100px]"
                  placeholder="Ceritakan sedikit tentang diri Anda..."
                />
              </div>

              <Button
                onClick={handleSaveProfile}
                className="w-full bg-gradient-to-r from-[#355070] to-[#6D597A] hover:from-[#2d4460] hover:to-[#5d4a6a] text-white shadow-lg"
              >
                <Save className="w-4 h-4 mr-2" />
                Simpan Perubahan
              </Button>
            </CardContent>
          </Card>

          {/* Achievement Card */}
          <Card className="glass-card border-0 shadow-xl bg-gradient-to-br from-[#EAAC8B]/20 to-[#E88C7D]/20 dark:from-[#EAAC8B]/10 dark:to-[#E88C7D]/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <Trophy className="w-5 h-5 text-[#E56B6F]" />
                Pencapaian
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Prestasi dan statistik Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-gray-800/50">
                <span className="text-gray-700 dark:text-gray-300">Total Tugas Dikerjakan</span>
                <Badge className="bg-[#355070] dark:bg-[#6D597A] text-white">{userTasks.length}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-gray-800/50">
                <span className="text-gray-700 dark:text-gray-300">Tugas Selesai</span>
                <Badge className="bg-[#6D597A] dark:bg-[#B56576] text-white">{completedTasks.length}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-gray-800/50">
                <span className="text-gray-700 dark:text-gray-300">Tingkat Penyelesaian</span>
                <Badge className="bg-[#E56B6F] dark:bg-[#E88C7D] text-white">
                  {userTasks.length > 0 ? Math.round((completedTasks.length / userTasks.length) * 100) : 0}%
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-gray-800/50">
                <span className="text-gray-700 dark:text-gray-300">Tim Bergabung</span>
                <Badge className="bg-[#E88C7D] dark:bg-[#EAAC8B] text-white">{userTeams.length}</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4 mt-6">
          <Card className="glass-card border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <Lock className="w-5 h-5 text-[#B56576] dark:text-[#E56B6F]" />
                Ubah Password
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Pastikan akun Anda menggunakan password yang kuat
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-gray-800 dark:text-gray-200">Password Saat Ini</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="glass-card border-gray-200 dark:border-gray-700 pr-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50"
                    aria-label={showCurrentPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <Separator className="dark:bg-gray-700" />

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-gray-800 dark:text-gray-200">Password Baru</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="glass-card border-gray-200 dark:border-gray-700 pr-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50"
                    aria-label={showNewPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-800 dark:text-gray-200">Konfirmasi Password Baru</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="glass-card border-gray-200 dark:border-gray-700 pr-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50"
                    aria-label={showConfirmPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                onClick={handleChangePassword}
                className="w-full bg-gradient-to-r from-[#B56576] to-[#E56B6F] hover:from-[#a5576a] hover:to-[#d55b5f] text-white shadow-lg"
              >
                <Lock className="w-4 h-4 mr-2" />
                Ubah Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-4 mt-6">
          <Card className="glass-card border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <Bell className="w-5 h-5 text-[#E88C7D] dark:text-[#EAAC8B]" />
                Notifikasi
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Kelola preferensi notifikasi Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl glass-card bg-white/30 dark:bg-gray-800/30">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications" className="text-gray-900 dark:text-gray-100">Email Notifikasi</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Terima notifikasi melalui email</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={preferences.emailNotifications}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, emailNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl glass-card bg-white/30 dark:bg-gray-800/30">
                <div className="space-y-0.5">
                  <Label htmlFor="taskReminders" className="text-gray-900 dark:text-gray-100">Pengingat Tugas</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Dapatkan pengingat untuk deadline tugas</p>
                </div>
                <Switch
                  id="taskReminders"
                  checked={preferences.taskReminders}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, taskReminders: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl glass-card bg-white/30 dark:bg-gray-800/30">
                <div className="space-y-0.5">
                  <Label htmlFor="weeklyDigest" className="text-gray-900 dark:text-gray-100">Ringkasan Mingguan</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Terima ringkasan aktivitas setiap minggu</p>
                </div>
                <Switch
                  id="weeklyDigest"
                  checked={preferences.weeklyDigest}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, weeklyDigest: checked })}
                />
              </div>

              <Button
                onClick={handleSavePreferences}
                className="w-full bg-gradient-to-r from-[#E88C7D] to-[#EAAC8B] hover:from-[#d87c6d] hover:to-[#da9c7b] text-white shadow-lg"
              >
                <Save className="w-4 h-4 mr-2" />
                Simpan Preferensi
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
