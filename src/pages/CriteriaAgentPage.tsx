import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useApplicationProcess } from '@/hooks/useApplicationProcess';
import { useFormsData } from '@/hooks/useFormsData';
import { masterFields } from '@/data/masterFields';
import { CriteriaAgent } from '@/components/criteria/CriteriaAgent';

const CriteriaAgentPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { saveCriteriaConfig, getCriteriaByCoursId } = useApplicationProcess();
  const { courses, forms } = useFormsData();

  const course = courses.find(c => c.id === courseId);
  const courseForm = forms.find(f => course?.applicationFormId === f.id);
  const existing = courseId ? getCriteriaByCoursId(courseId) : undefined;

  const fieldNameOptions = useMemo(() => {
    const fields = courseForm && courseForm.fields.length > 0 ? courseForm.fields : masterFields;
    return Array.from(new Set(fields.map(f => f.label)));
  }, [courseForm]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" className="mb-2 -ml-2" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to evaluation criteria
          </Button>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            AI Criteria Assistant
          </h1>
          <p className="text-muted-foreground mt-2">
            Describe your admission requirements in plain English and review the interpreted rubric before saving.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Context</CardTitle>
          <CardDescription>The rubric is saved against this course.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Course:</span>
            <span className="font-medium">{course?.name || 'Unknown course'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Application Form:</span>
            <span className="font-medium">{courseForm?.name || 'No form assigned'}</span>
          </div>
        </CardContent>
      </Card>

      <CriteriaAgent
        context={`Course: ${course?.name ?? 'Unknown'}${courseForm ? `, application form: ${courseForm.name}` : ''}`}
        availableFields={fieldNameOptions}
        existingCriteria={(existing?.criteria ?? []).map(c => ({ ...c }))}
        existingMinimumScore={existing?.minimumScore ?? 70}
        onApply={(agentCriteria, score) => {
          if (!courseId) return;
          saveCriteriaConfig(
            courseId,
            score,
            agentCriteria.map(c => ({
              id: c.id,
              fieldName: c.fieldName,
              type: c.type,
              weight: c.weight,
              conditions: c.conditions,
            })),
          );
          toast({
            title: 'Evaluation criteria saved',
            description: 'The rubric has been applied to this course.',
          });
          navigate(-1);
        }}
      />
    </div>
  );
};

export default CriteriaAgentPage;
