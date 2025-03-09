import { useLocation } from "wouter";
import AppLayout from "@/components/layouts/AppLayout";

export default function Onboarding() {
  const [, navigate] = useLocation();

  const handleAddFirstPlant = () => {
    navigate("/scan");
  };

  const handleSkip = () => {
    navigate("/");
  };

  return (
    <AppLayout showBottomNav={false} showHeader={false}>
      <div className="p-4 h-full">
        <div className="flex flex-col items-center justify-center h-full space-y-8 py-8">
          <div className="text-center space-y-2">
            <h2 className="font-heading font-bold text-2xl text-neutral-900">Welcome to PlantPal</h2>
            <p className="text-neutral-600">Your AI-powered plant care assistant</p>
          </div>
          
          <div className="w-full max-w-xs">
            <img 
              src="https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=400&h=400" 
              alt="Plants in a bright room" 
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
          
          <div className="space-y-6 w-full max-w-xs">
            <div className="flex items-center">
              <div className="bg-green-200 rounded-full p-2 mr-3">
                <span className="material-icons text-white">camera_alt</span>
              </div>
              <div>
                <h3 className="font-medium text-neutral-900">Scan Plants</h3>
                <p className="text-sm text-neutral-600">Identify issues with AI analysis</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="bg-green-200 rounded-full p-2 mr-3">
                <span className="material-icons text-white">tips_and_updates</span>
              </div>
              <div>
                <h3 className="font-medium text-neutral-900">Smart Care Tips</h3>
                <p className="text-sm text-neutral-600">Get personalized recommendations</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="bg-green-200 rounded-full p-2 mr-3">
                <span className="material-icons text-white">emoji_events</span>
              </div>
              <div>
                <h3 className="font-medium text-neutral-900">Track Progress</h3>
                <p className="text-sm text-neutral-600">Earn badges as your plants thrive</p>
              </div>
            </div>
          </div>
          
          <div className="w-full max-w-xs space-y-3">
            <button 
              className="w-full bg-primary hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              onClick={handleAddFirstPlant}
            >
              Add Your First Plant
            </button>
            <button 
              className="w-full bg-white hover:bg-neutral-100 text-neutral-600 font-medium py-3 px-4 rounded-lg border border-neutral-200 transition-colors"
              onClick={handleSkip}
            >
              Skip for Now
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
