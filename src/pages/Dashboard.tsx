import React from 'react';
import { FileText, Building2, BookOpen, Users, TrendingUp, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Universities',
      value: '24',
      change: '+3 this month',
      icon: Building2,
      color: 'text-primary',
      bgColor: 'bg-primary-light',
    },
    {
      title: 'Active Courses',
      value: '156',
      change: '+12 this week',
      icon: BookOpen,
      color: 'text-secondary',
      bgColor: 'bg-secondary-light',
    },
    {
      title: 'Form Templates',
      value: '18',
      change: '5 customized',
      icon: FileText,
      color: 'text-success',
      bgColor: 'bg-success-light',
    },
    {
      title: 'Total Applications',
      value: '2,847',
      change: '+234 this month',
      icon: Users,
      color: 'text-warning',
      bgColor: 'bg-warning-light',
    },
  ];

  const recentActivity = [
    { id: 1, action: 'New form created', university: 'Oxford University', time: '2 hours ago' },
    { id: 2, action: 'Course added', university: 'MIT', time: '4 hours ago' },
    { id: 3, action: 'Form updated', university: 'Stanford University', time: '6 hours ago' },
    { id: 4, action: 'University onboarded', university: 'Harvard University', time: '1 day ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome to ACADO Admin Portal</h1>
        <p className="text-muted-foreground mt-1">
          Manage university applications and admissions efficiently
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-6 hover-lift">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </div>
              <div className={cn("p-3 rounded-lg", stat.bgColor)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <Clock className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.university}</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Quick Actions</h2>
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            <button className="w-full p-4 text-left rounded-lg bg-gradient-subtle hover:shadow-md transition-all">
              <p className="font-medium">Create New Form</p>
              <p className="text-xs text-muted-foreground mt-1">
                Configure a new application form template
              </p>
            </button>
            <button className="w-full p-4 text-left rounded-lg bg-gradient-subtle hover:shadow-md transition-all">
              <p className="font-medium">Add University</p>
              <p className="text-xs text-muted-foreground mt-1">
                Onboard a new educational institution
              </p>
            </button>
            <button className="w-full p-4 text-left rounded-lg bg-gradient-subtle hover:shadow-md transition-all">
              <p className="font-medium">Manage Courses</p>
              <p className="text-xs text-muted-foreground mt-1">
                Add or update course offerings
              </p>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export default Dashboard;