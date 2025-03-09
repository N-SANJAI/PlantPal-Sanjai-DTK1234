import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import AppLayout from "@/components/layouts/AppLayout";
import { Progress } from "@/components/ui/progress";

export default function Analysis() {
  const params = useParams();
  const plantId = params.plantId;
  const [, navigate] = useLocation();
  
  // Fetch plant data
  const { data: plant, isLoading: isLoadingPlant } = useQuery({
    queryKey: [`/api/plants/${plantId}`],
  });
  
  // Fetch latest plant analysis
  const { data: analysis, isLoading: isLoadingAnalysis } = useQuery({
    queryKey: [`/api/plants/${plantId}/analysis/latest`],
  });
  
  const isLoading = isLoadingPlant || isLoadingAnalysis;
  
  const handleSeeRecommendations = () => {
    navigate(`/care/${plantId}`);
  };
  
  // Helper function to get health indicator status
  const getStatusText = (value: number) => {
    if (value < 30) return "Very Low";
    if (value < 50) return "Low";
    if (value < 70) return "Moderate";
    if (value < 90) return "Good";
    return "Optimal";
  };
  
  // Helper function to get health indicator color
  const getStatusColor = (value: number, isInverse = false) => {
    const actualValue = isInverse ? 100 - value : value;
    if (actualValue < 30) return "bg-red-500";
    if (actualValue < 50) return "bg-amber-500";
    if (actualValue < 70) return "bg-amber-400";
    return "bg-primary";
  };
  
  // Helper function to get text color based on status
  const getTextColor = (value: number, isInverse = false) => {
    const actualValue = isInverse ? 100 - value : value;
    if (actualValue < 30) return "text-red-500";
    if (actualValue < 50) return "text-amber-500";
    if (actualValue < 70) return "text-amber-400";
    return "text-primary";
  };

  if (isLoading) {
    return (
      <AppLayout title="Analysis">
        <div className="p-4 space-y-6">
          <div className="h-48 bg-neutral-200 animate-pulse rounded-lg"></div>
          <div className="space-y-4">
            <div className="h-4 bg-neutral-200 animate-pulse rounded-md"></div>
            <div className="h-2 w-full bg-neutral-200 animate-pulse rounded-full"></div>
            <div className="grid grid-cols-2 gap-3">
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

  if (!plant || !analysis) {
    return (
      <AppLayout title="Analysis">
        <div className="p-4">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <span className="material-icons text-red-500 text-4xl mb-2">error</span>
            <h2 className="font-medium text-lg mb-2">Analysis Not Found</h2>
            <p className="text-neutral-600 mb-4">We couldn't find the analysis for this plant.</p>
            <button 
              className="bg-primary text-white px-4 py-2 rounded-lg"
              onClick={() => navigate("/")}
            >
              Go Home
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Plant Analysis">
      <div className="p-4">
        <div className="mb-4">
          <h2 className="font-heading font-semibold text-lg text-neutral-900 mb-1">Plant Analysis</h2>
          <p className="text-sm text-neutral-600">Here's what we found about your {plant.name}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <img 
            src={analysis.imageUrl || plant.imageUrl} 
            alt={`${plant.name} with analysis overlay`} 
            className="w-full h-auto"
          />
          
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-neutral-900">{plant.species || plant.name}</h3>
              <span className={`text-xs font-medium ${
                analysis.healthScore < 40 ? 'bg-red-500' : 
                analysis.healthScore < 70 ? 'bg-amber-500' : 
                'bg-primary'
              } text-white px-2 py-0.5 rounded-full`}>
                {analysis.healthScore < 40 ? 'Needs Attention' : 
                 analysis.healthScore < 70 ? 'Fair' : 
                 'Healthy'}
              </span>
            </div>
            
            <div className="space-y-4">
              {/* Health Indicators */}
              <div>
                <p className="text-sm font-medium text-neutral-900 mb-2">Plant Health Score</p>
                <div className="flex items-center">
                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <Progress value={analysis.healthScore} />
                  </div>
                  <span className="ml-2 text-sm font-medium text-neutral-600">{analysis.healthScore}%</span>
                </div>
              </div>
              
              {/* Analysis Results */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-neutral-50 rounded-lg p-3">
                  <div className="flex items-center mb-1">
                    <span className={`material-icons ${getTextColor(analysis.waterLevel)} mr-1 text-sm`}>water_drop</span>
                    <h4 className="text-sm font-medium text-neutral-900">Water Level</h4>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="w-16 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getStatusColor(analysis.waterLevel)} w-[${analysis.waterLevel}%] progress-bar-fill`}
                        style={{ width: `${analysis.waterLevel}%` }}
                      ></div>
                    </div>
                    <span className={`text-xs ${getTextColor(analysis.waterLevel)} font-medium`}>
                      {getStatusText(analysis.waterLevel)}
                    </span>
                  </div>
                </div>
                
                <div className="bg-neutral-50 rounded-lg p-3">
                  <div className="flex items-center mb-1">
                    <span className={`material-icons ${getTextColor(analysis.lightLevel)} mr-1 text-sm`}>wb_sunny</span>
                    <h4 className="text-sm font-medium text-neutral-900">Light Level</h4>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="w-16 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getStatusColor(analysis.lightLevel)} w-[${analysis.lightLevel}%] progress-bar-fill`}
                        style={{ width: `${analysis.lightLevel}%` }}
                      ></div>
                    </div>
                    <span className={`text-xs ${getTextColor(analysis.lightLevel)} font-medium`}>
                      {getStatusText(analysis.lightLevel)}
                    </span>
                  </div>
                </div>
                
                <div className="bg-neutral-50 rounded-lg p-3">
                  <div className="flex items-center mb-1">
                    <span className={`material-icons ${getTextColor(analysis.nutrientLevel)} mr-1 text-sm`}>grass</span>
                    <h4 className="text-sm font-medium text-neutral-900">Nutrients</h4>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="w-16 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getStatusColor(analysis.nutrientLevel)} w-[${analysis.nutrientLevel}%] progress-bar-fill`}
                        style={{ width: `${analysis.nutrientLevel}%` }}
                      ></div>
                    </div>
                    <span className={`text-xs ${getTextColor(analysis.nutrientLevel)} font-medium`}>
                      {getStatusText(analysis.nutrientLevel)}
                    </span>
                  </div>
                </div>
                
                <div className="bg-neutral-50 rounded-lg p-3">
                  <div className="flex items-center mb-1">
                    <span className={`material-icons ${getTextColor(analysis.pestRisk, true)} mr-1 text-sm`}>bug_report</span>
                    <h4 className="text-sm font-medium text-neutral-900">Pest Risk</h4>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="w-16 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getStatusColor(analysis.pestRisk, true)} w-[${analysis.pestRisk}%] progress-bar-fill`}
                        style={{ width: `${analysis.pestRisk}%` }}
                      ></div>
                    </div>
                    <span className={`text-xs ${getTextColor(analysis.pestRisk, true)} font-medium`}>
                      {getStatusText(100 - analysis.pestRisk)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {analysis.issues && analysis.issues.length > 0 && (
          <div className="space-y-2 mb-6">
            <h3 className="font-medium text-neutral-900">Issues Detected</h3>
            
            {analysis.issues.map((issue: any, index: number) => (
              <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
                <div className="flex">
                  <span className={`material-icons ${issue.icon === 'water_drop' ? 'text-red-500' : 'text-amber-500'} mr-2`}>
                    {issue.icon}
                  </span>
                  <div>
                    <h4 className="font-medium text-neutral-900">{issue.name}</h4>
                    <p className="text-sm text-neutral-600">{issue.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <button 
          className="w-full bg-primary hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors mb-4"
          onClick={handleSeeRecommendations}
        >
          See Care Recommendations
        </button>
      </div>
    </AppLayout>
  );
}
