import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Globe } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { University } from '@/types/application';

const Universities = () => {
  const [universities] = useState<University[]>([
    {
      id: '1',
      name: 'Oxford University',
      country: 'United Kingdom',
      website: 'https://ox.ac.uk',
      description: 'World-renowned research university',
      createdAt: new Date(),
    },
    {
      id: '2',
      name: 'MIT',
      country: 'United States',
      website: 'https://mit.edu',
      description: 'Leading technology institute',
      createdAt: new Date(),
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Universities</h1>
          <p className="text-muted-foreground mt-1">Manage partner universities</p>
        </div>
        <Button variant="gradient" className="gap-2">
          <Plus className="w-4 h-4" />
          Add University
        </Button>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search universities..." className="pl-10" />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {universities.map((uni) => (
          <Card key={uni.id} className="p-6 hover-lift">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">
                    {uni.name.charAt(0)}
                  </span>
                </div>
                <Badge variant="secondary">{uni.country}</Badge>
              </div>
              <div>
                <h3 className="font-semibold text-lg">{uni.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{uni.description}</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Globe className="w-3 h-3" />
                <a href={uni.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                  {uni.website}
                </a>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="text-destructive">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Universities;