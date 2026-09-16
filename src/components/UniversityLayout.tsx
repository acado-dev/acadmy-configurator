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
  FormInput,
  Mail,
  UserSearch,
  ClipboardList,
  MessagesSquare,
  FileCheck,
  BarChart,
  Info,
  UserPlus,
  Megaphone,
  Video
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

const UniversityLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['university-setup']);
  
  // Mock university data - in production, fetch from auth context
  const universityData = {
    name: "Stanford University",
    logo: "/stanford-logo.png",
    adminEmail: "admin@stanford.edu",
    pendingApplications: 12
  };

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("universityAuth");
    localStorage.removeItem("universityAdmin");
    navigate("/university/login");
  };

  const menuItems = [
    {
      id: 'university-setup',
      label: 'University Setup',
      icon: Building2,
      subItems: [
        { label: 'Dashboard', path: '/university/dashboard', icon: LayoutDashboard },
        { label: 'University Info', path: '/university/info', icon: Info },
        { label: 'Users', path: '/university/users', icon: UserPlus },
        { label: 'Courses', path: '/university/courses', icon: BookOpen },
      ]
    },
    {
      id: 'engagement',
      label: 'Engagement',
      icon: Megaphone,
      subItems: [
        { label: 'Content', path: '/university/content', icon: FileText },
        { label: 'Communication Templates', path: '/university/communication/templates', icon: Mail },
        { label: 'Inbox', path: '/university/inbox', icon: MessagesSquare },
        { label: 'Events', path: '/university/events', icon: GraduationCap },
      ]
    },
    {
      id: 'talent-pool',
      label: 'Talent Pool',
      icon: Users,
      subItems: [
        { label: 'Dashboard', path: '/university/talent-pool', icon: LayoutDashboard },
        { label: 'Candidates', path: '/university/talent-pool/candidates', icon: UserSearch },
        { label: 'Saved Profiles', path: '/university/saved-profiles', icon: User },
        { label: 'Communications', path: '/university/talent-communications', icon: MessagesSquare },
      ]
    },
    {
      id: 'form-configuration',
      label: 'Form Configuration',
      icon: FormInput,
      subItems: [
        { label: 'Application Forms', path: '/university/forms', icon: FormInput },
        { label: 'Evaluation Criteria', path: '/university/application-process-list', icon: Settings },
        { label: 'Selection Process', path: '/university/process-steps', icon: FileCheck },
        { label: 'Assessment', path: '/university/assessments', icon: ClipboardList },
        { label: 'Assignment', path: '/university/assignments', icon: FileText },
        { label: 'Interview', path: '/university/interviews', icon: Video },
      ]
    },
    {
      id: 'applications',
      label: 'Applications',
      icon: ClipboardList,
      badge: universityData.pendingApplications,
      subItems: [
        { label: 'Applications Overview', path: '/university/applications-overview', icon: BarChart },
        { label: 'Collected Applications', path: '/university/applications', icon: FileText, badge: universityData.pendingApplications },
        { label: 'Document Requests', path: '/university/applications/document-requests', icon: FileText },
        { label: 'Acceptance Letters', path: '/university/applications', icon: Mail },
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart,
      subItems: [
        { label: 'Dashboard', path: '/university/analytics', icon: BarChart },
        { label: 'Reports', path: '/university/reports', icon: FileText },
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      subItems: [
        { label: 'Profile', path: '/university/profile', icon: User },
        { label: 'Preferences', path: '/university/preferences', icon: Settings },
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
          {/* ACADO Logo */}
          <div className="mb-4">
            <AcadoLogo className="h-8" />
          </div>

          {/* University Info */}
          <div className="mb-6 p-3 bg-accent/50 rounded-lg">
            <div className="flex items-center gap-3">
              {universityData.logo ? (
                <img 
                  src={universityData.logo} 
                  alt={universityData.name}
                  className="h-10 w-10 rounded object-contain"
                />
              ) : (
                <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{universityData.name}</p>
                <p className="text-xs text-muted-foreground">University Admin</p>
              </div>
            </div>
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
                        {item.badge && (
                          <Badge variant="destructive" className="ml-auto">
                            {item.badge}
                          </Badge>
                        )}
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
                        {subItem.badge && (
                          <Badge variant="destructive" className="ml-auto">
                            {subItem.badge}
                          </Badge>
                        )}
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
            <div className="flex items-center gap-2">
              <AcadoLogo className="h-6" />
              <span className="text-sm text-muted-foreground">|</span>
              <h1 className="text-lg font-semibold text-foreground">
                {universityData.name}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-xs">
              Admin Portal
            </Badge>
            <span className="text-sm text-muted-foreground">
              {universityData.adminEmail}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {universityData.adminEmail.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>University Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/university/profile")} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/university/info")} className="cursor-pointer">
                  <Building2 className="mr-2 h-4 w-4" />
                  University Info
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/university/preferences")} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Preferences
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
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

export default UniversityLayout;