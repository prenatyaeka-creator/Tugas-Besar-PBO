import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'id' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations = {
  id: {
    // Landing Page
    'landing.title': 'TaskMate',
    'landing.subtitle': 'Platform Kolaborasi Tim yang Modern',
    'landing.description': 'TaskMate adalah aplikasi manajemen tugas dan kolaborasi yang dirancang khusus untuk membantu tim Anda mengatur, memantau, dan menyelesaikan proyek dengan lebih efisien. Dengan interface yang modern dan fitur lengkap, produktivitas tim Anda akan meningkat drastis.',
    'landing.getStarted': 'Mulai Sekarang',
    'landing.login': 'Masuk',
    'landing.register': 'Daftar',
    'landing.features': 'Fitur Unggulan',
    'landing.aboutUs': 'Tentang Kami',
    'landing.contact': 'Kontak',
    
    // Features
    'feature.taskManagement': 'Manajemen Tugas',
    'feature.taskManagement.desc': 'Kelola tugas dengan sistem kanban yang intuitif dan mudah digunakan',
    'feature.teamCollaboration': 'Kolaborasi Tim',
    'feature.teamCollaboration.desc': 'Bekerja bersama dengan anggota tim dalam satu platform terpusat',
    'feature.calendar': 'Dashboard Kalender',
    'feature.calendar.desc': 'Pantau deadline dan jadwal dengan kalender interaktif',
    'feature.discussion': 'Diskusi Real-time',
    'feature.discussion.desc': 'Komunikasi lancar dengan fitur diskusi dan komentar',
    'feature.fileManagement': 'Manajemen Berkas',
    'feature.fileManagement.desc': 'Simpan dan kelola semua berkas proyek dengan mudah',
    'feature.multiTeam': 'Multi-Team',
    'feature.multiTeam.desc': 'Kelola multiple tim dan proyek dalam satu aplikasi',
    
    // About Us
    'about.title': 'Tentang TaskMate',
    'about.description': 'TaskMate lahir dari kebutuhan nyata tim-tim modern yang memerlukan platform kolaborasi yang simple namun powerful. Kami percaya bahwa produktivitas tidak harus rumit.',
    'about.mission.title': 'Misi Kami',
    'about.mission.desc': 'Membuat kolaborasi tim menjadi lebih mudah, efisien, dan menyenangkan dengan teknologi yang user-friendly.',
    'about.vision.title': 'Visi Kami',
    'about.vision.desc': 'Menjadi platform pilihan utama untuk manajemen proyek dan kolaborasi tim di Indonesia.',
    'about.values.title': 'Nilai-nilai Kami',
    'about.values.simplicity': 'Kesederhanaan',
    'about.values.simplicity.desc': 'Interface yang intuitif tanpa mengorbankan fitur',
    'about.values.collaboration': 'Kolaborasi',
    'about.values.collaboration.desc': 'Memfasilitasi kerja sama tim yang efektif',
    'about.values.innovation': 'Inovasi',
    'about.values.innovation.desc': 'Terus berinovasi untuk kebutuhan tim modern',
    
    // Contact
    'contact.title': 'Hubungi Kami',
    'contact.description': 'Punya pertanyaan, saran, atau ingin bekerja sama? Kami senang mendengar dari Anda!',
    'contact.email': 'Email',
    'contact.phone': 'Telepon',
    'contact.address': 'Alamat',
    'contact.form.title': 'Kirim Pesan',
    'contact.form.name': 'Nama',
    'contact.form.email': 'Email',
    'contact.form.subject': 'Subjek',
    'contact.form.message': 'Pesan',
    'contact.form.send': 'Kirim Pesan',
    'contact.form.success': 'Pesan berhasil dikirim! Kami akan segera menghubungi Anda.',
    'contact.types.feedback': 'Kritik & Saran',
    'contact.types.partnership': 'Kerja Sama',
    'contact.types.support': 'Bantuan',
    
    // Stats
    'stats.free': 'Gratis',
    'stats.unlimitedTeams': 'Unlimited Tim',
    'stats.access247': 'Akses Kapan Saja',
    'stats.fast': 'Super Cepat',
    
    // Footer
    'footer.rights': 'Dibuat dengan ❤️ untuk produktivitas tim yang lebih baik.',
    
    // Auth
    'auth.login': 'Masuk',
    'auth.register': 'Daftar',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Nama',
    'auth.role': 'Peran',
    'auth.admin': 'Admin',
    'auth.member': 'Anggota',
    'auth.noAccount': 'Belum punya akun?',
    'auth.hasAccount': 'Sudah punya akun?',
    'auth.loginHere': 'Masuk di sini',
    'auth.registerHere': 'Daftar di sini',
    'auth.welcome': 'Selamat datang di TaskMate',
    'auth.loginDesc': 'Masuk untuk melanjutkan ke dashboard',
    'auth.registerDesc': 'Daftar untuk memulai kolaborasi tim',
    'auth.loginSuccess': 'Login berhasil!',
    'auth.registerSuccess': 'Pendaftaran berhasil!',
    'auth.emailRequired': 'Email diperlukan',
    'auth.passwordRequired': 'Password diperlukan',
    'auth.nameRequired': 'Nama diperlukan',
    
    // Common
    'common.save': 'Simpan',
    'common.cancel': 'Batal',
    'common.delete': 'Hapus',
    'common.edit': 'Edit',
    'common.add': 'Tambah',
    'common.search': 'Cari',
    'common.filter': 'Filter',
    'common.all': 'Semua',
    'common.upload': 'Unggah',
    'common.download': 'Unduh',
    'common.close': 'Tutup',
    'common.confirm': 'Konfirmasi',
    'common.back': 'Kembali',
    'common.next': 'Selanjutnya',
    'common.previous': 'Sebelumnya',
    'common.loading': 'Memuat...',
    'common.noData': 'Tidak ada data',
    
    // Sidebar
    'sidebar.dashboard': 'Dashboard',
    'sidebar.teams': 'Tim',
    'sidebar.projects': 'Proyek',
    'sidebar.tasks': 'Tugas',
    'sidebar.files': 'Berkas',
    'sidebar.profile': 'Profil',
    'sidebar.logout': 'Keluar',
    
    // Dashboard
    'dashboard.welcome': 'Selamat Datang',
    'dashboard.overview': 'Ringkasan',
    'dashboard.totalTasks': 'Total Tugas',
    'dashboard.inProgress': 'Dalam Proses',
    'dashboard.completed': 'Selesai',
    'dashboard.upcoming': 'Mendatang',
    'dashboard.calendar': 'Kalender',
    'dashboard.recentActivity': 'Aktivitas Terbaru',
    
    // Tasks
    'task.status.todo': 'To Do',
    'task.status.inprogress': 'Dalam Proses',
    'task.status.done': 'Selesai',
    'task.priority.high': 'Tinggi',
    'task.priority.medium': 'Sedang',
    'task.priority.low': 'Rendah',
    'task.assignedTo': 'Ditugaskan ke',
    'task.deadline': 'Deadline',
    'task.description': 'Deskripsi',
    'task.comments': 'Komentar',
    'task.addComment': 'Tambah komentar',
    'task.sendComment': 'Kirim',
    
    // Files
    'file.category.document': 'Dokumen',
    'file.category.image': 'Gambar',
    'file.category.video': 'Video',
    'file.category.spreadsheet': 'Spreadsheet',
    'file.category.presentation': 'Presentasi',
    'file.category.other': 'Lainnya',
    'file.status.draft': 'Draft',
    'file.status.needsRevision': 'Perlu Revisi',
    'file.status.approved': 'Disetujui',
    'file.uploadedBy': 'Diunggah oleh',
    'file.uploadDate': 'Tanggal upload',
    'file.detail': 'Detail Berkas',
    'file.changeStatus': 'Ubah Status',
    
    // Profile
    'profile.title': 'Profil',
    'profile.personalInfo': 'Informasi Pribadi',
    'profile.changePassword': 'Ganti Password',
    'profile.notifications': 'Notifikasi',
    'profile.stats': 'Statistik',
    'profile.uploadPhoto': 'Unggah Foto',
    'profile.bio': 'Bio',
    'profile.currentPassword': 'Password Saat Ini',
    'profile.newPassword': 'Password Baru',
    'profile.confirmPassword': 'Konfirmasi Password',
  },
  en: {
    // Landing Page
    'landing.title': 'TaskMate',
    'landing.subtitle': 'Modern Team Collaboration Platform',
    'landing.description': 'TaskMate is a task management and collaboration application specifically designed to help your team organize, monitor, and complete projects more efficiently. With a modern interface and complete features, your team\'s productivity will increase drastically.',
    'landing.getStarted': 'Get Started',
    'landing.login': 'Login',
    'landing.register': 'Register',
    'landing.features': 'Key Features',
    'landing.aboutUs': 'About Us',
    'landing.contact': 'Contact',
    
    // Features
    'feature.taskManagement': 'Task Management',
    'feature.taskManagement.desc': 'Manage tasks with an intuitive and easy-to-use kanban system',
    'feature.teamCollaboration': 'Team Collaboration',
    'feature.teamCollaboration.desc': 'Work together with team members on one centralized platform',
    'feature.calendar': 'Calendar Dashboard',
    'feature.calendar.desc': 'Monitor deadlines and schedules with an interactive calendar',
    'feature.discussion': 'Real-time Discussion',
    'feature.discussion.desc': 'Smooth communication with discussion and comment features',
    'feature.fileManagement': 'File Management',
    'feature.fileManagement.desc': 'Store and manage all project files easily',
    'feature.multiTeam': 'Multi-Team',
    'feature.multiTeam.desc': 'Manage multiple teams and projects in one application',
    
    // About Us
    'about.title': 'About TaskMate',
    'about.description': 'TaskMate was born from the real needs of modern teams that require a simple yet powerful collaboration platform. We believe that productivity doesn\'t have to be complicated.',
    'about.mission.title': 'Our Mission',
    'about.mission.desc': 'Make team collaboration easier, more efficient, and enjoyable with user-friendly technology.',
    'about.vision.title': 'Our Vision',
    'about.vision.desc': 'To become the primary choice platform for project management and team collaboration in Indonesia.',
    'about.values.title': 'Our Values',
    'about.values.simplicity': 'Simplicity',
    'about.values.simplicity.desc': 'Intuitive interface without sacrificing features',
    'about.values.collaboration': 'Collaboration',
    'about.values.collaboration.desc': 'Facilitating effective teamwork',
    'about.values.innovation': 'Innovation',
    'about.values.innovation.desc': 'Continuously innovating for modern team needs',
    
    // Contact
    'contact.title': 'Contact Us',
    'contact.description': 'Have questions, suggestions, or want to collaborate? We\'d love to hear from you!',
    'contact.email': 'Email',
    'contact.phone': 'Phone',
    'contact.address': 'Address',
    'contact.form.title': 'Send Message',
    'contact.form.name': 'Name',
    'contact.form.email': 'Email',
    'contact.form.subject': 'Subject',
    'contact.form.message': 'Message',
    'contact.form.send': 'Send Message',
    'contact.form.success': 'Message sent successfully! We will contact you soon.',
    'contact.types.feedback': 'Feedback & Suggestions',
    'contact.types.partnership': 'Partnership',
    'contact.types.support': 'Support',
    
    // Stats
    'stats.free': 'Free',
    'stats.unlimitedTeams': 'Unlimited Teams',
    'stats.access247': 'Access Anytime',
    'stats.fast': 'Super Fast',
    
    // Footer
    'footer.rights': 'Made with ❤️ for better team productivity.',
    
    // Auth
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Name',
    'auth.role': 'Role',
    'auth.admin': 'Admin',
    'auth.member': 'Member',
    'auth.noAccount': 'Don\'t have an account?',
    'auth.hasAccount': 'Already have an account?',
    'auth.loginHere': 'Login here',
    'auth.registerHere': 'Register here',
    'auth.welcome': 'Welcome to TaskMate',
    'auth.loginDesc': 'Login to continue to dashboard',
    'auth.registerDesc': 'Register to start team collaboration',
    'auth.loginSuccess': 'Login successful!',
    'auth.registerSuccess': 'Registration successful!',
    'auth.emailRequired': 'Email is required',
    'auth.passwordRequired': 'Password is required',
    'auth.nameRequired': 'Name is required',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.all': 'All',
    'common.upload': 'Upload',
    'common.download': 'Download',
    'common.close': 'Close',
    'common.confirm': 'Confirm',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.loading': 'Loading...',
    'common.noData': 'No data',
    
    // Sidebar
    'sidebar.dashboard': 'Dashboard',
    'sidebar.teams': 'Teams',
    'sidebar.projects': 'Projects',
    'sidebar.tasks': 'Tasks',
    'sidebar.files': 'Files',
    'sidebar.profile': 'Profile',
    'sidebar.logout': 'Logout',
    
    // Dashboard
    'dashboard.welcome': 'Welcome',
    'dashboard.overview': 'Overview',
    'dashboard.totalTasks': 'Total Tasks',
    'dashboard.inProgress': 'In Progress',
    'dashboard.completed': 'Completed',
    'dashboard.upcoming': 'Upcoming',
    'dashboard.calendar': 'Calendar',
    'dashboard.recentActivity': 'Recent Activity',
    
    // Tasks
    'task.status.todo': 'To Do',
    'task.status.inprogress': 'In Progress',
    'task.status.done': 'Done',
    'task.priority.high': 'High',
    'task.priority.medium': 'Medium',
    'task.priority.low': 'Low',
    'task.assignedTo': 'Assigned to',
    'task.deadline': 'Deadline',
    'task.description': 'Description',
    'task.comments': 'Comments',
    'task.addComment': 'Add comment',
    'task.sendComment': 'Send',
    
    // Files
    'file.category.document': 'Document',
    'file.category.image': 'Image',
    'file.category.video': 'Video',
    'file.category.spreadsheet': 'Spreadsheet',
    'file.category.presentation': 'Presentation',
    'file.category.other': 'Other',
    'file.status.draft': 'Draft',
    'file.status.needsRevision': 'Needs Revision',
    'file.status.approved': 'Approved',
    'file.uploadedBy': 'Uploaded by',
    'file.uploadDate': 'Upload date',
    'file.detail': 'File Details',
    'file.changeStatus': 'Change Status',
    
    // Profile
    'profile.title': 'Profile',
    'profile.personalInfo': 'Personal Information',
    'profile.changePassword': 'Change Password',
    'profile.notifications': 'Notifications',
    'profile.stats': 'Statistics',
    'profile.uploadPhoto': 'Upload Photo',
    'profile.bio': 'Bio',
    'profile.currentPassword': 'Current Password',
    'profile.newPassword': 'New Password',
    'profile.confirmPassword': 'Confirm Password',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('id');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('taskmate_language') as Language;
    if (savedLanguage && (savedLanguage === 'id' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('taskmate_language', lang);
  };

  const t = (key: string): string => {
    const translation = translations[language] as Record<string, string>;
    return translation[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
