import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import AppLayout from "@/components/layouts/AppLayout";
import PlantCard from "@/components/PlantCard";
import { Plant, Task, Badge } from "@shared/schema";
import { Progress } from "@/components/ui/progress";

export default function Home() {
  const [, navigate] = useLocation();

  // Fetch plants
  const { data: plants, isLoading: isLoadingPlants } = useQuery({
    queryKey: ["/api/plants"],
  });

  // Fetch tasks
  const { data: tasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ["/api/tasks"],
  });

  // Fetch user badges
  const { data: userBadges, isLoading: isLoadingBadges } = useQuery({
    queryKey: ["/api/user/badges"],
  });

  // Fetch user
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["/api/user"],
  });

  // Loading state
  const isLoading = isLoadingPlants || isLoadingTasks || isLoadingBadges || isLoadingUser;

  const getUrgentTasks = () => {
    if (!tasks) return [];
    return tasks.filter((task: Task) => task.priority === "urgent" || task.priority === "high");
  };

  const handlePlantClick = (plantId: number) => {
    navigate(`/analysis/${plantId}`);
  };

  const handleAddPlant = () => {
    navigate("/scan");
  };

  const handleMarkTaskComplete = (taskId: number) => {
    // This would be a mutation in a real app
    console.log("Mark task complete:", taskId);
  };
  
  const handleSubmitTaskPhoto = (taskId: number) => {
    // This would upload a photo when completing a task
    console.log("Submit photo for task:", taskId);
  };
  
  const handleUpdatePlantPhoto = (plantId: number) => {
    // This would upload a new photo for the plant
    console.log("Update plant photo:", plantId);
  };

  const handleViewAllAchievements = () => {
    navigate("/achievements");
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-4 space-y-4">
          <div className="h-8 w-3/4 bg-neutral-200 animate-pulse rounded-md"></div>
          <div className="h-4 w-1/2 bg-neutral-200 animate-pulse rounded-md"></div>
          
          <div className="space-y-3 mt-6">
            <div className="h-20 bg-neutral-200 animate-pulse rounded-lg"></div>
            <div className="h-20 bg-neutral-200 animate-pulse rounded-lg"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="h-48 bg-neutral-200 animate-pulse rounded-lg"></div>
            <div className="h-48 bg-neutral-200 animate-pulse rounded-lg"></div>
            <div className="h-48 bg-neutral-200 animate-pulse rounded-lg"></div>
            <div className="h-48 bg-neutral-200 animate-pulse rounded-lg"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-4">
        <div className="mb-4">
          <h2 className="font-heading font-semibold text-lg text-neutral-900 mb-1">
            Good {getTimeOfDay()}, Plant Lover!
          </h2>
          <p className="text-sm text-neutral-600">
            You have{" "}
            <span className="font-medium text-red-500">
              {getUrgentTasks().length} {getUrgentTasks().length === 1 ? "plant" : "plants"}
            </span>{" "}
            that {getUrgentTasks().length === 1 ? "needs" : "need"} attention today
          </p>
        </div>

        {/* Urgent Tasks Section */}
        {getUrgentTasks().length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-neutral-900">Urgent Tasks</h3>
              <button className="text-primary text-sm font-medium">
                View All
              </button>
            </div>

            <div className="space-y-3">
              {getUrgentTasks().map((task: Task) => (
                <div key={task.id} className="bg-white p-3 rounded-lg shadow-sm flex items-center">
                  <div className={`mr-3 ${
                    task.type === 'water' ? 'bg-red-100' : 
                    task.type === 'move' ? 'bg-amber-100' : 
                    'bg-blue-100'
                  } rounded-full p-2`}>
                    <span className={`material-icons ${
                      task.type === 'water' ? 'text-red-500' : 
                      task.type === 'move' ? 'text-amber-500' :
                      'text-blue-500'
                    }`}>
                      {task.type === 'water' ? 'water_drop' : 
                       task.type === 'move' ? 'wb_sunny' :
                       task.type === 'fertilize' ? 'grass' :
                       'tips_and_updates'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-neutral-900">{task.title}</h4>
                    <p className="text-xs text-neutral-600">{task.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      className="bg-white border border-neutral-200 text-neutral-600 p-1.5 rounded-lg hover:bg-neutral-50"
                      onClick={() => handleSubmitTaskPhoto(task.id)}
                    >
                      <span className="material-icons text-sm">photo_camera</span>
                    </button>
                    <button 
                      className="bg-primary text-white text-sm py-1 px-3 rounded-lg"
                      onClick={() => handleMarkTaskComplete(task.id)}
                    >
                      Done
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Plants Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-neutral-900">My Plants</h3>
            <button 
              className="text-primary text-sm font-medium flex items-center"
              onClick={handleAddPlant}
            >
              <span className="material-icons text-sm mr-1">add</span> Add New
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {plants && plants.map((plant: Plant) => (
              <PlantCard 
                key={plant.id} 
                plant={plant}
                onClick={() => handlePlantClick(plant.id)}
                onUpdatePhoto={handleUpdatePlantPhoto}
              />
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-neutral-900">Your Achievements</h3>
            <button 
              className="text-primary text-sm font-medium"
              onClick={handleViewAllAchievements}
            >
              View All
            </button>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-medium text-neutral-900">Plant Parent Level</h4>
                <p className="text-xs text-neutral-600">Keep caring for your plants to level up!</p>
              </div>
              <div className="bg-green-100 text-primary font-medium text-sm py-1 px-3 rounded-full">
                Level {user?.level || 1}
              </div>
            </div>

            <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden mb-4">
              <Progress 
                value={user ? (user.points % 100) : 0}
                className="h-full bg-primary"
              />
            </div>

            <div className="flex justify-between">
              {userBadges && userBadges.slice(0, 4).map((badge: Badge & { earnedAt: Date }) => (
                <div key={badge.id} className="flex flex-col items-center">
                  <div className="relative w-12 h-12 flex items-center justify-center bg-green-100 rounded-full mb-1">
                    <span className="material-icons text-primary">{badge.icon}</span>
                  </div>
                  <span className="text-xs text-neutral-600">{badge.name}</span>
                </div>
              ))}
              
              {/* Show placeholder badges if user has fewer than 4 */}
              {userBadges && Array.from({ length: Math.max(0, 4 - userBadges.length) }).map((_, i) => (
                <div key={`empty-${i}`} className="flex flex-col items-center">
                  <div className="relative w-12 h-12 flex items-center justify-center bg-neutral-200 bg-opacity-30 rounded-full mb-1 opacity-60">
                    <span className="material-icons text-neutral-400">lock</span>
                  </div>
                  <span className="text-xs text-neutral-400">Locked</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

// Helper function to get time of day greeting
function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}
