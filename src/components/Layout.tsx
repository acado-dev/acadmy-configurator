import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Building2, 
  BookOpen, 
  Settings, 
  Menu, 
  X, 
  LogOut, 
  User,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  Users,
  LayoutDashboard,
  Target,
  Library,
  Hash,
  Globe,
  Rss,
  Calendar,
  Heart,
  Gift,
  Briefcase,
  UserCheck,
  BarChart,
  FileBarChart,
  UserSearch,
  Search,
  FormInput,
  Cog,
  Mail,
  FileCode,
  Eye,
  Award
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AcadoLogo } from '@/components/AcadoLogo';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userEmail, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['university-setup']);

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const menuItems = [
    {
      id: 'university-setup',
      label: 'University Setup',
      icon: Building2,
      subItems: [
        { label: 'Dashboard', path: '/', icon: LayoutDashboard },
        { label: 'Universities', path: '/universities', icon: Building2 },
        { label: 'Users', path: '/users', icon: Users },
      ]
    },
    {
      id: 'course',
      label: 'Course',
      icon: GraduationCap,
      subItems: [
        { label: 'Course Category', path: '/course-category', icon: Hash },
        { label: 'Course Level', path: '/course-level', icon: LayoutDashboard },
        { label: 'Course Type', path: '/course-type', icon: Award },
        { label: 'Learning Outcome', path: '/learning-outcome', icon: Target },
        { label: 'Courses', path: '/courses', icon: BookOpen },
      ]
    },
    {
      id: 'engagement-builder',
      label: 'Engagement Builder',
      icon: Globe,
      subItems: [
        { label: 'Wall', path: '/wall', icon: FileText },
        { label: 'Communities', path: '/communities', icon: Users },
        { label: 'Reels', path: '/reels', icon: Rss },
        { label: 'Events', path: '/events', icon: Calendar },
        { label: 'Scholarships', path: '/scholarships', icon: Gift },
      ]
    },
    {
      id: 'talent-management',
      label: 'Talent Management',
      icon: Briefcase,
      subItems: [
        { label: 'Dashboard', path: '/talent-pool', icon: LayoutDashboard },
        { label: 'Candidates', path: '/talent-pool/candidates', icon: UserCheck },
      ]
    },
    {
      id: 'reports-analytics',
      label: 'Reports/Analytics',
      icon: BarChart,
      subItems: [
        { label: 'Analytics', path: '/analytics', icon: BarChart },
        { label: 'Reports', path: '/reports', icon: FileBarChart },
        { label: 'Interested Users', path: '/interested-users', icon: UserSearch },
        { label: 'User Search', path: '/user-search', icon: Search },
      ]
    },
    {
      id: 'applications',
      label: 'Applications',
      icon: Users,
      subItems: [
        { label: 'Application Overview', path: '/applications-overview', icon: Eye },
        { label: 'Collected Applications', path: '/applications', icon: Users },
        { label: 'Selection Process', path: '/applications/selection-process', icon: Target },
        { label: 'Acceptance Letters', path: '/applications/acceptance-letters', icon: Award },
      ]
    },
    {
      id: 'form-builder',
      label: 'Form Builder',
      icon: FormInput,
      subItems: [
        { label: 'Master Fields', path: '/master-fields', icon: FileText },
        { label: 'Application Form', path: '/forms', icon: FormInput },
        { label: 'Applications', path: '/form-applications', icon: Users },
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      subItems: [
        { label: 'Configuration', path: '/configuration', icon: Cog },
        { label: 'Bulk Email', path: '/bulk-email', icon: Mail },
        { label: 'Mail Template', path: '/mail-template', icon: FileCode },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 bottom-0 bg-card border-r border-border transition-all duration-300 z-50 overflow-y-auto",
        isSidebarOpen ? "w-64" : "w-0"
      )}>
        <div className={cn("p-4", !isSidebarOpen && "hidden")}>
          {/* Logo */}
          <div className="mb-8">
            <AcadoLogo className="h-8" />
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <div key={item.id} className="mb-1">
                <Collapsible
                  open={expandedMenus.includes(item.id)}
                  onOpenChange={() => toggleMenu(item.id)}
                >
                  <CollapsibleTrigger className="w-full">
                    <div className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground cursor-pointer",
                      expandedMenus.includes(item.id) && "bg-accent/50"
                    )}>
                      <div className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </div>
                      {expandedMenus.includes(item.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-1 ml-4 space-y-1">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all hover:bg-accent hover:text-accent-foreground",
                          location.pathname === subItem.path && "bg-primary text-primary-foreground hover:bg-primary-hover hover:text-primary-foreground"
                        )}
                      >
                        <subItem.icon className="h-4 w-4" />
                        <span>{subItem.label}</span>
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300",
        isSidebarOpen ? "ml-64" : "ml-0"
      )}>
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-xl font-bold text-foreground">
              ACADO Admin Portal
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {userEmail || "admin@acado.ai"}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {(userEmail || "admin@acado.ai").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;