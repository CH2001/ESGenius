import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings as SettingsIcon, Save, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { lambdaService } from '@/services/lambdaService';

export const Settings = () => {
  const { toast } = useToast();
  const [endpoint, setEndpoint] = useState(localStorage.getItem('lambda_endpoint') || '');
  const [accessKeyId, setAccessKeyId] = useState(localStorage.getItem('lambda_access_key') || '');
  const [secretAccessKey, setSecretAccessKey] = useState(localStorage.getItem('lambda_secret_key') || '');
  const [region, setRegion] = useState(localStorage.getItem('lambda_region') || 'ap-southeast-1');

  const handleSave = () => {
    localStorage.setItem('lambda_endpoint', endpoint);
    localStorage.setItem('lambda_access_key', accessKeyId);
    localStorage.setItem('lambda_secret_key', secretAccessKey);
    localStorage.setItem('lambda_region', region);

    lambdaService.configure(endpoint, {
      accessKeyId,
      secretAccessKey,
      region
    });

    toast({
      title: "Settings Saved",
      description: "AWS Lambda configuration has been saved successfully."
    });
  };

  const handleClear = () => {
    setEndpoint('');
    setAccessKeyId('');
    setSecretAccessKey('');
    setRegion('ap-southeast-1');
    
    localStorage.removeItem('lambda_endpoint');
    localStorage.removeItem('lambda_access_key');
    localStorage.removeItem('lambda_secret_key');
    localStorage.removeItem('lambda_region');

    toast({
      title: "Settings Cleared",
      description: "AWS Lambda configuration has been cleared."
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <SettingsIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>AWS Lambda Settings</DialogTitle>
        </DialogHeader>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="endpoint">Lambda Endpoint URL</Label>
              <Input
                id="endpoint"
                type="url"
                placeholder="https://your-lambda-endpoint.amazonaws.com"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="region">AWS Region</Label>
              <Input
                id="region"
                placeholder="ap-southeast-1"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accessKey">Access Key ID</Label>
              <Input
                id="accessKey"
                placeholder="Your AWS Access Key ID"
                value={accessKeyId}
                onChange={(e) => setAccessKeyId(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="secretKey">Secret Access Key</Label>
              <Input
                id="secretKey"
                type="password"
                placeholder="Your AWS Secret Access Key"
                value={secretAccessKey}
                onChange={(e) => setSecretAccessKey(e.target.value)}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={handleClear}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};