import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  MessageSquare, 
  Bookmark, 
  BookmarkCheck,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Trophy,
  FileText,
  Send,
  Download,
  Eye,
  Star
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const TalentPool = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterField, setFilterField] = useState('all');
  const [filterScore, setFilterScore] = useState('all');
  const [selectedTab, setSelectedTab] = useState('all');
  const [savedProfiles, setSavedProfiles] = useState<string[]>([]);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  // Mock talent data
  const talents = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 234-567-8901',
      location: 'San Francisco, CA',
      profileImage: '',
      field: 'Computer Science',
      degree: 'Bachelor of Science',
      university: 'UC Berkeley',
      graduationYear: '2024',
      gpa: '3.8',
      matchScore: 95,
      skills: ['Python', 'Machine Learning', 'React', 'Node.js'],
      experience: '2 internships at tech companies',
      achievements: ['Dean\'s List', 'Hackathon Winner', 'Research Published'],
      status: 'active',
      lastActive: '2 hours ago'
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.c@email.com',
      phone: '+1 234-567-8902',
      location: 'New York, NY',
      profileImage: '',
      field: 'Business Administration',
      degree: 'MBA',
      university: 'NYU Stern',
      graduationYear: '2023',
      gpa: '3.9',
      matchScore: 88,
      skills: ['Financial Analysis', 'Strategic Planning', 'Leadership', 'Data Analytics'],
      experience: '5 years in consulting',
      achievements: ['Summa Cum Laude', 'Case Competition Winner'],
      status: 'active',
      lastActive: '1 day ago'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily.r@email.com',
      phone: '+1 234-567-8903',
      location: 'Austin, TX',
      profileImage: '',
      field: 'Biomedical Engineering',
      degree: 'Master of Science',
      university: 'UT Austin',
      graduationYear: '2024',
      gpa: '3.7',
      matchScore: 92,
      skills: ['Biotechnology', 'Research', 'Lab Management', 'Data Analysis'],
      experience: '3 research projects',
      achievements: ['Research Grant Recipient', 'Published Author'],
      status: 'active',
      lastActive: '3 hours ago'
    }
  ];

  const filteredTalents = talents.filter(talent => {
    const matchesSearch = talent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         talent.field.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         talent.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesField = filterField === 'all' || talent.field.includes(filterField);
    const matchesScore = filterScore === 'all' || 
                        (filterScore === 'high' && talent.matchScore >= 90) ||
                        (filterScore === 'medium' && talent.matchScore >= 70 && talent.matchScore < 90) ||
                        (filterScore === 'low' && talent.matchScore < 70);
    const matchesTab = selectedTab === 'all' || 
                      (selectedTab === 'saved' && savedProfiles.includes(talent.id));

    return matchesSearch && matchesField && matchesScore && matchesTab;
  });

  const toggleSaveProfile = (talentId: string) => {
    setSavedProfiles(prev => {
      if (prev.includes(talentId)) {
        toast({
          title: "Profile Removed",
          description: "Profile has been removed from saved list.",
        });
        return prev.filter(id => id !== talentId);
      } else {
        toast({
          title: "Profile Saved",
          description: "Profile has been added to saved list.",
        });
        return [...prev, talentId];
      }
    });
  };

  const sendMessage = (values: any) => {
    toast({
      title: "Message Sent",
      description: `Your message has been sent to ${selectedCandidate?.name}.`,
    });
    setMessageDialogOpen(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Talent Pool</h1>
          <p className="text-muted-foreground mt-1">Browse and connect with potential candidates</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export List
          </Button>
          <Button>
            <Search className="mr-2 h-4 w-4" />
            Advanced Search
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="all">All Talents ({talents.length})</TabsTrigger>
          <TabsTrigger value="saved">Saved Profiles ({savedProfiles.length})</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, field, or skills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterField} onValueChange={setFilterField}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Field of Study" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Fields</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Medicine">Medicine</SelectItem>
                    <SelectItem value="Arts">Arts</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterScore} onValueChange={setFilterScore}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Match Score" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Scores</SelectItem>
                    <SelectItem value="high">High (90%+)</SelectItem>
                    <SelectItem value="medium">Medium (70-89%)</SelectItem>
                    <SelectItem value="low">Low (&lt;70%)</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Talent Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredTalents.map((talent) => (
              <Card key={talent.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={talent.profileImage} />
                        <AvatarFallback className="bg-primary/10">
                          {talent.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold">{talent.name}</h3>
                        <p className="text-sm text-muted-foreground">{talent.field}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {talent.degree}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {talent.graduationYear}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(talent.matchScore)}`}>
                        {talent.matchScore}%
                      </div>
                      <p className="text-xs text-muted-foreground">Match Score</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span>{talent.university}</span>
                      <span className="text-muted-foreground">• GPA: {talent.gpa}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{talent.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span>{talent.experience}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-3">
                      {talent.skills.slice(0, 4).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {talent.skills.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{talent.skills.length - 4} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      {talent.achievements.slice(0, 2).map((achievement, index) => (
                        <div key={index} className="flex items-center gap-1">
                          <Trophy className="h-3 w-3 text-yellow-600" />
                          <span className="text-xs text-muted-foreground">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => {
                        setSelectedCandidate(talent);
                        setMessageDialogOpen(true);
                      }}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Message
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="mr-2 h-4 w-4" />
                      View Profile
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleSaveProfile(talent.id)}
                    >
                      {savedProfiles.includes(talent.id) ? (
                        <BookmarkCheck className="h-4 w-4 text-primary" />
                      ) : (
                        <Bookmark className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Message Dialog */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Message to {selectedCandidate?.name}</DialogTitle>
            <DialogDescription>
              Compose your message to reach out to this candidate.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Subject</Label>
              <Input placeholder="Enter message subject..." />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea 
                placeholder="Type your message here..." 
                rows={6}
              />
            </div>
            <div className="flex justify-between">
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Use Template
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setMessageDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => sendMessage({})}>
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TalentPool;