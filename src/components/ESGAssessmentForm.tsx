import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { ESGFramework, ESGResponse, ESGField, Business } from '@/types/esg';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { lambdaService } from '@/services/lambdaService';

interface ESGAssessmentFormProps {
  framework: ESGFramework;
  business: Business;
  onComplete: (responses: ESGResponse[], lambdaResponse?: any) => void;
  onBack?: () => void;
}

export const ESGAssessmentForm: React.FC<ESGAssessmentFormProps> = ({
  framework,
  business,
  onComplete,
  onBack
}) => {
  const { toast } = useToast();
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentCriterionIndex, setCurrentCriterionIndex] = useState(0);
  const [responses, setResponses] = useState<ESGResponse[]>([]);
  const [fieldResponses, setFieldResponses] = useState<{ [fieldId: string]: string | number | boolean }>({});
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentCategory = framework.categories[currentCategoryIndex];
  const currentCriterion = currentCategory.criteria[currentCriterionIndex];
  const totalCriteria = framework.categories.reduce((sum, cat) => sum + cat.criteria.length, 0);
  const completedCriteria = responses.length;
  const progress = (completedCriteria / totalCriteria) * 100;

  // Reset form fields when changing categories or criteria
  useEffect(() => {
    setFieldResponses({});
    setNotes('');
  }, [currentCategoryIndex, currentCriterionIndex]);

  const handleResponseSubmit = async (fieldResponses: { [fieldId: string]: string | number | boolean }, notes: string) => {
    // AI-generated compliance score based on field responses (mock implementation)
    const completionRate = Object.keys(fieldResponses).length / currentCriterion.fields.filter(f => f.required).length;
    const baseScore = completionRate * 80; // Base score from completion
    const bonusScore = Math.floor(Math.random() * 20); // Random bonus for demo
    const aiGeneratedScore = Math.min(100, baseScore + bonusScore);
    
    const response: ESGResponse = {
      criterionId: currentCriterion.id,
      score: aiGeneratedScore,
      fieldResponses,
      documents: [], // In real implementation, handle file uploads
      notes
    };

    const updatedResponses = [...responses, response];
    setResponses(updatedResponses);

    // Move to next criterion or category
    if (currentCriterionIndex < currentCategory.criteria.length - 1) {
      setCurrentCriterionIndex(prev => prev + 1);
    } else if (currentCategoryIndex < framework.categories.length - 1) {
      setCurrentCategoryIndex(prev => prev + 1);
      setCurrentCriterionIndex(0);
    } else {
      // Assessment complete - submit to AWS Lambda
      setIsSubmitting(true);
      
      try {
        toast({
          title: "Processing Assessment",
          description: "Sending data to AWS Lambda for AI analysis...",
        });

        const lambdaResponse = await lambdaService.submitESGAssessment({
          business,
          responses: updatedResponses,
          framework: framework.name
        });

        toast({
          title: "Assessment Completed Successfully!",
          description: "Redirecting to home page...",
        });

        // Navigate back to home page after successful submission
        setTimeout(() => {
          onComplete(updatedResponses, lambdaResponse);
        }, 1500);
      } catch (error) {
        console.error('Lambda submission error:', error);
        toast({
          title: "Assessment Completed",
          description: "Assessment saved locally. AWS Lambda integration needs configuration.",
          variant: "destructive"
        });
        onComplete(updatedResponses);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleFieldChange = (fieldId: string, value: string | number | boolean) => {
    setFieldResponses(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const renderField = (field: ESGField) => {
    const value = fieldResponses[field.id] || '';

    switch (field.type) {
      case 'text':
        return (
          <Input
            id={field.id}
            placeholder={field.placeholder}
            value={value as string}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className="w-full"
          />
        );
      
      case 'number':
        return (
          <div className="flex items-center gap-2">
            <Input
              id={field.id}
              type="number"
              placeholder={field.placeholder}
              value={value as number || ''}
              onChange={(e) => handleFieldChange(field.id, parseFloat(e.target.value) || 0)}
              className="flex-1"
            />
            {field.unit && <span className="text-sm text-muted-foreground">{field.unit}</span>}
          </div>
        );
      
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              id={field.id}
              checked={value as boolean}
              onCheckedChange={(checked) => handleFieldChange(field.id, checked)}
            />
            <Label htmlFor={field.id} className="text-sm">
              {value ? 'Yes' : 'No'}
            </Label>
          </div>
        );
      
      case 'select':
        return (
          <Select value={value as string} onValueChange={(val) => handleFieldChange(field.id, val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'multiselect':
        const selectedValues = (value as string || '').split(',').filter(v => v);
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.id}-${option}`}
                  checked={selectedValues.includes(option)}
                  onCheckedChange={(checked) => {
                    let newValues = [...selectedValues];
                    if (checked) {
                      if (!newValues.includes(option)) {
                        newValues.push(option);
                      }
                    } else {
                      newValues = newValues.filter(v => v !== option);
                    }
                    handleFieldChange(field.id, newValues.join(','));
                  }}
                />
                <Label htmlFor={`${field.id}-${option}`} className="text-sm">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );
      
      case 'textarea':
        return (
          <Textarea
            id={field.id}
            placeholder={field.placeholder}
            value={value as string}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className="min-h-20"
          />
        );
      
      default:
        return null;
    }
  };

  const isFormValid = () => {
    const requiredFields = currentCriterion.fields.filter(field => field.required);
    return requiredFields.every(field => {
      const value = fieldResponses[field.id];
      if (field.type === 'boolean') return value !== undefined;
      return value !== undefined && value !== '' && value !== null;
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card className="shadow-soft">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-primary">
                ESG Assessment
              </h2>
              <Badge variant="outline" className="text-sm">
                {completedCriteria} / {totalCriteria} completed
              </Badge>
            </div>
            <Progress value={progress} className="h-2 bg-muted" />
            <div className="text-center">
              <div className="text-lg font-semibold text-primary mb-1 bg-primary/10 rounded-lg px-4 py-2">
                Category: {currentCategory.name}
              </div>
              <div className="text-sm text-muted-foreground">
                Criterion {currentCriterionIndex + 1} of {currentCategory.criteria.length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Criterion */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="text-lg text-primary">
            {currentCriterion.title}
          </CardTitle>
          <p className="text-muted-foreground">
            {currentCriterion.description}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Benchmark Information */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div>
              <h4 className="font-medium text-foreground mb-1">Benchmark Standard</h4>
              <p className="text-sm text-muted-foreground">{currentCriterion.benchmark}</p>
            </div>
          </div>

          {/* Assessment Fields */}
          <div className="space-y-6">
            {currentCriterion.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id} className="text-sm font-medium">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </Label>
                {renderField(field)}
              </div>
            ))}
          </div>

          {/* Notes Input */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Additional Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Any additional context, challenges, or planned improvements..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-16"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={onBack}
              disabled={!onBack}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={() => handleResponseSubmit(fieldResponses, notes)}
              disabled={!isFormValid() || isSubmitting}
              className="bg-primary hover:bg-primary-light"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : completedCriteria === totalCriteria - 1 ? (
                <>
                  Complete Assessment
                  <CheckCircle className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Next Criterion
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Scoring Guidelines */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-base text-primary">Scoring Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {currentCriterion.scoringGuideline}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};