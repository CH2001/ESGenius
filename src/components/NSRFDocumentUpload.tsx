import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface NSRFDocumentUploadProps {
  onAnalysisComplete: (nsrfResults: any) => void;
  onBack: () => void;
}

export const NSRFDocumentUpload: React.FC<NSRFDocumentUploadProps> = ({ 
  onAnalysisComplete, 
  onBack 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setUploadProgress(0);
    } else {
      toast.error('Please select a PDF file');
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data:application/pdf;base64, prefix
        const base64String = result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Convert PDF to base64
      setUploadProgress(25);
      const base64Content = await convertToBase64(selectedFile);
      
      setUploadProgress(50);
      
      // Submit to Lambda API
      const response = await fetch('https://9cprb9r8pd.execute-api.us-east-1.amazonaws.com/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileContent: base64Content
        })
      });

      setUploadProgress(75);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setUploadProgress(100);

      toast.success('NSRF analysis completed successfully');
      onAnalysisComplete(result);

    } catch (error) {
      console.error('Error analyzing document:', error);
      toast.error('Failed to analyze document: ' + (error as any)?.message);
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Button variant="outline" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Framework Selection
      </Button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">NSRF Document Analysis</h1>
        <p className="text-muted-foreground">
          Upload your sustainability report for National Sustainability Reporting Framework analysis
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Upload PDF Document
          </CardTitle>
          <CardDescription>
            Upload your company's sustainability report or relevant ESG documentation for NSRF compliance analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div
            onClick={triggerFileInput}
            className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Choose PDF File</h3>
            <p className="text-muted-foreground">
              Click to select your sustainability report PDF file
            </p>
          </div>

          {selectedFile && (
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div className="flex-1">
                  <h4 className="font-semibold">{selectedFile.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          )}

          {isUploading && (
            <div className="space-y-2">
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-center text-muted-foreground">
                {uploadProgress < 25 && "Processing document..."}
                {uploadProgress >= 25 && uploadProgress < 50 && "Converting to analysis format..."}
                {uploadProgress >= 50 && uploadProgress < 75 && "Analyzing with NSRF framework..."}
                {uploadProgress >= 75 && "Generating insights..."}
              </p>
            </div>
          )}

          <Button 
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="w-full"
            size="lg"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Document...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Analyze Document
              </>
            )}
          </Button>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Supported format: PDF files only</p>
            <p>• Maximum file size: 20MB</p>
            <p>• Analysis typically takes 30-60 seconds</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};