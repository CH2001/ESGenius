import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { AVAILABLE_FRAMEWORKS } from '@/types/database';

interface FrameworkSelectionProps {
  selectedFrameworks: string[];
  onFrameworkToggle: (frameworkId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const FrameworkSelection: React.FC<FrameworkSelectionProps> = ({
  selectedFrameworks,
  onFrameworkToggle,
  onNext,
  onBack
}) => {
  const handleNext = () => {
    if (selectedFrameworks.length === 0) {
      alert('Please select at least one framework');
      return;
    }
    onNext();
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Select ESG Frameworks</h1>
          <p className="text-muted-foreground">Choose which frameworks to evaluate</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available ESG Frameworks</CardTitle>
          <CardDescription>
            Select one or more frameworks for your ESG assessment. Each framework will generate separate reports.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {AVAILABLE_FRAMEWORKS.map((framework) => (
              <div key={framework.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                <Checkbox
                  id={framework.id}
                  checked={selectedFrameworks.includes(framework.id)}
                  onCheckedChange={() => onFrameworkToggle(framework.id)}
                  disabled={framework.id !== 'esg-i'} // Only ESG-i is implemented
                />
                <div className="flex-1">
                  <label htmlFor={framework.id} className={`cursor-pointer ${framework.id !== 'esg-i' ? 'opacity-60' : ''}`}>
                    <h4 className="font-semibold">{framework.name}</h4>
                    <p className="text-sm text-muted-foreground">{framework.description}</p>
                    {framework.id !== 'esg-i' && (
                      <p className="text-xs text-orange-600 mt-1">Coming soon</p>
                    )}
                  </label>
                </div>
              </div>
            ))}
          </div>

          {selectedFrameworks.length > 0 && (
            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-4">
                Selected {selectedFrameworks.length} framework(s). Each framework will be processed separately.
              </p>
              <Button onClick={handleNext}>
                Continue to Assessment ({selectedFrameworks.length} framework{selectedFrameworks.length > 1 ? 's' : ''})
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};