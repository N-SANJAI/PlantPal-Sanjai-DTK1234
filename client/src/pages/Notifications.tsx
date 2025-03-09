import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AppLayout from "@/components/layouts/AppLayout";
import { Switch } from "@/components/ui/switch";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Notification } from "@shared/schema";

export default function Notifications() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch notifications
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["/api/notifications"],
  });
  
  // Mark notification as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      return apiRequest("PATCH", `/api/notifications/${notificationId}/read`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    }
  });
  
  // Helper function to format relative time
  const getRelativeTime = (date: string) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };
  
  // Helper function to get notification type data
  const getNotificationTypeData = (type: string) => {
    switch (type) {
      case 'task':
        return { icon: 'water_drop', borderColor: 'border-red-500', iconColor: 'text-red-500' };
      case 'issue':
        return { icon: 'warning', borderColor: 'border-amber-500', iconColor: 'text-amber-500' };
      case 'badge':
        return { icon: 'emoji_events', borderColor: 'border-primary', iconColor: 'text-primary' };
      case 'tip':
      default:
        return { icon: 'tips_and_updates', borderColor: 'border-neutral-200', iconColor: 'text-neutral-600' };
    }
  };
  
  // Settings state management
  const [notificationSettings, setNotificationSettings] = React.useState({
    waterReminders: true,
    healthAlerts: true,
    achievementUpdates: true,
    dailyTips: false
  });
  
  const handleToggleSetting = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    
    toast({
      title: "Settings Updated",
      description: `${setting} notifications ${notificationSettings[setting] ? "disabled" : "enabled"}.`
    });
  };

  if (isLoading) {
    return (
      <AppLayout title="Notifications">
        <div className="p-4 space-y-6">
          <div className="h-8 w-3/4 bg-neutral-200 animate-pulse rounded-md"></div>
          <div className="h-4 w-1/2 bg-neutral-200 animate-pulse rounded-md"></div>
          
          <div className="space-y-3">
            <div className="h-24 bg-neutral-200 animate-pulse rounded-lg"></div>
            <div className="h-24 bg-neutral-200 animate-pulse rounded-lg"></div>
            <div className="h-24 bg-neutral-200 animate-pulse rounded-lg"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Notifications">
      <div className="p-4">
        <div className="mb-4">
          <h2 className="font-heading font-semibold text-lg text-neutral-900 mb-1">Notifications</h2>
          <p className="text-sm text-neutral-600">Stay updated on your plants' needs</p>
        </div>
        
        <div className="space-y-3 mb-6">
          {notifications && notifications.length > 0 ? (
            notifications.map((notification: Notification) => {
              const typeData = getNotificationTypeData(notification.type);
              return (
                <div 
                  key={notification.id} 
                  className={`bg-white rounded-lg shadow-sm p-4 border-l-4 ${typeData.borderColor}`}
                >
                  <div className="flex items-start">
                    <span className={`material-icons ${typeData.iconColor} mr-3`}>{typeData.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-neutral-900">{notification.title}</h4>
                        <span className="text-xs text-neutral-600">{getRelativeTime(notification.createdAt)}</span>
                      </div>
                      <p className="text-sm text-neutral-600 mb-2">{notification.message}</p>
                      {!notification.read && notification.type === 'task' && (
                        <button 
                          className="text-primary text-sm font-medium"
                          onClick={() => markAsReadMutation.mutate(notification.id)}
                        >
                          Mark as Done
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <span className="material-icons text-neutral-400 text-4xl mb-2">notifications_off</span>
              <h3 className="font-medium text-neutral-900 mb-1">No Notifications</h3>
              <p className="text-sm text-neutral-600">You're all caught up! Check back later for updates.</p>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium text-neutral-900">Notification Settings</h3>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-neutral-900">Water Reminders</h4>
                  <p className="text-xs text-neutral-600">Get notified when plants need water</p>
                </div>
                <Switch 
                  checked={notificationSettings.waterReminders}
                  onCheckedChange={() => handleToggleSetting('waterReminders')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-neutral-900">Plant Health Alerts</h4>
                  <p className="text-xs text-neutral-600">Notifications about issues detected</p>
                </div>
                <Switch 
                  checked={notificationSettings.healthAlerts}
                  onCheckedChange={() => handleToggleSetting('healthAlerts')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-neutral-900">Achievement Updates</h4>
                  <p className="text-xs text-neutral-600">Get notified about badges and progress</p>
                </div>
                <Switch 
                  checked={notificationSettings.achievementUpdates}
                  onCheckedChange={() => handleToggleSetting('achievementUpdates')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-neutral-900">Daily Plant Tips</h4>
                  <p className="text-xs text-neutral-600">Helpful advice for better plant care</p>
                </div>
                <Switch 
                  checked={notificationSettings.dailyTips}
                  onCheckedChange={() => handleToggleSetting('dailyTips')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
