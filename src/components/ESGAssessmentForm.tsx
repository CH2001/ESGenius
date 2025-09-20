import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { FileText, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { ESGFramework, ESGResponse } from '@/types/esg';
import { useToast } from '@/hooks/use-toast';

interface ESGAssessmentFormProps {
  framework: ESGFramework;
  onComplete: (responses: ESGResponse[]) => void;
  onBack?: () => void;
}

export const ESGAssessmentForm: React.FC<ESGAssessmentFormProps> = ({
  framework,
  onComplete,
  onBack
}) => {
  const { toast } = useToast();
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentCriterionIndex, setCurrentCriterionIndex] = useState(0);
  const [responses, setResponses] = useState<ESGResponse[]>([]);

  const currentCategory = framework.categories[currentCategoryIndex];
  const currentCriterion = currentCategory.criteria[currentCriterionIndex];
  const totalCriteria = framework.categories.reduce((sum, cat) => sum + cat.criteria.length, 0);
  const completedCriteria = responses.length;
  const progress = (completedCriteria / totalCriteria) * 100;

  const handleResponseSubmit = (score: number, evidence: string, notes: string) => {
    const response: ESGResponse = {
      criterionId: currentCriterion.id,
      score,
      evidence,
      documents: [], // In real implementation, handle file uploads
      notes
    };

    setResponses(prev => [...prev, response]);

    // Move to next criterion or category
    if (currentCriterionIndex < currentCategory.criteria.length - 1) {
      setCurrentCriterionIndex(prev => prev + 1);
    } else if (currentCategoryIndex < framework.categories.length - 1) {
      setCurrentCategoryIndex(prev => prev + 1);
      setCurrentCriterionIndex(0);
    } else {
      // Assessment complete
      toast({
        title: "Assessment Completed Successfully!",
        description: "Your ESG assessment has been submitted and is being processed.",
      });
      onComplete([...responses, response]);
    }
  };

  const [currentScore, setCurrentScore] = useState([50]);
  const [evidence, setEvidence] = useState('');
  const [notes, setNotes] = useState('');

  // Reset form fields when changing categories
  useEffect(() => {
    setCurrentScore([50]);
    setEvidence('');
    setNotes('');
  }, [currentCategoryIndex]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card className="shadow-soft">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-primary">
                {framework.name} Assessment
              </h2>
              <Badge variant="outline" className="text-sm">
                {completedCriteria} / {totalCriteria} completed
              </Badge>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="text-center">
              <div className="text-lg font-semibold text-primary mb-1">
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
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground mb-1">Benchmark Standard</h4>
                <p className="text-sm text-muted-foreground">{currentCriterion.benchmark}</p>
              </div>
            </div>
          </div>

          {/* Required Documents */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Required Documentation</Label>
            <div className="flex flex-wrap gap-2">
              {currentCriterion.requiredDocuments.map((doc, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {doc}
                </Badge>
              ))}
            </div>
          </div>

          {/* Score Input */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Compliance Score: {currentScore[0]}%
              </Label>
              <Slider
                value={currentScore}
                onValueChange={setCurrentScore}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Not Compliant (0%)</span>
                <span>Partially Compliant (50%)</span>
                <span>Fully Compliant (100%)</span>
              </div>
            </div>

            {/* Evidence Input */}
            <div className="space-y-2">
              <Label htmlFor="evidence" className="text-sm font-medium">
                Evidence & Implementation Details
              </Label>
              <Textarea
                id="evidence"
                placeholder="Describe your current implementation, policies, or practices related to this criterion..."
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                className="min-h-24"
              />
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
              onClick={() => handleResponseSubmit(currentScore[0], evidence, notes)}
              disabled={!evidence.trim()}
              className="bg-primary hover:bg-primary-light"
            >
              {completedCriteria === totalCriteria - 1 ? (
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