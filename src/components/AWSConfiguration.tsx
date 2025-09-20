import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const AWSConfiguration: React.FC = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState({
    endpoint: '',
    accessKeyId: '',
    secretAccessKey: '',
    region: 'ap-southeast-1'
  });
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    // Load existing configuration
    const endpoint = localStorage.getItem('aws_lambda_endpoint');
    const accessKeyId = localStorage.getItem('aws_access_key_id');
    const secretAccessKey = localStorage.getItem('aws_secret_access_key');
    const region = localStorage.getItem('aws_region') || 'ap-southeast-1';

    if (endpoint) {
      setConfig({
        endpoint,
        accessKeyId: accessKeyId || '',
        secretAccessKey: secretAccessKey || '',
        region
      });
      setIsConfigured(!!endpoint);
    }
  }, []);

  const handleSave = () => {
    if (!config.endpoint) {
      toast({
        title: "Configuration Error",
        description: "AWS Lambda endpoint is required",
        variant: "destructive"
      });
      return;
    }

    // Save to localStorage
    localStorage.setItem('aws_lambda_endpoint', config.endpoint);
    localStorage.setItem('aws_region', config.region);
    
    if (config.accessKeyId && config.secretAccessKey) {
      localStorage.setItem('aws_access_key_id', config.accessKeyId);
      localStorage.setItem('aws_secret_access_key', config.secretAccessKey);
    }

    setIsConfigured(true);
    toast({
      title: "Configuration Saved",
      description: "AWS Lambda configuration has been saved successfully",
    });
  };

  const handleClear = () => {
    localStorage.removeItem('aws_lambda_endpoint');
    localStorage.removeItem('aws_access_key_id');
    localStorage.removeItem('aws_secret_access_key');
    localStorage.removeItem('aws_region');
    
    setConfig({
      endpoint: '',
      accessKeyId: '',
      secretAccessKey: '',
      region: 'ap-southeast-1'
    });
    setIsConfigured(false);

    toast({
      title: "Configuration Cleared",
      description: "AWS configuration has been removed",
    });
  };

  return (
    <Card className="shadow-medium">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          AWS Lambda Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Security Note:</strong> For production apps, use Supabase integration to securely store AWS credentials. 
            This frontend storage is for development only.
          </AlertDescription>
        </Alert>

        {isConfigured && (
          <Alert>
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              AWS Lambda is configured and ready to use.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="endpoint">Lambda Endpoint URL *</Label>
            <Input
              id="endpoint"
              placeholder="https://your-lambda-url.amazonaws.com/prod/esg-analyze"
              value={config.endpoint}
              onChange={(e) => setConfig(prev => ({ ...prev, endpoint: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">AWS Region</Label>
            <Input
              id="region"
              placeholder="ap-southeast-1"
              value={config.region}
              onChange={(e) => setConfig(prev => ({ ...prev, region: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accessKey">AWS Access Key ID (Optional)</Label>
            <Input
              id="accessKey"
              type="password"
              placeholder="Your AWS Access Key ID"
              value={config.accessKeyId}
              onChange={(e) => setConfig(prev => ({ ...prev, accessKeyId: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="secretKey">AWS Secret Access Key (Optional)</Label>
            <Input
              id="secretKey"
              type="password"
              placeholder="Your AWS Secret Access Key"
              value={config.secretAccessKey}
              onChange={(e) => setConfig(prev => ({ ...prev, secretAccessKey: e.target.value }))}
            />
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              AWS credentials are optional if your Lambda function uses IAM roles or is publicly accessible.
              Leave empty if authentication is handled differently.
            </AlertDescription>
          </Alert>

          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              Save Configuration
            </Button>
            {isConfigured && (
              <Button variant="outline" onClick={handleClear}>
                Clear
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};