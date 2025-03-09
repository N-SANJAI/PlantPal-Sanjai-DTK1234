import { useQuery } from "@tanstack/react-query";
import AppLayout from "@/components/layouts/AppLayout";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@shared/schema";

export default function Achievements() {
  // Fetch user data
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["/api/user"],
  });
  
  // Fetch user badges
  const { data: userBadges, isLoading: isLoadingBadges } = useQuery({
    queryKey: ["/api/user/badges"],
  });
  
  // Fetch all available badges
  const { data: allBadges, isLoading: isLoadingAllBadges } = useQuery({
    queryKey: ["/api/badges"],
  });
  
  const isLoading = isLoadingUser || isLoadingBadges || isLoadingAllBadges;
  
  // Calculate locked badges
  const getLockedBadges = () => {
    if (!allBadges || !userBadges) return [];
    
    const earnedBadgeIds = userBadges.map((badge: Badge) => badge.id);
    return allBadges.filter((badge: Badge) => !earnedBadgeIds.includes(badge.id));
  };
  
  // Progress to next level (points needed)
  const getPointsToNextLevel = () => {
    if (!user) return 0;
    
    const pointsPerLevel = 100;
    const currentLevelPoints = user.points % pointsPerLevel;
    return pointsPerLevel - currentLevelPoints;
  };

  if (isLoading) {
    return (
      <AppLayout title="Achievements">
        <div className="p-4 space-y-6">
          <div className="h-32 bg-neutral-200 animate-pulse rounded-lg"></div>
          
          <div className="space-y-2">
            <div className="h-6 w-1/3 bg-neutral-200 animate-pulse rounded-md"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-24 bg-neutral-200 animate-pulse rounded-lg"></div>
              <div className="h-24 bg-neutral-200 animate-pulse rounded-lg"></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="h-6 w-1/3 bg-neutral-200 animate-pulse rounded-md"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-24 bg-neutral-200 animate-pulse rounded-lg"></div>
              <div className="h-24 bg-neutral-200 animate-pulse rounded-lg"></div>
              <div className="h-24 bg-neutral-200 animate-pulse rounded-lg"></div>
              <div className="h-24 bg-neutral-200 animate-pulse rounded-lg"></div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  const lockedBadges = getLockedBadges();

  return (
    <AppLayout title="Achievements">
      <div className="p-4">
        <div className="mb-4">
          <h2 className="font-heading font-semibold text-lg text-neutral-900 mb-1">Your Achievements</h2>
          <p className="text-sm text-neutral-600">Track your progress as a plant parent</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-medium text-neutral-900">Plant Parent Level</h3>
              <p className="text-xs text-neutral-600">Keep up the good work!</p>
            </div>
            <div className="relative">
              <div className="bg-green-100 text-primary font-medium text-lg py-1 px-4 rounded-full">
                {user?.level || 1}
              </div>
              {getPointsToNextLevel() < 20 && (
                <div className="absolute -top-1 -right-1 bg-amber-400 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full animate-pulse">+</div>
              )}
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-xs text-neutral-600">
              <span>Level {user?.level || 1}</span>
              <span>Level {(user?.level || 1) + 1}</span>
            </div>
            <div className="w-full h-2 bg-neutral-50 rounded-full overflow-hidden">
              <Progress value={(user?.points || 0) % 100} />
            </div>
            <p className="text-xs text-neutral-600 text-center">
              {getPointsToNextLevel()} points needed for next level
            </p>
          </div>
        </div>
        
        {userBadges && userBadges.length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium text-neutral-900 mb-3">Earned Badges</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {userBadges.map((badge: Badge & { earnedAt: Date }) => (
                <div key={badge.id} className="bg-white rounded-lg shadow-sm p-4 flex items-center">
                  <div className="bg-green-100 rounded-full p-3 mr-3">
                    <span className="material-icons text-primary">{badge.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900">{badge.name}</h4>
                    <p className="text-xs text-neutral-600">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {lockedBadges.length > 0 && (
          <div>
            <h3 className="font-medium text-neutral-900 mb-3">Badges to Earn</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {lockedBadges.map((badge: Badge) => (
                <div key={badge.id} className="bg-white rounded-lg shadow-sm p-4 flex items-center opacity-60">
                  <div className="bg-neutral-200 bg-opacity-30 rounded-full p-3 mr-3">
                    <span className="material-icons text-neutral-400">{badge.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900">{badge.name}</h4>
                    <p className="text-xs text-neutral-600">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
