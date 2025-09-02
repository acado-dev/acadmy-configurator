import React, { useState } from 'react';
import { 
  Search, Filter, ChevronRight, ChevronDown, Plus,
  User, GraduationCap, Briefcase, Lightbulb, Award,
  FileText, PenTool, Users, DollarSign, Settings
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { masterCategories, masterFields } from '@/data/masterFields';
import { FieldCategory, ApplicationField } from '@/types/application';

const MasterFields = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const iconMap: Record<string, React.ComponentType<any>> = {
    User,
    GraduationCap,
    Briefcase,
    Lightbulb,
    Award,
    FileText,
    PenTool,
    Users,
    DollarSign,
    Settings
  };

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const filteredFields = masterFields.filter(field => {
    const matchesSearch = field.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          field.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || field.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getFieldsByCategory = (categoryId: string, subcategoryId?: string) => {
    return filteredFields.filter(field => 
      field.categoryId === categoryId && 
      (!subcategoryId || field.subcategoryId === subcategoryId)
    );
  };

  const getFieldTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      text: 'bg-blue-100 text-blue-700',
      email: 'bg-green-100 text-green-700',
      tel: 'bg-purple-100 text-purple-700',
      number: 'bg-yellow-100 text-yellow-700',
      date: 'bg-pink-100 text-pink-700',
      select: 'bg-indigo-100 text-indigo-700',
      textarea: 'bg-orange-100 text-orange-700',
      file: 'bg-red-100 text-red-700',
      checkbox: 'bg-teal-100 text-teal-700',
      country: 'bg-cyan-100 text-cyan-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Master Fields Database</h1>
          <p className="text-muted-foreground mt-1">
            Complete list of all available application form fields
          </p>
        </div>
        <Button variant="gradient" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Custom Field
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <Card className="p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search fields by name or label..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>
      </Card>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Category List */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <h2 className="font-semibold mb-4">Categories</h2>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg transition-colors",
                  !selectedCategory ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                )}
              >
                All Categories ({masterFields.length} fields)
              </button>
              {masterCategories.map((category) => {
                const Icon = iconMap[category.icon] || FileText;
                const fieldCount = masterFields.filter(f => f.categoryId === category.id).length;
                
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2",
                      selectedCategory === category.id ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="flex-1">{category.name}</span>
                    <span className="text-xs opacity-70">{fieldCount}</span>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Fields List */}
        <div className="lg:col-span-2 space-y-4">
          {masterCategories
            .filter(cat => !selectedCategory || cat.id === selectedCategory)
            .map((category) => {
              const Icon = iconMap[category.icon] || FileText;
              const categoryFields = getFieldsByCategory(category.id);
              const isExpanded = expandedCategories.has(category.id);
              
              if (categoryFields.length === 0 && searchTerm) return null;
              
              return (
                <Card key={category.id} className="overflow-hidden">
                  <div 
                    className="p-4 bg-gradient-subtle cursor-pointer hover:bg-accent/10 transition-colors"
                    onClick={() => toggleCategory(category.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-background">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{category.name}</h3>
                          <p className="text-xs text-muted-foreground">{category.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{categoryFields.length} fields</Badge>
                        {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="p-4 space-y-3">
                      {category.subcategories ? (
                        category.subcategories.map((subcat) => {
                          const subcatFields = getFieldsByCategory(category.id, subcat.id);
                          if (subcatFields.length === 0) return null;
                          
                          return (
                            <div key={subcat.id} className="space-y-2">
                              <h4 className="text-sm font-medium text-muted-foreground px-2">
                                {subcat.name}
                              </h4>
                              <div className="space-y-2">
                                {subcatFields.map((field) => (
                                  <div
                                    key={field.id}
                                    className="flex items-center justify-between p-3 rounded-lg bg-background-secondary hover:shadow-sm transition-all"
                                  >
                                    <div>
                                      <p className="font-medium text-sm">{field.label}</p>
                                      <p className="text-xs text-muted-foreground">Field name: {field.name}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {field.required && (
                                        <Badge variant="destructive" className="text-xs">Required</Badge>
                                      )}
                                      <Badge className={getFieldTypeColor(field.type)}>
                                        {field.type}
                                      </Badge>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="space-y-2">
                          {categoryFields.map((field) => (
                            <div
                              key={field.id}
                              className="flex items-center justify-between p-3 rounded-lg bg-background-secondary hover:shadow-sm transition-all"
                            >
                              <div>
                                <p className="font-medium text-sm">{field.label}</p>
                                <p className="text-xs text-muted-foreground">Field name: {field.name}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                {field.required && (
                                  <Badge variant="destructive" className="text-xs">Required</Badge>
                                )}
                                <Badge className={getFieldTypeColor(field.type)}>
                                  {field.type}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
        </div>
      </div>
    </div>
  );
};

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export default MasterFields;