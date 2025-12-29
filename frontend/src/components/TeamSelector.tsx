import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Users, Plus, ArrowRight, Search, UserPlus, LogOut } from 'lucide-react';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { TaskMateLogo } from './TaskMateLogo';

const teamColors = ['#355070', '#6D597A', '#B56576', '#E56B6F', '#E88C7D', '#EAAC8B'];

interface TeamSelectorProps {
  onTeamSelected: () => void;
}

export function TeamSelector({ onTeamSelected }: TeamSelectorProps) {
  const { user, logout } = useAuth();
  const { teams, currentTeam, setCurrentTeam, addTeam, getUserTeams } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: teamColors[0],
  });
  const [joinCode, setJoinCode] = useState('');

  if (!user) return null;

  const userTeams = getUserTeams(user.id);
  
  const filteredTeams = userTeams.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTeam = () => {
    if (!formData.name.trim()) return;

    addTeam({
      name: formData.name,
      description: formData.description,
      color: formData.color,
      members: [user.id],
      createdBy: user.id,
    });

    setFormData({ name: '', description: '', color: teamColors[0] });
    setCreateDialogOpen(false);
  };

  const handleSelectTeam = (teamId: string) => {
    setCurrentTeam(teamId);
    onTeamSelected();
  };

  const handleJoinTeam = () => {
  if (!user) return;

  const joined = joinTeamByCode(joinCode, user.id);
  if (joined) {
    // ensure team is selected after joining
    onTeamSelected();
  }

  setJoinCode('');
  setJoinDialogOpen(false);
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F0] via-[#FFE8E0] to-[#FFD6CC] dark:from-[#1a1625] dark:via-[#251d30] dark:to-[#2d2438] gradient-mesh transition-colors duration-300">
      {/* Decorative floating blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#355070]/20 dark:bg-[#355070]/10 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-1/3 right-20 w-96 h-96 bg-[#B56576]/20 dark:bg-[#B56576]/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-[#E88C7D]/20 dark:bg-[#E88C7D]/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="glass border-b border-white/30 dark:border-white/10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TaskMateLogo size={40} showText={true} />
            </div>
            <div className="flex items-center gap-3">
              <div className="glass-card px-4 py-2 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#355070] to-[#B56576] flex items-center justify-center text-white">
                    {user.initials}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm text-gray-800 dark:text-gray-200">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.role === 'admin' ? 'Admin' : 'Member'}</p>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={logout}
                className="glass border-white/40 dark:border-white/10 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <LogOut className="w-4 h-4 text-red-600" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-5xl mx-auto">
            {/* Welcome Section */}
            <div className="text-center mb-8 md:mb-12">
              <h1 className="mb-3 bg-gradient-to-r from-[#355070] via-[#B56576] to-[#E88C7D] bg-clip-text text-transparent">
                Pilih Tim Anda
              </h1>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {user.role === 'admin' 
                  ? 'Pilih tim yang ingin Anda kelola atau buat tim baru'
                  : 'Pilih tim yang Anda ikuti atau bergabung dengan tim baru'
                }
              </p>
            </div>

            {/* Search and Actions */}
            <div className="flex flex-col md:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Cari tim..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 glass border-white/40 dark:border-white/10 dark:bg-white/5"
                />
              </div>
              
              <div className="flex gap-2">
                {user.role === 'admin' && (
                  <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-[#355070] to-[#B56576] hover:from-[#355070]/90 hover:to-[#B56576]/90 text-white border-0 flex-1 md:flex-none">
                        <Plus className="w-4 h-4 mr-2" />
                        Buat Tim
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-card border-white/40 dark:border-white/10">
                      <DialogHeader>
                        <DialogTitle className="bg-gradient-to-r from-[#355070] to-[#B56576] bg-clip-text text-transparent">
                          Buat Tim Baru
                        </DialogTitle>
                        <DialogDescription className="dark:text-gray-400">
                          Buat tim baru untuk mengorganisir proyek dan tugas
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label>Nama Tim</Label>
                          <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Masukkan nama tim..."
                            className="glass border-white/40 dark:border-white/10 dark:bg-white/5 mt-1"
                          />
                        </div>
                        <div>
                          <Label>Deskripsi</Label>
                          <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Deskripsikan tim..."
                            className="glass border-white/40 dark:border-white/10 dark:bg-white/5 mt-1"
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label>Warna Tim</Label>
                          <div className="flex gap-2 mt-2">
                            {teamColors.map((color) => (
                              <button
                                key={color}
                                type="button"
                                className={`w-10 h-10 rounded-lg transition-all ${
                                  formData.color === color ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-800' : ''
                                }`}
                                style={{ backgroundColor: color }}
                                onClick={() => setFormData({ ...formData, color })}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateDialogOpen(false)} className="glass border-white/40 dark:border-white/10">
                          Batal
                        </Button>
                        <Button onClick={handleCreateTeam} className="bg-gradient-to-r from-[#355070] to-[#B56576] hover:from-[#355070]/90 hover:to-[#B56576]/90 text-white border-0">
                          Buat Tim
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}

                <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="glass border-white/40 dark:border-white/10 flex-1 md:flex-none">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Gabung Tim
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass-card border-white/40 dark:border-white/10">
                    <DialogHeader>
                      <DialogTitle className="bg-gradient-to-r from-[#355070] to-[#B56576] bg-clip-text text-transparent">
                        Gabung ke Tim
                      </DialogTitle>
                      <DialogDescription className="dark:text-gray-400">
                        Masukkan kode undangan untuk bergabung dengan tim
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label>Kode Undangan</Label>
                        <Input
                          value={joinCode}
                          onChange={(e) => setJoinCode(e.target.value)}
                          placeholder="Masukkan kode..."
                          className="glass border-white/40 dark:border-white/10 dark:bg-white/5 mt-1"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setJoinDialogOpen(false)} className="glass border-white/40 dark:border-white/10">
                        Batal
                      </Button>
                      <Button onClick={handleJoinTeam} className="bg-gradient-to-r from-[#355070] to-[#B56576] hover:from-[#355070]/90 hover:to-[#B56576]/90 text-white border-0">
                        Gabung
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Teams Grid */}
            {filteredTeams.length === 0 ? (
              <Card className="glass border-white/40 dark:border-white/10">
                <CardContent className="py-16 text-center">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                  <h3 className="text-gray-500 dark:text-gray-400 mb-2">
                    {searchQuery ? 'Tidak ada tim yang ditemukan' : 'Belum ada tim'}
                  </h3>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
                    {user.role === 'admin' 
                      ? 'Buat tim pertama Anda untuk mulai berkolaborasi'
                      : 'Bergabunglah dengan tim untuk mulai bekerja sama'
                    }
                  </p>
                  {user.role === 'admin' && (
                    <Button 
                      onClick={() => setCreateDialogOpen(true)}
                      className="bg-gradient-to-r from-[#355070] to-[#B56576] hover:from-[#355070]/90 hover:to-[#B56576]/90 text-white border-0"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Buat Tim Pertama
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTeams.map((team) => {
                  const isCreator = team.createdBy === user.id;
                  const memberCount = team.members.length;

                  return (
                    <Card 
                      key={team.id}
                      className="glass border-white/40 dark:border-white/10 hover:shadow-xl transition-all duration-300 group cursor-pointer relative overflow-hidden"
                      onClick={() => handleSelectTeam(team.id)}
                    >
                      {/* Color Bar */}
                      <div 
                        className="absolute top-0 left-0 right-0 h-1"
                        style={{ backgroundColor: team.color }}
                      />

                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg"
                              style={{ 
                                background: `linear-gradient(135deg, ${team.color}, ${team.color}dd)` 
                              }}
                            >
                              <Users className="w-6 h-6" />
                            </div>
                            <div>
                              <CardTitle className="text-gray-800 dark:text-gray-100 group-hover:text-[#355070] dark:group-hover:text-[#E88C7D] transition-colors">
                                {team.name}
                              </CardTitle>
                              <div className="flex gap-2 mt-1">
                                <Badge variant="outline" className="text-xs bg-white/50 dark:bg-white/5 border-white/40 dark:border-white/10">
                                  {memberCount} anggota
                                </Badge>
                                {isCreator && (
                                  <Badge className="text-xs bg-gradient-to-r from-[#355070] to-[#B56576] text-white border-0">
                                    Owner
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                          {team.description || 'Tidak ada deskripsi'}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            Dibuat {new Date(team.createdAt).toLocaleDateString('id-ID', { 
                              day: 'numeric', 
                              month: 'short',
                              year: 'numeric' 
                            })}
                          </span>
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-[#355070] to-[#B56576] hover:from-[#355070]/90 hover:to-[#B56576]/90 text-white border-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectTeam(team.id);
                            }}
                          >
                            Pilih
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Stats */}
            {userTeams.length > 0 && (
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="glass border-white/40 dark:border-white/10">
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl bg-gradient-to-r from-[#355070] to-[#B56576] bg-clip-text text-transparent mb-1">
                      {userTeams.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Tim</div>
                  </CardContent>
                </Card>
                <Card className="glass border-white/40 dark:border-white/10">
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl bg-gradient-to-r from-[#B56576] to-[#E56B6F] bg-clip-text text-transparent mb-1">
                      {userTeams.filter(t => t.createdBy === user.id).length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Tim Dibuat</div>
                  </CardContent>
                </Card>
                <Card className="glass border-white/40 dark:border-white/10">
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl bg-gradient-to-r from-[#E56B6F] to-[#E88C7D] bg-clip-text text-transparent mb-1">
                      {userTeams.filter(t => t.createdBy !== user.id).length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Tim Diikuti</div>
                  </CardContent>
                </Card>
                <Card className="glass border-white/40 dark:border-white/10">
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl bg-gradient-to-r from-[#E88C7D] to-[#EAAC8B] bg-clip-text text-transparent mb-1">
                      {userTeams.reduce((acc, team) => acc + team.members.length, 0)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Anggota</div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
