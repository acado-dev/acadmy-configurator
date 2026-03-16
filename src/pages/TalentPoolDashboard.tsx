import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserCheck, 
  Target, 
  FileText, 
  Award, 
  TrendingUp,
  Upload,
  Download,
  Search,
  Filter,
  Plus,
  Mail,
  CheckCircle2,
  Clock,
  Star
} from 'lucide-react';
import { useTalentPool } from '@/hooks/useTalentPool';

const TalentPoolDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { stats, loading } = useTalentPool();
  
  // Detect if we're in university context to use correct base path
  const basePath = location.pathname.startsWith('/university') ? '/university/talent-pool' : '/talent-pool';

  const metrics = [
    {
      title: 'Total Candidates in Pool',
      value: stats.totalCandidates,
      icon: Users,
      description: 'All registered student profiles',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: '+12% from last month',
      onClick: () => navigate(`${basePath}/candidates`),
    },
    {
      title: 'Verified Profiles',
      value: stats.verifiedProfiles,
      icon: CheckCircle2,
      description: 'Documents reviewed and verified',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: '+8% from last month',
      onClick: () => navigate(`${basePath}/candidates?filter=verified`),
    },
    {
      title: 'Shortlisted for Programs',
      value: stats.shortlistedForPrograms,
      icon: Target,
      description: 'Students matched and assigned',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: '+15% from last month',
      onClick: () => navigate(`${basePath}/candidates?filter=shortlisted`),
    },
    {
      title: 'Applicants in Progress',
      value: stats.applicantsInProgress,
      icon: Clock,
      description: 'Students currently applying',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      trend: '+5% from last month',
      onClick: () => navigate(`${basePath}/candidates?filter=in-progress`),
    },
    {
      title: 'Accepted / Offer Received',
      value: stats.acceptedOfferReceived,
      icon: Award,
      description: 'Students with admission letters',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      trend: '+20% from last month',
      onClick: () => navigate(`${basePath}/candidates?filter=accepted`),
    },
    {
      title: 'Scholarship Eligible',
      value: stats.scholarshipEligible,
      icon: Star,
      description: 'AI-identified high-potential',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      trend: '+10% from last month',
      onClick: () => navigate(`${basePath}/candidates?filter=scholarship`),
    },
  ];

  const quickActions = [
    {
      label: 'Add Candidate',
      icon: Plus,
      description: 'Manually add a new student profile',
      variant: 'default' as const,
      onClick: () => navigate(`${basePath}/add`),
    },
    {
      label: 'Bulk Upload',
      icon: Upload,
      description: 'Import candidates via CSV',
      variant: 'outline' as const,
      onClick: () => navigate('/talent-pool/bulk-upload'),
    },
    {
      label: 'Upload Documents',
      icon: FileText,
      description: 'Parse CV/Resume/Records',
      variant: 'outline' as const,
      onClick: () => navigate('/talent-pool/document-upload'),
    },
    {
      label: 'Smart Search',
      icon: Search,
      description: 'Find candidates with filters',
      variant: 'outline' as const,
      onClick: () => navigate('/talent-pool/candidates?search=true'),
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'new_candidate',
      message: 'Priya Sharma added to talent pool',
      timestamp: '2 hours ago',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      id: 2,
      type: 'offer_received',
      message: 'Vikram Mehta received offer from University of Helsinki',
      timestamp: '4 hours ago',
      icon: Award,
      color: 'text-emerald-600',
    },
    {
      id: 3,
      type: 'verified',
      message: 'Ananya Singh profile verified',
      timestamp: '6 hours ago',
      icon: CheckCircle2,
      color: 'text-green-600',
    },
    {
      id: 4,
      type: 'shortlisted',
      message: '3 candidates shortlisted for MSc Data Science',
      timestamp: '1 day ago',
      icon: Target,
      color: 'text-purple-600',
    },
    {
      id: 5,
      type: 'email_sent',
      message: 'Application reminder sent to 15 candidates',
      timestamp: '1 day ago',
      icon: Mail,
      color: 'text-orange-600',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading talent pool data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Talent Pool Overview</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track student candidates for study abroad programs
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/talent-pool/export')}>
            <Download className="mr-2 h-4 w-4" />
            Export Reports
          </Button>
          <Button onClick={() => navigate('/talent-pool/candidates')}>
            <Users className="mr-2 h-4 w-4" />
            View All Candidates
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card 
              key={index}
              className="hover:shadow-lg transition-all cursor-pointer border-l-4"
              style={{ borderLeftColor: metric.color.replace('text-', '') }}
              onClick={metric.onClick}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground font-medium">
                      {metric.title}
                    </p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <h3 className="text-3xl font-bold text-foreground">
                        {metric.value}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {metric.trend}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {metric.description}
                    </p>
                  </div>
                  <div className={`${metric.bgColor} p-3 rounded-lg`}>
                    <Icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Add candidates and manage talent pool
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Card
                      key={index}
                      className="hover:shadow-md transition-all cursor-pointer border-2 hover:border-primary"
                      onClick={action.onClick}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">{action.label}</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {action.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest updates in talent pool</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <Icon className={`h-4 w-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground font-medium">
                        {activity.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pipeline Summary</CardTitle>
              <CardDescription>Application stage distribution</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter by Stage
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { stage: 'Lead', count: 12, color: 'bg-gray-500' },
              { stage: 'Counseling Done', count: 8, color: 'bg-blue-500' },
              { stage: 'Documents Submitted', count: 15, color: 'bg-purple-500' },
              { stage: 'Applied', count: 10, color: 'bg-orange-500' },
              { stage: 'Offer Received', count: 5, color: 'bg-green-500' },
              { stage: 'Visa Stage', count: 3, color: 'bg-yellow-500' },
              { stage: 'Enrolled', count: 2, color: 'bg-emerald-500' },
            ].map((item) => (
              <div key={item.stage} className="text-center">
                <div className={`${item.color} h-24 rounded-lg flex items-center justify-center mb-2`}>
                  <span className="text-3xl font-bold text-white">{item.count}</span>
                </div>
                <p className="text-xs font-medium text-muted-foreground">{item.stage}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TalentPoolDashboard;
