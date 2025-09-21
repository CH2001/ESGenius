import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings as SettingsIcon } from 'lucide-react';

export const Settings = () => {
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
            <CardTitle className="text-lg">Current Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Lambda Endpoint URL</Label>
              <div className="p-3 bg-muted rounded-md text-sm font-mono">
                https://09aoixhak3.execute-api.us-east-1.amazonaws.com
              </div>
              <p className="text-xs text-muted-foreground">
                Using your configured AWS API Gateway endpoint
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Authentication</Label>
              <div className="p-3 bg-muted rounded-md text-sm">
                Direct API Gateway access (no additional credentials required)
              </div>
              <p className="text-xs text-muted-foreground">
                Your Lambda function is accessible via API Gateway
              </p>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Ready for ESG assessment processing</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};