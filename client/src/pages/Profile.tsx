import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTheme } from "@/hooks/use-theme";
import AppLayout from "@/components/layouts/AppLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function Profile() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("stats");

  // Fetch user data
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["/api/user"],
  });

  // Fetch user's badges
  const { data: badges, isLoading: isLoadingBadges } = useQuery({
    queryKey: ["/api/user/badges"],
  });

  // Fetch plants
  const { data: plants, isLoading: isLoadingPlants } = useQuery({
    queryKey: ["/api/plants"],
  });

  const isLoading = isLoadingUser || isLoadingBadges || isLoadingPlants;

  // Personal info placeholder (would normally come from a profile API endpoint)
  const profileInfo = {
    name: "Dylan",
    username: user?.username || "plantlover",
    age: 21,
    location: "Singapore",
    bio: "Plant enthusiast with a passion for tropical species. Learning more about sustainable gardening every day.",
    joinedDate: "Jan 2023",
    avatar: "/images/profile.png"
  };

  // Statistics calculations
  const totalPlants = plants?.length || 0;
  const totalBadges = badges?.length || 0;
  const completedTasks = 12; // This would come from a tasks API with filtering
  const streak = 7; // This would be calculated based on activity history
  const level = user?.level || 1;
  const points = user?.points || 0;
  const pointsToNextLevel = 100; // This would be calculated based on level system
  const pointsProgress = ((points % pointsToNextLevel) / pointsToNextLevel) * 100;

  // For settings tab
  const [notifications, setNotifications] = useState(true);
  const [waterReminders, setWaterReminders] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  if (isLoading) {
    return (
      <AppLayout title="Profile">
        <div className="p-4 space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-neutral-200 animate-pulse rounded-full"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-neutral-200 animate-pulse rounded-md w-1/3"></div>
              <div className="h-3 bg-neutral-200 animate-pulse rounded-md w-1/2"></div>
            </div>
          </div>
          <div className="h-32 bg-neutral-200 animate-pulse rounded-lg"></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-24 bg-neutral-200 animate-pulse rounded-lg"></div>
            <div className="h-24 bg-neutral-200 animate-pulse rounded-lg"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Profile">
      <div className="flex flex-col p-4 pb-20">
        {/* Profile Header */}
        <div className="flex items-center mb-6">
          <Avatar className="h-20 w-20 border-4 border-white dark:border-neutral-800 shadow-md">
            <AvatarImage src={profileInfo.avatar} />
            <AvatarFallback className="bg-primary text-white text-xl">
              {profileInfo.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4">
            <h1 className="text-xl font-bold text-neutral-900 dark:text-white">{profileInfo.name}</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">@{profileInfo.username}</p>
            <div className="flex items-center mt-1">
              <Badge variant="outline" className="mr-2 text-xs bg-primary/10 text-primary border-primary/20 dark:bg-primary-900/20 dark:text-primary dark:border-primary-800/30">
                Level {level}
              </Badge>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">{profileInfo.location}</span>
            </div>
          </div>
        </div>

        {/* Level Progress */}
        <Card className="mb-6 dark:bg-neutral-800 dark:border-neutral-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex justify-between">
              <span>Level Progress</span>
              <span className="text-primary dark:text-primary">{points}/{pointsToNextLevel} points</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={pointsProgress} className="h-2" />
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
              {Math.round(pointsProgress)}% to Level {level + 1}
            </p>
          </CardContent>
        </Card>

        {/* Tabs for different sections */}
        <Tabs defaultValue="stats" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full mb-4">
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <StatCard 
                icon="eco" 
                label="Plants" 
                value={totalPlants.toString()} 
                bgColor="bg-green-100 dark:bg-green-900/30"
                textColor="text-green-700 dark:text-green-400"
              />
              <StatCard 
                icon="emoji_events" 
                label="Badges" 
                value={totalBadges.toString()} 
                bgColor="bg-amber-100 dark:bg-amber-900/30"
                textColor="text-amber-700 dark:text-amber-400"
              />
              <StatCard 
                icon="task_alt" 
                label="Tasks Done" 
                value={completedTasks.toString()} 
                bgColor="bg-blue-100 dark:bg-blue-900/30"
                textColor="text-blue-700 dark:text-blue-400"
              />
              <StatCard 
                icon="local_fire_department" 
                label="Day Streak" 
                value={streak.toString()} 
                bgColor="bg-red-100 dark:bg-red-900/30"
                textColor="text-red-700 dark:text-red-400"
              />
            </div>

            <Card className="dark:bg-neutral-800 dark:border-neutral-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">About Me</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-700 dark:text-neutral-300">{profileInfo.bio}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                  Joined {profileInfo.joinedDate}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value="badges" className="space-y-4">
            <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-2">Earned Badges</h3>
            <div className="grid grid-cols-2 gap-3">
              {badges?.map((badge: any) => (
                <Card key={badge.id} className="overflow-hidden dark:bg-neutral-800 dark:border-neutral-700">
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center">
                      <div className="bg-primary/10 dark:bg-primary-900/20 p-3 rounded-full mb-3">
                        <span className="material-icons text-primary dark:text-primary text-2xl">
                          {badge.icon || "emoji_events"}
                        </span>
                      </div>
                      <h4 className="font-medium text-neutral-900 dark:text-white">{badge.name}</h4>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{badge.description}</p>
                      <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-2">
                        Earned {new Date(badge.earnedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Photos Tab */}
          <TabsContent value="photos" className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-neutral-900 dark:text-white">Plant Photo Library</h3>
              <button className="text-primary text-sm font-medium flex items-center">
                <span className="material-icons text-sm mr-1">add_a_photo</span> Add New
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {/* Display our plant photos */}
              <div className="aspect-square overflow-hidden rounded-lg relative group">
                <img 
                  src="/images/plant1.jpg" 
                  alt="Monstera" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="text-white text-center">
                    <span className="material-icons text-2xl">visibility</span>
                    <p className="text-xs mt-1">View</p>
                  </div>
                </div>
              </div>
              
              <div className="aspect-square overflow-hidden rounded-lg relative group">
                <img 
                  src="/images/plant2.jpg" 
                  alt="Succulent" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="text-white text-center">
                    <span className="material-icons text-2xl">visibility</span>
                    <p className="text-xs mt-1">View</p>
                  </div>
                </div>
              </div>
              
              <div className="aspect-square overflow-hidden rounded-lg relative group">
                <img 
                  src="/images/plant3.jpg" 
                  alt="Fern" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="text-white text-center">
                    <span className="material-icons text-2xl">visibility</span>
                    <p className="text-xs mt-1">View</p>
                  </div>
                </div>
              </div>
              
              <div className="aspect-square overflow-hidden rounded-lg relative group">
                <img 
                  src="/images/plant4.jpg" 
                  alt="Cactus" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="text-white text-center">
                    <span className="material-icons text-2xl">visibility</span>
                    <p className="text-xs mt-1">View</p>
                  </div>
                </div>
              </div>
              
              <div className="aspect-square overflow-hidden rounded-lg relative group">
                <img 
                  src="/images/plant5.jpg" 
                  alt="Orchid" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="text-white text-center">
                    <span className="material-icons text-2xl">visibility</span>
                    <p className="text-xs mt-1">View</p>
                  </div>
                </div>
              </div>
              
              <div className="aspect-square overflow-hidden rounded-lg relative group">
                <img 
                  src="/images/plant6.jpg" 
                  alt="Bonsai" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="text-white text-center">
                    <span className="material-icons text-2xl">visibility</span>
                    <p className="text-xs mt-1">View</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
                Tap a photo to view details or add a new photo to your collection
              </p>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card className="dark:bg-neutral-800 dark:border-neutral-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Appearance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Switch between light and dark themes
                    </p>
                  </div>
                  <Switch 
                    id="dark-mode" 
                    checked={theme === "dark"}
                    onCheckedChange={toggleTheme}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-neutral-800 dark:border-neutral-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="app-notifications">App Notifications</Label>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Enable in-app notifications
                    </p>
                  </div>
                  <Switch 
                    id="app-notifications" 
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="water-reminders">Watering Reminders</Label>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Get reminded when plants need water
                    </p>
                  </div>
                  <Switch 
                    id="water-reminders" 
                    checked={waterReminders}
                    onCheckedChange={setWaterReminders}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="weekly-digest">Weekly Digest</Label>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Receive a weekly summary of your plants
                    </p>
                  </div>
                  <Switch 
                    id="weekly-digest" 
                    checked={weeklyDigest}
                    onCheckedChange={setWeeklyDigest}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-neutral-800 dark:border-neutral-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Account</CardTitle>
              </CardHeader>
              <CardContent>
                <button className="text-sm text-red-600 dark:text-red-400 hover:underline w-full text-left">
                  Sign Out
                </button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

// Helper component for stats cards
function StatCard({ 
  icon, 
  label, 
  value, 
  bgColor = "bg-primary/10", 
  textColor = "text-primary" 
}: { 
  icon: string; 
  label: string; 
  value: string; 
  bgColor?: string;
  textColor?: string;
}) {
  return (
    <Card className="dark:bg-neutral-800 dark:border-neutral-700">
      <CardContent className="p-4">
        <div className="flex items-center">
          <div className={`${bgColor} p-2 rounded-full mr-3`}>
            <span className={`material-icons ${textColor}`}>{icon}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-900 dark:text-white">{value}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}