import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Users, Trash2, UserPlus, Crown, X, Copy } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';

export function TeamManagement() {
  const { teams, addTeam, updateTeam, deleteTeam, addMemberToTeam, removeMemberFromTeam, getUserTeams } = useData();
  const { user } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [newTeam, setNewTeam] = useState({
    name: '',
    description: '',
    color: '#355070',
  });
  const [selectedUserId, setSelectedUserId] = useState('');

  // Get all users from localStorage
  const usersData = localStorage.getItem('taskmate_users');
  const allUsers = usersData ? JSON.parse(usersData) : [];

  const userTeams = user ? getUserTeams(user.id) : [];

  const handleCreateTeam = () => {
    if (!newTeam.name || !user) return;

    addTeam({
      ...newTeam,
      members: [user.id],
      createdBy: user.id,
    });

    setNewTeam({ name: '', description: '', color: '#355070' });
    setIsCreateOpen(false);
  };

  const handleAddMember = () => {
    if (!selectedTeam || !selectedUserId) return;

    addMemberToTeam(selectedTeam, selectedUserId);
    setSelectedUserId('');
    setIsAddMemberOpen(false);
  };

  const handleRemoveMember = (teamId: string, userId: string) => {
    removeMemberFromTeam(teamId, userId);
  };

  const handleDeleteTeam = (teamId: string) => {
    deleteTeam(teamId);
  };

const handleCopyInviteCode = async (code: string) => {
  try {
    await navigator.clipboard.writeText(code);
  } catch {
    // ignore (clipboard permission may be denied)
  }
};



  const colors = [
    { value: '#355070', label: 'Navy' },
    { value: '#6D597A', label: 'Purple' },
    { value: '#B56576', label: 'Mauve' },
    { value: '#E56B6F', label: 'Coral' },
    { value: '#E88C7D', label: 'Peach' },
    { value: '#EAAC8B', label: 'Light Peach' },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="glass-card rounded-2xl p-4 md:p-6 border-white/40 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-[#355070] to-[#B56576] flex items-center justify-center shadow-lg">
              <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h2 className="bg-gradient-to-r from-[#355070] via-[#B56576] to-[#E56B6F] bg-clip-text text-transparent">Manajemen Tim</h2>
              <p className="text-gray-600 text-sm md:text-base">Kelola tim dan anggota Anda</p>
            </div>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#355070] to-[#B56576] hover:from-[#355070]/90 hover:to-[#B56576]/90 text-white border-0 shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Buat Tim Baru</span>
                <span className="md:hidden">Buat</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-white/40 bg-white/95 backdrop-blur-xl">
              <DialogHeader>
                <DialogTitle className="bg-gradient-to-r from-[#355070] to-[#B56576] bg-clip-text text-transparent">Buat Tim Baru</DialogTitle>
                <DialogDescription>Buat tim baru untuk berkolaborasi dengan anggota lainnya</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="teamName">Nama Tim</Label>
                  <Input
                    id="teamName"
                    placeholder="e.g., Tim Pengembangan Web"
                    value={newTeam.name}
                    onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                    className="glass border-white/40 bg-white/60 mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="teamDescription">Deskripsi</Label>
                  <Textarea
                    id="teamDescription"
                    placeholder="Deskripsi singkat tentang tim ini..."
                    value={newTeam.description}
                    onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                    className="glass border-white/40 bg-white/60 mt-1"
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Warna Tim</Label>
                  <div className="grid grid-cols-6 gap-2 mt-2">
                    {colors.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        className={`w-full h-10 rounded-lg transition-all hover:scale-110 ${
                          newTeam.color === color.value ? 'ring-2 ring-offset-2 ring-gray-800' : ''
                        }`}
                        style={{ backgroundColor: color.value }}
                        onClick={() => setNewTeam({ ...newTeam, color: color.value })}
                        title={color.label}
                      />
                    ))}
                  </div>
                </div>
                <Button
                  onClick={handleCreateTeam}
                  className="w-full bg-gradient-to-r from-[#355070] to-[#B56576] hover:from-[#355070]/90 hover:to-[#B56576]/90 text-white border-0"
                >
                  Buat Tim
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {userTeams.map((team) => {
          const isCreator = team.createdBy === user?.id;
          const teamMembers = allUsers.filter((u: any) => team.members.includes(u.id));

          return (
            <Card key={team.id} className="glass-card border-white/40 shadow-xl hover:shadow-2xl transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: team.color }}
                    >
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-gray-900 dark:text-gray-100 text-base md:text-lg truncate">
{team.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{team.description}</CardDescription>

                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <Badge className="bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-200">
                      Invite Code
                    </Badge>
                    <span className="font-mono text-sm tracking-wider text-gray-800 dark:text-gray-200">
                      {team.joinCode}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyInviteCode(team.joinCode)}
                      className="h-8 px-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>

                    </div>
                  </div>
                  {isCreator && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="glass-card border-white/40 bg-white/95 backdrop-blur-xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hapus Tim?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus tim ini? Semua proyek dan tugas dalam tim ini akan dihapus.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteTeam(team.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-600 text-sm">Anggota Tim ({teamMembers.length})</p>
                    {isCreator && (
                      <Dialog open={isAddMemberOpen && selectedTeam === team.id} onOpenChange={(open) => {
                        setIsAddMemberOpen(open);
                        if (open) setSelectedTeam(team.id);
                      }}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="glass border-white/40">
                            <UserPlus className="w-4 h-4 mr-1" />
                            Tambah
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glass-card border-white/40 bg-white/95 backdrop-blur-xl">
                          <DialogHeader>
                            <DialogTitle className="bg-gradient-to-r from-[#355070] to-[#B56576] bg-clip-text text-transparent">Tambah Anggota</DialogTitle>
                            <DialogDescription>Pilih pengguna untuk ditambahkan ke tim</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            <div>
                              <Label htmlFor="selectUser">Pilih Pengguna</Label>
                              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                                <SelectTrigger className="glass border-white/40 bg-white/60 mt-1">
                                  <SelectValue placeholder="Pilih pengguna..." />
                                </SelectTrigger>
                                <SelectContent className="glass-card border-white/40 bg-white/95 backdrop-blur-xl">
                                  {allUsers
                                    .filter((u: any) => !team.members.includes(u.id))
                                    .map((u: any) => (
                                      <SelectItem key={u.id} value={u.id}>
                                        {u.name} ({u.email})
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <Button
                              onClick={handleAddMember}
                              className="w-full bg-gradient-to-r from-[#355070] to-[#B56576] hover:from-[#355070]/90 hover:to-[#B56576]/90 text-white border-0"
                            >
                              Tambah Anggota
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>

                  <div className="space-y-2">
                    {teamMembers.slice(0, 5).map((member: any) => (
                      <div key={member.id} className="glass-card p-2 rounded-lg border-white/40 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8 ring-2 ring-white/50">
                            <AvatarFallback 
                              className="text-white text-xs"
                              style={{ backgroundColor: team.color }}
                            >
                              {member.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 dark:text-gray-100 truncate">{member.name}</p>
                            <p className="text-xs text-gray-500 truncate">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {member.id === team.createdBy && (
                            <Badge variant="secondary" className="glass border-white/40 text-xs">
                              <Crown className="w-3 h-3 mr-1 text-yellow-600" />
                              Owner
                            </Badge>
                          )}
                          {isCreator && member.id !== team.createdBy && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveMember(team.id, member.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    {teamMembers.length > 5 && (
                      <p className="text-xs text-gray-500 text-center">+{teamMembers.length - 5} anggota lainnya</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {userTeams.length === 0 && (
          <Card className="glass-card border-white/40 shadow-xl col-span-full">
            <CardContent className="py-12 text-center">
              <div className="text-4xl mb-3">👥</div>
              <p className="text-gray-600 mb-4">Anda belum memiliki tim</p>
              <Button
                onClick={() => setIsCreateOpen(true)}
                className="bg-gradient-to-r from-[#355070] to-[#B56576] hover:from-[#355070]/90 hover:to-[#B56576]/90 text-white border-0"
              >
                <Plus className="w-4 h-4 mr-2" />
                Buat Tim Pertama Anda
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
