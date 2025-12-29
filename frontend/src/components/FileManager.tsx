import { useState, useRef } from 'react';
import { 
  FileText, 
  Image as ImageIcon, 
  Video, 
  FileSpreadsheet, 
  Presentation, 
  File as FileIcon, 
  Upload, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Edit2, 
  Tag,
  Calendar,
  User,
  FolderOpen,
  Grid3x3,
  List,
  X,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  FileQuestion,
  Send
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { useData, FileAttachment, FileComment } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface FileManagerProps {
  taskId?: string;
  projectId?: string;
  viewMode?: 'task' | 'project' | 'team';
}

export function FileManager({ taskId, projectId, viewMode = 'task' }: FileManagerProps) {
  const { user } = useAuth();
  const { 
    files, 
    addFile, 
    updateFile, 
    deleteFile, 
    getFilesByTask, 
    getFilesByProject,
    getFilesByTeam,
    currentTeam,
    tasks,
    projects,
    addFileComment,
    getFileComments
  } = useData();

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileAttachment | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>('grid');
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [newComment, setNewComment] = useState('');
  
  // Upload form state
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [fileType, setFileType] = useState('');
  const [fileCategory, setFileCategory] = useState<FileAttachment['category']>('document');
  const [fileDescription, setFileDescription] = useState('');
  const [fileTags, setFileTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get files based on view mode
  const getFiles = (): FileAttachment[] => {
    if (viewMode === 'task' && taskId) {
      return getFilesByTask(taskId);
    } else if (viewMode === 'project' && projectId) {
      return getFilesByProject(projectId);
    } else if (viewMode === 'team' && currentTeam) {
      return getFilesByTeam(currentTeam.id);
    }
    return [];
  };

  const displayFiles = getFiles()
    .filter(file => {
      const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          file.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || file.category === categoryFilter;
      const matchesTag = tagFilter === 'all' || file.tags.includes(tagFilter);
      return matchesSearch && matchesCategory && matchesTag;
    })
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

  // Get all unique tags
  const allTags = Array.from(new Set(getFiles().flatMap(f => f.tags)));

  const getCategoryIcon = (category: FileAttachment['category']) => {
    switch (category) {
      case 'document':
        return <FileText className="w-5 h-5" />;
      case 'image':
        return <ImageIcon className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'spreadsheet':
        return <FileSpreadsheet className="w-5 h-5" />;
      case 'presentation':
        return <Presentation className="w-5 h-5" />;
      default:
        return <FileIcon className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: FileAttachment['category']) => {
    switch (category) {
      case 'document':
        return 'from-blue-500 to-blue-600';
      case 'image':
        return 'from-green-500 to-green-600';
      case 'video':
        return 'from-purple-500 to-purple-600';
      case 'spreadsheet':
        return 'from-emerald-500 to-emerald-600';
      case 'presentation':
        return 'from-orange-500 to-orange-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Hari ini';
    if (days === 1) return 'Kemarin';
    if (days < 7) return `${days} hari yang lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileSize(file.size);
      setFileType(file.type);
      
      // Auto-detect category
      if (file.type.startsWith('image/')) {
        setFileCategory('image');
      } else if (file.type.startsWith('video/')) {
        setFileCategory('video');
      } else if (file.type.includes('spreadsheet') || file.type.includes('excel')) {
        setFileCategory('spreadsheet');
      } else if (file.type.includes('presentation') || file.type.includes('powerpoint')) {
        setFileCategory('presentation');
      } else if (file.type.includes('pdf') || file.type.includes('document') || file.type.includes('text')) {
        setFileCategory('document');
      } else {
        setFileCategory('other');
      }
    }
  };

  const handleUpload = () => {
    if (!fileName) {
      setError('Pilih file untuk diunggah');
      return;
    }

    if (!user || !currentTeam) return;

    const newFile: Omit<FileAttachment, 'id' | 'uploadedAt'> = {
      taskId: taskId || '',
      projectId: projectId || '',
      teamId: currentTeam.id,
      name: fileName,
      size: fileSize,
      type: fileType,
      category: fileCategory,
      url: `mock://file/${fileName}`, // In production, this would be a real URL
      uploadedBy: user.id,
      uploadedByName: user.name,
      tags: fileTags,
      description: fileDescription,
      status: 'draft',
    };

    addFile(newFile);
    resetUploadForm();
    setUploadDialogOpen(false);
  };

  const handleUpdate = () => {
    if (!selectedFile) return;

    updateFile(selectedFile.id, {
      description: fileDescription,
      tags: fileTags,
      category: fileCategory,
    });

    setEditDialogOpen(false);
    setSelectedFile(null);
    resetUploadForm();
  };

  const handleDelete = (fileId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus berkas ini?')) {
      deleteFile(fileId);
    }
  };

  const openEditDialog = (file: FileAttachment) => {
    setSelectedFile(file);
    setFileCategory(file.category);
    setFileDescription(file.description || '');
    setFileTags(file.tags);
    setEditDialogOpen(true);
  };

  const resetUploadForm = () => {
    setFileName('');
    setFileSize(0);
    setFileType('');
    setFileCategory('document');
    setFileDescription('');
    setFileTags([]);
    setNewTag('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addTag = () => {
    if (newTag && !fileTags.includes(newTag)) {
      setFileTags([...fileTags, newTag]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFileTags(fileTags.filter(t => t !== tag));
  };

  // Get task or project name for display
  const getContextName = (file: FileAttachment) => {
    if (viewMode === 'team') {
      const task = tasks.find(t => t.id === file.taskId);
      const project = projects.find(p => p.id === file.projectId);
      return task ? `📋 ${task.title}` : project ? `📁 ${project.name}` : '';
    }
    return '';
  };

  // Get status badge
  const getStatusBadge = (status: FileAttachment['status']) => {
    switch (status) {
      case 'draft':
        return (
          <Badge variant="outline" className="text-xs bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
            <FileQuestion className="w-3 h-3 mr-1" />
            Draft
          </Badge>
        );
      case 'needs-revision':
        return (
          <Badge variant="outline" className="text-xs bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300">
            <AlertCircle className="w-3 h-3 mr-1" />
            Perlu Revisi
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="outline" className="text-xs bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Disetujui
          </Badge>
        );
    }
  };

  // Open detail dialog
  const openDetailDialog = (file: FileAttachment) => {
    setSelectedFile(file);
    setDetailDialogOpen(true);
  };

  // Handle status change
  const handleStatusChange = (fileId: string, status: FileAttachment['status']) => {
    updateFile(fileId, { status });
    toast.success(`Status berkas diubah menjadi ${status === 'draft' ? 'Draft' : status === 'needs-revision' ? 'Perlu Revisi' : 'Disetujui'}`);
  };

  // Handle add comment
  const handleAddComment = () => {
    if (!selectedFile || !user || !newComment.trim()) return;

    addFileComment({
      fileId: selectedFile.id,
      userId: user.id,
      userName: user.name,
      userInitials: user.initials,
      message: newComment.trim(),
    });

    setNewComment('');
    toast.success('Komentar ditambahkan');
  };

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-5 h-5 text-[#6D597A] dark:text-[#B56576]" />
          <h3 className="text-gray-900 dark:text-gray-100">
            Berkas {viewMode === 'task' ? 'Tugas' : viewMode === 'project' ? 'Proyek' : 'Tim'}
          </h3>
          <Badge className="bg-gradient-to-r from-[#B56576] to-[#E56B6F] text-white border-0">
            {displayFiles.length}
          </Badge>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            onClick={() => setUploadDialogOpen(true)}
            className="bg-gradient-to-r from-[#355070] to-[#B56576] hover:from-[#355070]/90 hover:to-[#B56576]/90 text-white border-0 flex-1 md:flex-none"
          >
            <Upload className="w-4 h-4 mr-2" />
            Unggah Berkas
          </Button>
          
          <div className="flex gap-1 glass-card rounded-lg p-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewLayout('grid')}
              className={viewLayout === 'grid' ? 'bg-[#E88C7D]/20' : ''}
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewLayout('list')}
              className={viewLayout === 'list' ? 'bg-[#E88C7D]/20' : ''}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Cari berkas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 glass border-white/40"
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="glass border-white/40">
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent className="glass-card border-white/40">
            <SelectItem value="all">Semua Kategori</SelectItem>
            <SelectItem value="document">📄 Dokumen</SelectItem>
            <SelectItem value="image">🖼️ Gambar</SelectItem>
            <SelectItem value="video">🎥 Video</SelectItem>
            <SelectItem value="spreadsheet">📊 Spreadsheet</SelectItem>
            <SelectItem value="presentation">📽️ Presentasi</SelectItem>
            <SelectItem value="other">📦 Lainnya</SelectItem>
          </SelectContent>
        </Select>

        <Select value={tagFilter} onValueChange={setTagFilter}>
          <SelectTrigger className="glass border-white/40">
            <SelectValue placeholder="Tag" />
          </SelectTrigger>
          <SelectContent className="glass-card border-white/40">
            <SelectItem value="all">Semua Tag</SelectItem>
            {allTags.map(tag => (
              <SelectItem key={tag} value={tag}>
                <div className="flex items-center gap-2">
                  <Tag className="w-3 h-3" />
                  {tag}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Files Display */}
      {displayFiles.length === 0 ? (
        <Card className="glass border-white/40">
          <CardContent className="py-12 text-center">
            <FolderOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 mb-2">Belum ada berkas</p>
            <p className="text-sm text-gray-400">
              {searchQuery || categoryFilter !== 'all' || tagFilter !== 'all'
                ? 'Tidak ada berkas yang sesuai filter'
                : 'Unggah berkas pertama Anda'}
            </p>
          </CardContent>
        </Card>
      ) : viewLayout === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayFiles.map((file) => (
            <Card key={file.id} className="glass border-white/40 group hover-shadow-smooth relative">
              <CardContent className="p-4 relative z-0">
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getCategoryColor(file.category)} flex items-center justify-center text-white flex-shrink-0`}>
                    {getCategoryIcon(file.category)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm text-gray-900 dark:text-gray-100 truncate mb-1">{file.name}</h4>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    
                    {viewMode === 'team' && (
                      <p className="text-xs text-gray-400 mt-1 truncate">
                        {getContextName(file)}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-1 transition-opacity duration-300 opacity-0 group-hover:opacity-100 relative z-10">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 hover:bg-[#E88C7D]/20 hover-child-safe"
                      onClick={() => openDetailDialog(file)}
                    >
                      <MessageSquare className="w-3 h-3" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[#E88C7D]/20 hover-child-safe">
                          <Edit2 className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass-card border-white/40">
                        <DropdownMenuItem onClick={() => openEditDialog(file)} className="hover:bg-[#E88C7D]/10">
                          <Edit2 className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(file.id)} className="hover:bg-red-50 text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {file.description && (
                  <p className="text-xs text-gray-600 mt-3 line-clamp-2">{file.description}</p>
                )}

                <div className="flex flex-wrap gap-1 mt-3">
                  {getStatusBadge(file.status)}
                  {file.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs bg-[#EAAC8B]/20 border-[#EAAC8B]/40 text-gray-800 dark:text-gray-200 dark:bg-[#EAAC8B]/30">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <User className="w-3 h-3" />
                    {file.uploadedByName}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {formatDate(file.uploadedAt)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="glass border-white/40">
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {displayFiles.map((file) => (
                <div key={file.id} className="p-4 hover:bg-white/50 transition-all duration-300 group">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getCategoryColor(file.category)} flex items-center justify-center text-white flex-shrink-0`}>
                      {getCategoryIcon(file.category)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm text-gray-900 dark:text-gray-100 truncate">{file.name}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                        <span className="text-xs text-gray-500">{file.uploadedByName}</span>
                        <span className="text-xs text-gray-500">{formatDate(file.uploadedAt)}</span>
                        {viewMode === 'team' && (
                          <span className="text-xs text-gray-400">{getContextName(file)}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {file.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs bg-[#EAAC8B]/20 border-[#EAAC8B]/40 text-gray-800 dark:text-gray-200 dark:bg-[#EAAC8B]/30">
                          {tag}
                        </Badge>
                      ))}
                      {file.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{file.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-1 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(file)} className="h-8 w-8 hover:bg-[#E88C7D]/20">
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(file.id)} className="h-8 w-8 text-red-600 hover:bg-red-50">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="glass-card border-white/40 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="bg-gradient-to-r from-[#355070] to-[#B56576] bg-clip-text text-transparent">
              Unggah Berkas Baru
            </DialogTitle>
            <DialogDescription>
              Tambahkan berkas untuk {viewMode === 'task' ? 'tugas' : viewMode === 'project' ? 'proyek' : 'tim'} ini
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {error && (
              <Alert variant="destructive" className="glass border-red-200/50 bg-red-50/90">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div>
              <Label>Pilih Berkas</Label>
              <div className="mt-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <div className="glass-card border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#B56576] transition-colors">
                    <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-1">
                      {fileName || 'Klik untuk memilih berkas'}
                    </p>
                    {fileSize > 0 && (
                      <p className="text-xs text-gray-500">{formatFileSize(fileSize)}</p>
                    )}
                  </div>
                </label>
              </div>
            </div>

            <div>
              <Label>Kategori</Label>
              <Select value={fileCategory} onValueChange={(value) => setFileCategory(value as FileAttachment['category'])}>
                <SelectTrigger className="glass border-white/40 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/40">
                  <SelectItem value="document">📄 Dokumen</SelectItem>
                  <SelectItem value="image">🖼️ Gambar</SelectItem>
                  <SelectItem value="video">🎥 Video</SelectItem>
                  <SelectItem value="spreadsheet">📊 Spreadsheet</SelectItem>
                  <SelectItem value="presentation">📽️ Presentasi</SelectItem>
                  <SelectItem value="other">📦 Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Deskripsi (Opsional)</Label>
              <Textarea
                value={fileDescription}
                onChange={(e) => setFileDescription(e.target.value)}
                placeholder="Tambahkan deskripsi berkas..."
                className="glass border-white/40 mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label>Tag</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Tambah tag..."
                  className="glass border-white/40"
                />
                <Button
                  type="button"
                  onClick={addTag}
                  variant="outline"
                  className="glass border-white/40"
                >
                  <Tag className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {fileTags.map((tag) => (
                  <Badge
                    key={tag}
                    className="bg-[#EAAC8B]/20 border-[#EAAC8B]/40 text-gray-700 hover:bg-[#EAAC8B]/30 cursor-pointer"
                    onClick={() => removeTag(tag)}
                  >
                    {tag}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setUploadDialogOpen(false); resetUploadForm(); }} className="glass border-white/40">
              Batal
            </Button>
            <Button onClick={handleUpload} className="bg-gradient-to-r from-[#355070] to-[#B56576] hover:from-[#355070]/90 hover:to-[#B56576]/90 text-white border-0">
              Unggah
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="glass-card border-white/40 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="bg-gradient-to-r from-[#355070] to-[#B56576] bg-clip-text text-transparent">
              Edit Berkas
            </DialogTitle>
            <DialogDescription>
              Ubah informasi berkas
            </DialogDescription>
          </DialogHeader>

          {selectedFile && (
            <div className="space-y-4 py-4">
              <div className="glass-card p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getCategoryColor(selectedFile.category)} flex items-center justify-center text-white`}>
                    {getCategoryIcon(selectedFile.category)}
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-900 dark:text-gray-100">{selectedFile.name}</h4>
                    <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                  </div>
                </div>
              </div>

              <div>
                <Label>Kategori</Label>
                <Select value={fileCategory} onValueChange={(value) => setFileCategory(value as FileAttachment['category'])}>
                  <SelectTrigger className="glass border-white/40 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/40">
                    <SelectItem value="document">📄 Dokumen</SelectItem>
                    <SelectItem value="image">🖼️ Gambar</SelectItem>
                    <SelectItem value="video">🎥 Video</SelectItem>
                    <SelectItem value="spreadsheet">📊 Spreadsheet</SelectItem>
                    <SelectItem value="presentation">📽️ Presentasi</SelectItem>
                    <SelectItem value="other">📦 Lainnya</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Deskripsi</Label>
                <Textarea
                  value={fileDescription}
                  onChange={(e) => setFileDescription(e.target.value)}
                  placeholder="Tambahkan deskripsi berkas..."
                  className="glass border-white/40 mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label>Tag</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Tambah tag..."
                    className="glass border-white/40"
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    variant="outline"
                    className="glass border-white/40"
                  >
                    <Tag className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {fileTags.map((tag) => (
                    <Badge
                      key={tag}
                      className="bg-[#EAAC8B]/20 border-[#EAAC8B]/40 text-gray-700 hover:bg-[#EAAC8B]/30 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    >
                      {tag}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditDialogOpen(false); setSelectedFile(null); resetUploadForm(); }} className="glass border-white/40">
              Batal
            </Button>
            <Button onClick={handleUpdate} className="bg-gradient-to-r from-[#355070] to-[#B56576] hover:from-[#355070]/90 hover:to-[#B56576]/90 text-white border-0">
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog with Comments */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="glass-card border-white/40 max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="bg-gradient-to-r from-[#355070] to-[#B56576] bg-clip-text text-transparent">
              Detail Berkas
            </DialogTitle>
            <DialogDescription className="sr-only">
              Informasi lengkap berkas termasuk kategori, ukuran, tanggal upload, dan komentar
            </DialogDescription>
          </DialogHeader>

          {selectedFile && (
            <div className="grid md:grid-cols-2 gap-6 py-4">
              {/* Left Column - File Info */}
              <div className="space-y-4">
                <div className="glass-card p-4 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getCategoryColor(selectedFile.category)} flex items-center justify-center text-white`}>
                      {getCategoryIcon(selectedFile.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-gray-900 dark:text-gray-100 truncate mb-1">{selectedFile.name}</h4>
                      <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                    </div>
                  </div>

                  {selectedFile.description && (
                    <div className="mb-4">
                      <Label className="text-gray-800 dark:text-gray-200">Deskripsi</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{selectedFile.description}</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Diunggah oleh</span>
                      <span className="text-gray-900 dark:text-gray-100">{selectedFile.uploadedByName}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Tanggal upload</span>
                      <span className="text-gray-900 dark:text-gray-100">{formatDate(selectedFile.uploadedAt)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Kategori</span>
                      <Badge className="bg-gradient-to-r from-[#6D597A] to-[#B56576] text-white border-0">
                        {selectedFile.category}
                      </Badge>
                    </div>
                  </div>

                  {selectedFile.tags.length > 0 && (
                    <div className="mt-4">
                      <Label className="text-gray-800 dark:text-gray-200 mb-2 block">Tags</Label>
                      <div className="flex flex-wrap gap-2">
                        {selectedFile.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="bg-[#EAAC8B]/20 border-[#EAAC8B]/40 text-gray-800 dark:text-gray-200 dark:bg-[#EAAC8B]/30">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Status Section */}
                <div className="glass-card p-4 rounded-xl">
                  <Label className="text-gray-800 dark:text-gray-200 mb-3 block">Status Berkas</Label>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className={`w-full justify-start ${selectedFile.status === 'draft' ? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600' : 'glass border-white/40'}`}
                      onClick={() => handleStatusChange(selectedFile.id, 'draft')}
                    >
                      <FileQuestion className="w-4 h-4 mr-2" />
                      Draft
                      {selectedFile.status === 'draft' && <CheckCircle2 className="w-4 h-4 ml-auto text-green-600" />}
                    </Button>
                    <Button
                      variant="outline"
                      className={`w-full justify-start ${selectedFile.status === 'needs-revision' ? 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700' : 'glass border-white/40'}`}
                      onClick={() => handleStatusChange(selectedFile.id, 'needs-revision')}
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Perlu Revisi
                      {selectedFile.status === 'needs-revision' && <CheckCircle2 className="w-4 h-4 ml-auto text-green-600" />}
                    </Button>
                    <Button
                      variant="outline"
                      className={`w-full justify-start ${selectedFile.status === 'approved' ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700' : 'glass border-white/40'}`}
                      onClick={() => handleStatusChange(selectedFile.id, 'approved')}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Disetujui
                      {selectedFile.status === 'approved' && <CheckCircle2 className="w-4 h-4 ml-auto text-green-600" />}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Column - Comments */}
              <div className="flex flex-col h-full">
                <div className="glass-card p-4 rounded-xl flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-gray-800 dark:text-gray-100">
                      <MessageSquare className="w-4 h-4 inline mr-2" />
                      Komentar
                    </Label>
                    <Badge className="bg-[#B56576] text-white border-0">
                      {getFileComments(selectedFile.id).length}
                    </Badge>
                  </div>

                  {/* Comments List */}
                  <ScrollArea className="flex-1 pr-4 -mr-4 mb-4">
                    <div className="space-y-4">
                      {getFileComments(selectedFile.id).length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-20" />
                          <p className="text-sm">Belum ada komentar</p>
                        </div>
                      ) : (
                        getFileComments(selectedFile.id).map((comment) => (
                          <div key={comment.id} className="flex gap-3">
                            <Avatar className="w-8 h-8 flex-shrink-0">
                              <AvatarFallback className="bg-gradient-to-br from-[#355070] to-[#B56576] text-white text-xs">
                                {comment.userInitials}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-sm text-gray-900 dark:text-gray-100">{comment.userName}</span>
                                <span className="text-xs text-gray-500">
                                  {formatDate(comment.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
                                {comment.message}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>

                  {/* Add Comment Form */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex gap-2">
                      <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Tulis komentar..."
                        className="glass border-white/40 min-h-[80px]"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAddComment();
                          }
                        }}
                      />
                    </div>
                    <Button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="w-full mt-2 bg-gradient-to-r from-[#355070] to-[#6D597A] hover:from-[#355070]/90 hover:to-[#6D597A]/90 text-white border-0"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Kirim Komentar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
