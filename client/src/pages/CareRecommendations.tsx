import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AppLayout from "@/components/layouts/AppLayout";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function CareRecommendations() {
  const { plantId } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch plant data
  const { data: plant, isLoading: isLoadingPlant } = useQuery({
    queryKey: [`/api/plants/${plantId}`],
  });
  
  // Fetch latest plant analysis
  const { data: analysis, isLoading: isLoadingAnalysis } = useQuery({
    queryKey: [`/api/plants/${plantId}/analysis/latest`],
  });
  
  // Fetch tasks for this plant
  const { data: tasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: [`/api/plants/${plantId}/tasks`],
  });
  
  const isLoading = isLoadingPlant || isLoadingAnalysis || isLoadingTasks;
  
  // Mark task as complete mutation
  const markTaskCompleteMutation = useMutation({
    mutationFn: async (taskId: number) => {
      return apiRequest("PATCH", `/api/tasks/${taskId}`, { completed: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/plants/${plantId}/tasks`] });
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Task Completed",
        description: "Great job! Your plant thanks you.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to mark task as complete. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Schedule reminder mutation
  const scheduleReminderMutation = useMutation({
    mutationFn: async (taskData: { description: string, type: string, title: string }) => {
      // Create a task that's due in 3 days
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 3);
      
      return apiRequest("POST", `/api/tasks`, {
        plantId: Number(plantId),
        title: taskData.title,
        description: taskData.description,
        type: taskData.type,
        priority: "high",
        dueDate: dueDate.toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/plants/${plantId}/tasks`] });
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Reminder Set",
        description: "We'll remind you when it's time to complete this task.",
      });
    }
  });
  
  const handleSetReminders = () => {
    toast({
      title: "Reminders Set",
      description: "We'll notify you when it's time to care for your plant."
    });
    navigate("/");
  };
  
  // Helper function to group recommendations by priority
  const getRecommendationsByPriority = () => {
    if (!analysis?.recommendations) return {};
    
    const recommendations = analysis.recommendations as any[];
    const grouped: Record<string, any[]> = {};
    
    recommendations.forEach(rec => {
      if (!grouped[rec.priority]) {
        grouped[rec.priority] = [];
      }
      grouped[rec.priority].push(rec);
    });
    
    return grouped;
  };
  
  // Helper function to get priority header data
  const getPriorityHeader = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return {
          title: "Urgent Action Needed",
          bgColor: "bg-red-100",
          textColor: "text-red-500",
          icon: "priority_high"
        };
      case 'recommended':
        return {
          title: "Recommended Soon",
          bgColor: "bg-amber-100",
          textColor: "text-amber-500",
          icon: "schedule"
        };
      case 'maintenance':
      default:
        return {
          title: "Maintenance Tasks",
          bgColor: "bg-green-100",
          textColor: "text-primary",
          icon: "update"
        };
    }
  };
  
  if (isLoading) {
    return (
      <AppLayout title="Care Recommendations">
        <div className="p-4 space-y-6">
          <div className="h-8 w-3/4 bg-neutral-200 animate-pulse rounded-md"></div>
          <div className="h-4 w-1/2 bg-neutral-200 animate-pulse rounded-md"></div>
          
          <div className="space-y-4">
            <div className="h-64 bg-neutral-200 animate-pulse rounded-lg"></div>
            <div className="h-64 bg-neutral-200 animate-pulse rounded-lg"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  const groupedRecommendations = getRecommendationsByPriority();

  return (
    <AppLayout title="Care Recommendations">
      <div className="p-4">
        <div className="mb-4">
          <h2 className="font-heading font-semibold text-lg text-neutral-900 mb-1">Care Recommendations</h2>
          <p className="text-sm text-neutral-600">For your {plant?.species || plant?.name}</p>
        </div>
        
        <div className="space-y-4 mb-6">
          {Object.entries(groupedRecommendations).map(([priority, recommendations], priorityIndex) => (
            <div key={priority} className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Priority Header */}
              <div className={`${getPriorityHeader(priority).bgColor} px-4 py-3 flex items-center`}>
                <span className={`material-icons ${getPriorityHeader(priority).textColor} mr-2`}>
                  {getPriorityHeader(priority).icon}
                </span>
                <h3 className="font-medium text-neutral-900">{getPriorityHeader(priority).title}</h3>
              </div>
              
              <div className="p-4 space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className="flex">
                    <div className="mr-3 mt-1">
                      <div className="bg-primary rounded-full w-6 h-6 flex items-center justify-center text-white text-xs font-medium">
                        {priorityIndex * recommendations.length + index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-neutral-900">{rec.title}</h4>
                      <p className="text-sm text-neutral-600 mb-2">{rec.description}</p>
                      
                      {rec.tip && (
                        <div className="bg-neutral-50 rounded-lg p-3 text-sm">
                          <span className="font-medium text-primary">Pro Tip:</span> {rec.tip}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {priority === 'urgent' && (
                  <button 
                    className="w-full flex items-center justify-center bg-primary hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    onClick={() => {
                      const taskId = tasks?.find((t: any) => 
                        t.title === recommendations[0].title && !t.completed
                      )?.id;
                      
                      if (taskId) {
                        markTaskCompleteMutation.mutate(taskId);
                      }
                    }}
                    disabled={markTaskCompleteMutation.isPending}
                  >
                    <span className="material-icons mr-1">check</span>
                    {markTaskCompleteMutation.isPending ? "Processing..." : "Mark as Complete"}
                  </button>
                )}
                
                {priority === 'recommended' && (
                  <button 
                    className="w-full flex items-center justify-center bg-white hover:bg-neutral-50 text-neutral-600 font-medium py-2 px-4 rounded-lg transition-colors border border-neutral-200"
                    onClick={() => {
                      const rec = recommendations[0];
                      scheduleReminderMutation.mutate({
                        title: rec.title,
                        description: rec.description,
                        type: rec.type
                      });
                    }}
                    disabled={scheduleReminderMutation.isPending}
                  >
                    <span className="material-icons mr-1">event</span>
                    {scheduleReminderMutation.isPending ? "Setting reminder..." : "Schedule Reminder"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <button 
          className="w-full bg-primary hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors mb-4"
          onClick={handleSetReminders}
        >
          Set Up Care Reminders
        </button>
      </div>
    </AppLayout>
  );
}
