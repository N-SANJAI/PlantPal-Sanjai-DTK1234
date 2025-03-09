import AppLayout from "@/components/layouts/AppLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Social() {
  // Placeholder data for friends
  const friends = [
    {
      id: 1,
      name: "Emily",
      username: "plantemily",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150",
      plants: 5,
      badges: 3,
      status: "Just watered my Monstera! 💧",
      lastActive: "10 minutes ago"
    },
    {
      id: 2,
      name: "Michael",
      username: "plantdad",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&h=150",
      plants: 8,
      badges: 6,
      status: "Repotted my Snake Plant today!",
      lastActive: "2 hours ago"
    },
    {
      id: 3,
      name: "John",
      username: "botanical_john",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150",
      plants: 3,
      badges: 2,
      status: "Need plant care advice for my fiddle leaf fig",
      lastActive: "Yesterday"
    },
    {
      id: 4,
      name: "Sofia",
      username: "succulent_sofia",
      avatar: "https://images.unsplash.com/photo-1614023342667-9f59d05d6dd1?auto=format&fit=crop&w=150&h=150",
      plants: 12,
      badges: 8,
      status: "Added new plant to my collection!",
      lastActive: "3 days ago"
    }
  ];

  // Placeholder data for activity feed
  const activities = [
    {
      id: 1,
      userId: 1,
      userName: "Emily",
      action: "earned a badge",
      details: "Plant Expert",
      time: "10 minutes ago"
    },
    {
      id: 2,
      userId: 2,
      userName: "Michael",
      action: "added a new plant",
      details: "Calathea Orbifolia",
      time: "2 hours ago"
    },
    {
      id: 3,
      userId: 4,
      userName: "Sofia",
      action: "completed a task",
      details: "Watering schedule",
      time: "Yesterday"
    },
    {
      id: 4,
      userId: 3,
      userName: "John",
      action: "asked for help",
      details: "How often should I water my Fiddle Leaf Fig?",
      time: "2 days ago"
    },
    {
      id: 5,
      userId: 1,
      userName: "Emily",
      action: "revived a plant",
      details: "Rescued her Pothos",
      time: "3 days ago"
    }
  ];

  return (
    <AppLayout title="Social">
      <div className="p-4 space-y-4">
        <Tabs defaultValue="friends" className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="friends">Friends</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="friends" className="space-y-4">
            {friends.map((friend) => (
              <Card key={friend.id} className="overflow-hidden dark:bg-neutral-800">
                <CardContent className="p-0">
                  <div className="flex items-start p-4">
                    <Avatar className="h-12 w-12 mr-3">
                      <AvatarImage src={friend.avatar} alt={friend.name} />
                      <AvatarFallback>{friend.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-neutral-900 dark:text-neutral-100">{friend.name}</h3>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">{friend.lastActive}</span>
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">@{friend.username}</p>
                      <div className="mt-1 flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                          <span className="material-icons text-xs mr-1">eco</span>
                          {friend.plants} Plants
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">
                          <span className="material-icons text-xs mr-1">emoji_events</span>
                          {friend.badges} Badges
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">{friend.status}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="activity" className="space-y-4">
            {activities.map((activity) => (
              <Card key={activity.id} className="dark:bg-neutral-800">
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mr-3">
                      <span className="material-icons text-primary dark:text-primary">
                        {activity.action === "earned a badge" ? "emoji_events" :
                         activity.action === "added a new plant" ? "eco" :
                         activity.action === "completed a task" ? "task_alt" :
                         activity.action === "asked for help" ? "help" : "auto_awesome"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-neutral-800 dark:text-neutral-200">
                        <span className="font-medium">{activity.userName}</span> {activity.action}
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">{activity.details}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}