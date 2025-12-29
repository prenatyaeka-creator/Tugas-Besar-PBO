import { createContext, useContext, useState, useEffect, ReactNode } from 'react';


const generateJoinCode = (length: number = 8): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // avoid confusing chars (I, O, 0, 1)
  let out = '';
  for (let i = 0; i < length; i++) {
    out += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return out;
};

const normalizeTeamsWithJoinCode = (teams: any[]): any[] => {
  return teams.map((t) => ({
    ...t,
    joinCode: (t.joinCode && String(t.joinCode).trim().length > 0) ? String(t.joinCode).toUpperCase() : generateJoinCode(),
  }));
};

export interface Team {
  id: string;
  name: string;
  description: string;
  color: string;
    joinCode: string;
members: string[]; // user IDs
  createdBy: string;
  createdAt: string;
}

export interface Project {
  id: string;
  teamId: string;
  name: string;
  description: string;
  color: string;
  createdBy: string;
  createdAt: string;
}

export interface Task {
  id: string;
  teamId: string;
  projectId: string;
  title: string;
  description: string;
  status: 'todo' | 'inprogress' | 'done';
  assigneeId: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  createdBy: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  userInitials: string;
  message: string;
  createdAt: string;
}

export interface FileAttachment {
  id: string;
  taskId: string;
  projectId: string;
  teamId: string;
  name: string;
  size: number;
  type: string;
  category: 'document' | 'image' | 'video' | 'spreadsheet' | 'presentation' | 'other';
  url: string; // For demo purposes, we'll use data URLs or mock URLs
  uploadedBy: string;
  uploadedByName: string;
  uploadedAt: string;
  tags: string[];
  description?: string;
  status: 'draft' | 'needs-revision' | 'approved';
}

export interface FileComment {
  id: string;
  fileId: string;
  userId: string;
  userName: string;
  userInitials: string;
  message: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'task_assigned' | 'task_completed' | 'comment_added' | 'deadline_approaching' | 'file_uploaded' | 'team_invite';
  title: string;
  message: string;
  relatedId?: string; // task id, project id, etc
  isRead: boolean;
  createdAt: string;
}

interface DataContextType {
  teams: Team[];
  currentTeam: Team | null;
  projects: Project[];
  tasks: Task[];
  comments: Comment[];
  files: FileAttachment[];
  fileComments: FileComment[];
  notifications: Notification[];
  addTeam: (team: Omit<Team, 'id' | 'createdAt'>) => void;
  updateTeam: (id: string, team: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
  setCurrentTeam: (teamId: string | null) => void;
    joinTeamByCode: (code: string, userId: string) => Team | null;
addMemberToTeam: (teamId: string, userId: string) => void;
  removeMemberFromTeam: (teamId: string, userId: string) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  addFile: (file: Omit<FileAttachment, 'id' | 'uploadedAt'>) => void;
  updateFile: (id: string, file: Partial<FileAttachment>) => void;
  deleteFile: (id: string) => void;
  addFileComment: (comment: Omit<FileComment, 'id' | 'createdAt'>) => void;
  getFileComments: (fileId: string) => FileComment[];
  getTasksByProject: (projectId: string) => Task[];
  getCommentsByTask: (taskId: string) => Comment[];
  getFilesByTask: (taskId: string) => FileAttachment[];
  getFilesByProject: (projectId: string) => FileAttachment[];
  getFilesByTeam: (teamId: string) => FileAttachment[];
  getUserTeams: (userId: string) => Team[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  getUserNotifications: (userId: string) => Notification[];
  getUnreadCount: (userId: string) => number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeam, setCurrentTeamState] = useState<Team | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [files, setFiles] = useState<FileAttachment[]>([]);
  const [fileComments, setFileComments] = useState<FileComment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load data from localStorage
  useEffect(() => {
    // One-time cleanup: remove any leftover demo data from older builds.
    // This keeps the repository "clean" without requiring manual localStorage reset.
    const alreadyPurged = localStorage.getItem('taskmate_demo_purged');
    if (!alreadyPurged) {
      localStorage.removeItem('taskmate_projects');
      localStorage.removeItem('taskmate_tasks');
      localStorage.removeItem('taskmate_comments');
      localStorage.removeItem('taskmate_files');
      localStorage.removeItem('taskmate_file_comments');
      localStorage.removeItem('taskmate_notifications');
      localStorage.setItem('taskmate_demo_purged', '1');
    }

    const savedTeams = localStorage.getItem('taskmate_teams');
    const savedCurrentTeamId = localStorage.getItem('taskmate_current_team');
    const savedProjects = localStorage.getItem('taskmate_projects');
    const savedTasks = localStorage.getItem('taskmate_tasks');
    const savedComments = localStorage.getItem('taskmate_comments');
    const savedFiles = localStorage.getItem('taskmate_files');
    const savedFileComments = localStorage.getItem('taskmate_file_comments');
    const savedNotifications = localStorage.getItem('taskmate_notifications');

    if (savedTeams) {
      const teamsData = normalizeTeamsWithJoinCode(JSON.parse(savedTeams));
      setTeams(teamsData);
      
      if (savedCurrentTeamId) {
        const currentTeamData = teamsData.find((t: Team) => t.id === savedCurrentTeamId);
        if (currentTeamData) {
          setCurrentTeamState(currentTeamData);
        }
      }
    }
    if (savedProjects) setProjects(JSON.parse(savedProjects));
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedComments) setComments(JSON.parse(savedComments));
    if (savedFiles) setFiles(JSON.parse(savedFiles));
    if (savedFileComments) setFileComments(JSON.parse(savedFileComments));
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('taskmate_teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    if (currentTeam) {
      localStorage.setItem('taskmate_current_team', currentTeam.id);
    } else {
      localStorage.removeItem('taskmate_current_team');
    }
  }, [currentTeam]);

  useEffect(() => {
    localStorage.setItem('taskmate_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('taskmate_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('taskmate_comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('taskmate_files', JSON.stringify(files));
  }, [files]);

  useEffect(() => {
    localStorage.setItem('taskmate_file_comments', JSON.stringify(fileComments));
  }, [fileComments]);

  useEffect(() => {
    localStorage.setItem('taskmate_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addTeam = (team: Omit<Team, 'id' | 'createdAt' | 'joinCode'>) => {
    const newTeam: Team = {
      ...team,
      id: Date.now().toString(),
      joinCode: generateJoinCode(),
      createdAt: new Date().toISOString(),
    };
    setTeams([...teams, newTeam]);
    
    // Set as current team if it's the first team
    if (teams.length === 0) {
      setCurrentTeamState(newTeam);
    }
  };

  const updateTeam = (id: string, updatedTeam: Partial<Team>) => {
    setTeams(teams.map((t) => (t.id === id ? { ...t, ...updatedTeam } : t)));
    if (currentTeam?.id === id) {
      setCurrentTeamState({ ...currentTeam, ...updatedTeam });
    }
  };

  const deleteTeam = (id: string) => {
    setTeams(teams.filter((t) => t.id !== id));
    if (currentTeam?.id === id) {
      setCurrentTeamState(null);
    }
    // Also delete projects and tasks associated with this team
    setProjects(projects.filter((p) => p.teamId !== id));
    setTasks(tasks.filter((t) => t.teamId !== id));
  };

  const setCurrentTeam = (teamId: string | null) => {
    if (teamId === null) {
      setCurrentTeamState(null);
    } else {
      const team = teams.find((t) => t.id === teamId);
      if (team) {
        setCurrentTeamState(team);
      }
    }
  };

const joinTeamByCode = (code: string, userId: string): Team | null => {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return null;

  const team = teams.find((t) => (t.joinCode || '').toUpperCase() === normalized);
  if (!team) return null;

  // already a member
  if (team.members.includes(userId)) {
    setCurrentTeamState(team);
    return team;
  }

  const updatedTeam: Team = { ...team, members: [...team.members, userId] };
  setTeams(teams.map((t) => (t.id === team.id ? updatedTeam : t)));
  setCurrentTeamState(updatedTeam);
  return updatedTeam;
};



  const addMemberToTeam = (teamId: string, userId: string) => {
    const team = teams.find((t) => t.id === teamId);
    if (team && !team.members.includes(userId)) {
      updateTeam(teamId, { members: [...team.members, userId] });
    }
  };

  const removeMemberFromTeam = (teamId: string, userId: string) => {
    const team = teams.find((t) => t.id === teamId);
    if (team) {
      updateTeam(teamId, { members: team.members.filter((id) => id !== userId) });
    }
  };

  const getUserTeams = (userId: string) => {
    return teams.filter((t) => t.members.includes(userId) || t.createdBy === userId);
  };

  const addProject = (project: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setProjects([...projects, newProject]);
  };

  const updateProject = (id: string, updatedProject: Partial<Project>) => {
    setProjects(projects.map((p) => (p.id === id ? { ...p, ...updatedProject } : p)));
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
    // Also delete tasks associated with this project
    setTasks(tasks.filter((t) => t.projectId !== id));
  };

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, updatedTask: Partial<Task>) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, ...updatedTask } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
    // Also delete comments associated with this task
    setComments(comments.filter((c) => c.taskId !== id));
  };

  const addComment = (comment: Omit<Comment, 'id' | 'createdAt'>) => {
    const newComment: Comment = {
      ...comment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setComments([...comments, newComment]);
  };

  const getTasksByProject = (projectId: string) => {
    return tasks.filter((t) => t.projectId === projectId);
  };

  const getCommentsByTask = (taskId: string) => {
    return comments.filter((c) => c.taskId === taskId);
  };

  const addFile = (file: Omit<FileAttachment, 'id' | 'uploadedAt'>) => {
    const newFile: FileAttachment = {
      ...file,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      uploadedAt: new Date().toISOString(),
    };
    setFiles([...files, newFile]);
  };

  const updateFile = (id: string, updatedFile: Partial<FileAttachment>) => {
    setFiles(files.map((f) => (f.id === id ? { ...f, ...updatedFile } : f)));
  };

  const deleteFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
    // Also delete file comments
    setFileComments(fileComments.filter((fc) => fc.fileId !== id));
  };

  const addFileComment = (comment: Omit<FileComment, 'id' | 'createdAt'>) => {
    const newComment: FileComment = {
      ...comment,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    setFileComments([...fileComments, newComment]);
  };

  const getFileComments = (fileId: string) => {
    return fileComments.filter((fc) => fc.fileId === fileId).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  const getFilesByTask = (taskId: string) => {
    return files.filter((f) => f.taskId === taskId);
  };

  const getFilesByProject = (projectId: string) => {
    return files.filter((f) => f.projectId === projectId);
  };

  const getFilesByTeam = (teamId: string) => {
    return files.filter((f) => f.teamId === teamId);
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    setNotifications([newNotification, ...notifications]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map((n) => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const getUserNotifications = (userId: string) => {
    return notifications.filter((n) => n.userId === userId).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  const getUnreadCount = (userId: string) => {
    return notifications.filter((n) => n.userId === userId && !n.isRead).length;
  };

  return (
    <DataContext.Provider
      value={{
        teams,
        currentTeam,
        projects,
        tasks,
        comments,
        files,
        fileComments,
        notifications,
        addTeam,
        updateTeam,
        deleteTeam,
        setCurrentTeam,
        addMemberToTeam,
        removeMemberFromTeam,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        deleteTask,
        addComment,
        addFile,
        updateFile,
        deleteFile,
        addFileComment,
        getFileComments,
        getTasksByProject,
        getCommentsByTask,
        getFilesByTask,
        getFilesByProject,
        getFilesByTeam,
        getUserTeams,
        addNotification,
        markNotificationAsRead,
        deleteNotification,
        getUserNotifications,
        getUnreadCount,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}