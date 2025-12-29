import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Mail } from 'lucide-react';
import { useData } from '../contexts/DataContext';

type StoredUser = {
  id: string;
  name: string;
  email: string;
  role?: 'admin' | 'member';
  initials?: string;
};

const safeInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

export function TeamView() {
  const { teams, currentTeamId, tasks } = useData();

  const currentTeam = teams.find((t) => t.id === currentTeamId);

  const usersData = localStorage.getItem('taskmate_users');
  const users: StoredUser[] = usersData ? JSON.parse(usersData) : [];

  const members: StoredUser[] = (currentTeam?.members || [])
    .map((uid) => users.find((u) => u.id === uid))
    .filter(Boolean) as StoredUser[];

  const memberStats = members.map((m) => {
    const myTasks = tasks.filter((t) => t.assigneeId === m.id && t.teamId === currentTeamId);
    const done = myTasks.filter((t) => t.status === 'done').length;
    const inprogress = myTasks.filter((t) => t.status === 'inprogress').length;
    const todo = myTasks.filter((t) => t.status === 'todo').length;
    const total = done + inprogress + todo;
    const completionRate = total > 0 ? (done / total) * 100 : 0;
    return { ...m, done, inprogress, todo, total, completionRate };
  });

  const totalMembers = memberStats.length;
  const totalDone = memberStats.reduce((acc, m) => acc + m.done, 0);
  const totalInProgress = memberStats.reduce((acc, m) => acc + m.inprogress, 0);
  const totalTodo = memberStats.reduce((acc, m) => acc + m.todo, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[#355070] mb-2">Tim</h2>
        <p className="text-gray-600">Kelola anggota tim dan pantau kontribusi mereka</p>
      </div>

      {!currentTeam && (
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600">Silakan pilih tim terlebih dahulu.</p>
          </CardContent>
        </Card>
      )}

      {currentTeam && (
        <>
          {/* Team Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-2">Total Anggota</p>
                <p className="text-[#355070]">{totalMembers}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-2">Tugas Selesai</p>
                <p className="text-[#6D597A]">{totalDone}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-2">Sedang Dikerjakan</p>
                <p className="text-[#E88C7D]">{totalInProgress}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-2">Belum Dikerjakan</p>
                <p className="text-[#B56576]">{totalTodo}</p>
              </CardContent>
            </Card>
          </div>

          {totalMembers === 0 && (
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-600">
                  Belum ada anggota. Tambahkan anggota melalui menu <span className="font-medium">Tim</span> → <span className="font-medium">Kelola Tim</span>.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Team Members */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {memberStats.map((member) => (
              <Card key={member.id}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="text-white bg-[#355070]">
                        {(member.initials || safeInitials(member.name))}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-[#355070] mb-1">{member.name}</CardTitle>
                      <Badge className="bg-[#EAAC8B] hover:bg-[#EAAC8B] text-[#355070]">
                        {(member.role || 'member').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{member.email}</span>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">Progres Tugas</span>
                        <span className="text-[#355070]">{member.completionRate.toFixed(0)}%</span>
                      </div>
                      <Progress value={member.completionRate} className="h-2 mb-3" />
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center p-2 bg-[#6D597A]/10 rounded">
                          <p className="text-[#6D597A] mb-1">{member.done}</p>
                          <p className="text-gray-600">Selesai</p>
                        </div>
                        <div className="text-center p-2 bg-[#E88C7D]/10 rounded">
                          <p className="text-[#E88C7D] mb-1">{member.inprogress}</p>
                          <p className="text-gray-600">Progress</p>
                        </div>
                        <div className="text-center p-2 bg-[#B56576]/10 rounded">
                          <p className="text-[#B56576] mb-1">{member.todo}</p>
                          <p className="text-gray-600">To Do</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
