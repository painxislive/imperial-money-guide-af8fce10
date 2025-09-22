import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Bell, BellOff, X, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type PermissionStatus = 'granted' | 'denied' | 'default' | 'unsupported';

export const PushNotificationManager: React.FC = () => {
  const [permission, setPermission] = useState<PermissionStatus>('default');
  const [isSupported, setIsSupported] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if browser supports notifications
    if ('Notification' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    } else {
      setIsSupported(false);
      setPermission('unsupported');
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) {
      toast({
        title: "Not Supported",
        description: "Your browser doesn't support push notifications.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        toast({
          title: "Notifications Enabled!",
          description: "You'll receive alerts about breaking financial news.",
        });
        
        // Show a test notification
        new Notification("ImperialPedia", {
          body: "You're now subscribed to breaking finance news alerts!",
          icon: "/favicon.ico",
          badge: "/favicon.ico"
        });
      } else if (result === 'denied') {
        toast({
          title: "Notifications Blocked",
          description: "You can enable notifications in your browser settings.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast({
        title: "Error",
        description: "Failed to request notification permission.",
        variant: "destructive",
      });
    }
  };

  const sendTestNotification = () => {
    if (permission === 'granted') {
      new Notification("ImperialPedia Test", {
        body: "This is a test notification. You're all set!",
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: "test-notification"
      });
    }
  };

  const getPermissionStatus = () => {
    switch (permission) {
      case 'granted':
        return { text: 'Enabled', color: 'text-green-600', icon: Bell };
      case 'denied':
        return { text: 'Blocked', color: 'text-red-600', icon: BellOff };
      case 'default':
        return { text: 'Not Set', color: 'text-yellow-600', icon: Bell };
      case 'unsupported':
        return { text: 'Unsupported', color: 'text-gray-600', icon: BellOff };
      default:
        return { text: 'Unknown', color: 'text-gray-600', icon: BellOff };
    }
  };

  if (!isSupported) {
    return null; // Don't render anything if not supported
  }

  const status = getPermissionStatus();
  const StatusIcon = status.icon;

  return (
    <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <StatusIcon className="h-4 w-4" />
          Notifications
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Push Notifications
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium">Breaking News Alerts</h4>
                  <p className="text-sm text-muted-foreground">
                    Get notified about major market movements and breaking financial news
                  </p>
                </div>
                <div className={`text-sm font-medium ${status.color} flex items-center gap-1`}>
                  <StatusIcon className="h-4 w-4" />
                  {status.text}
                </div>
              </div>
              
              {permission === 'default' && (
                <Button onClick={requestPermission} className="w-full">
                  Enable Notifications
                </Button>
              )}
              
              {permission === 'granted' && (
                <div className="space-y-2">
                  <Button onClick={sendTestNotification} variant="outline" className="w-full">
                    Send Test Notification
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    You'll receive notifications for breaking financial news
                  </p>
                </div>
              )}
              
              {permission === 'denied' && (
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Notifications are blocked. To enable them:
                  </p>
                  <ol className="text-xs text-muted-foreground text-left space-y-1">
                    <li>1. Click the lock icon in your address bar</li>
                    <li>2. Change notifications to "Allow"</li>
                    <li>3. Refresh this page</li>
                  </ol>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="text-xs text-muted-foreground">
            <h5 className="font-medium mb-2">What you'll receive:</h5>
            <ul className="space-y-1">
              <li>• Major market crashes or surges (&gt;5% moves)</li>
              <li>• Breaking cryptocurrency news</li>
              <li>• Federal Reserve announcements</li>
              <li>• Major economic data releases</li>
            </ul>
            <p className="mt-2">
              We respect your privacy and will only send important financial alerts. 
              You can disable notifications at any time in your browser settings.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Hook to send notifications
export const useNotificationSender = () => {
  const sendNotification = (title: string, body: string, options?: NotificationOptions) => {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: "finance-alert",
        requireInteraction: true,
        ...options
      });

      // Auto-close after 10 seconds if not interacted with
      setTimeout(() => {
        notification.close();
      }, 10000);

      return notification;
    }
    return null;
  };

  const sendBreakingNewsAlert = (headline: string, url?: string) => {
    return sendNotification(
      "🚨 Breaking Financial News",
      headline,
      {
        tag: "breaking-news",
        data: { url },
        // actions: url ? [
        //   { action: "read", title: "Read Article" },
        //   { action: "dismiss", title: "Dismiss" }
        // ] : undefined
      }
    );
  };

  const sendMarketAlert = (message: string, market: string) => {
    return sendNotification(
      `📈 ${market} Alert`,
      message,
      {
        tag: "market-alert",
        requireInteraction: true
      }
    );
  };

  return {
    sendNotification,
    sendBreakingNewsAlert,
    sendMarketAlert,
    isSupported: 'Notification' in window,
    permission: 'Notification' in window ? Notification.permission : 'unsupported'
  };
};