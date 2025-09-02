import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, FileText, Building2, BookOpen, Settings, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AcadoLogo } from '@/components/AcadoLogo';

const Layout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Master Fields', href: '/master-fields', icon: FileText },
    { name: 'Application Forms', href: '/forms', icon: Settings },
    { name: 'Universities', href: '/universities', icon: Building2 },
    { name: 'Courses', href: '/courses', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-3">
              <AcadoLogo className="h-8 w-auto" />
              <div className="h-8 w-px bg-border" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Application Configurator</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium px-3 py-1.5 bg-primary/10 text-primary rounded-full">
              Admin Portal
            </span>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-[65px] bottom-0 z-40 w-64 bg-card border-r border-border transition-transform duration-200",
          !sidebarOpen && "-translate-x-full"
        )}
      >
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || 
                           (item.href === '/forms' && location.pathname.startsWith('/forms')) ||
                           (item.href === '/universities' && location.pathname.startsWith('/universities'));
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover"
                    : "hover:bg-accent text-foreground"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 transition-transform",
                  !isActive && "group-hover:scale-110"
                )} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        {/* Footer Branding */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
            <p className="text-xs font-medium text-muted-foreground mb-1">Powered by</p>
            <AcadoLogo className="h-6 w-auto" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          "pt-[65px] transition-all duration-200 min-h-screen",
          sidebarOpen ? "pl-64" : "pl-0"
        )}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;