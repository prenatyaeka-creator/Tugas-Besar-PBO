import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Edit, Trash2, FolderKanban } from 'lucide-react';
import { Badge } from './ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

const projectColors = ['#355070', '#6D597A', '#B56576', '#E56B6F', '#E88C7D', '#EAAC8B'];

export function ProjectManagement() {
  const { projects, addProject, updateProject, deleteProject, getTasksByProject } = useData();
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: projectColors[0],
  });

  const handleSubmit = () => {
    if (!formData.name || !user) return;

    if (editingProject) {
      updateProject(editingProject, formData);
    } else {
      addProject({
        ...formData,
        createdBy: user.id,
      });
    }

    setFormData({ name: '', description: '', color: projectColors[0] });
    setEditingProject(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      setFormData({
        name: project.name,
        description: project.description,
        color: project.color,
      });
      setEditingProject(projectId);
      setIsDialogOpen(true);
    }
  };

  const handleDelete = (projectId: string) => {
    setProjectToDelete(projectId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete);
      setProjectToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProject(null);
    setFormData({ name: '', description: '', color: projectColors[0] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[#355070] mb-2">Manajemen Proyek</h2>
          <p className="text-gray-600">Kelola proyek tim Anda</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#355070] hover:bg-[#355070]/90" onClick={handleCloseDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Proyek
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-[#355070]">
                {editingProject ? 'Edit Proyek' : 'Buat Proyek Baru'}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Form untuk {editingProject ? 'mengedit' : 'membuat'} proyek dengan nama, deskripsi, dan warna
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="projectName">Nama Proyek</Label>
                <Input
                  id="projectName"
                  placeholder="Masukkan nama proyek"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="projectDescription">Deskripsi</Label>
                <Textarea
                  id="projectDescription"
                  placeholder="Deskripsikan proyek"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <Label>Warna Proyek</Label>
                <div className="flex gap-2 mt-2">
                  {projectColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-10 h-10 rounded-lg transition-all ${
                        formData.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData({ ...formData, color })}
                    />
                  ))}
                </div>
              </div>
              <Button onClick={handleSubmit} className="w-full bg-[#355070] hover:bg-[#355070]/90">
                {editingProject ? 'Update Proyek' : 'Buat Proyek'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const taskCount = getTasksByProject(project.id).length;
          const completedTasks = getTasksByProject(project.id).filter((t) => t.status === 'done').length;

          return (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: project.color }}
                    >
                      <FolderKanban className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-[#355070]">{project.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {taskCount} Tugas
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Progres</span>
                  <span className="text-[#355070]">
                    {taskCount > 0 ? Math.round((completedTasks / taskCount) * 100) : 0}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${taskCount > 0 ? (completedTasks / taskCount) * 100 : 0}%`,
                      backgroundColor: project.color,
                    }}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(project.id)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-[#E56B6F] hover:text-[#E56B6F]"
                    onClick={() => handleDelete(project.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Hapus
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {projects.length === 0 && (
          <div className="col-span-full text-center py-12">
            <FolderKanban className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Belum ada proyek</p>
            <p className="text-gray-400">Klik "Tambah Proyek" untuk membuat proyek baru</p>
          </div>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Proyek?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Semua tugas dalam proyek ini juga akan dihapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-[#E56B6F] hover:bg-[#E56B6F]/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
