import { Progress } from "@/components/ui/progress";
import { Plant } from "@shared/schema";

type PlantCardProps = {
  plant: Plant;
  onClick?: () => void;
  onUpdatePhoto?: (plantId: number) => void;
}

export default function PlantCard({ plant, onClick }: PlantCardProps) {
  // Calculate status based on plant health indicators
  const getStatus = () => {
    if (plant.waterLevel < 30) return { type: 'water', icon: 'water_drop', text: 'Thirsty', color: 'text-red-500', bgColor: 'bg-red-500' };
    if (plant.lightLevel < 30) return { type: 'light', icon: 'wb_sunny', text: 'Needs light', color: 'text-amber-500', bgColor: 'bg-amber-500' };
    if (plant.nutrientLevel < 30) return { type: 'nutrient', icon: 'eco', text: 'Needs nutrients', color: 'text-amber-500', bgColor: 'bg-amber-500' };
    if (plant.pestRisk > 70) return { type: 'pest', icon: 'bug_report', text: 'Pest risk', color: 'text-red-500', bgColor: 'bg-red-500' };
    if (plant.healthScore > 80) return { type: 'healthy', icon: 'check_circle', text: 'Healthy', color: 'text-primary', bgColor: 'bg-primary' };
    return { type: 'ok', icon: 'info', text: 'Ok', color: 'text-blue-500', bgColor: 'bg-blue-500' };
  };

  const status = getStatus();

  return (
    <div 
      className="plant-card bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-all hover:shadow-md"
      onClick={onClick}
    >
      <div className="relative h-32">
        <img 
          src={plant.imageUrl || `https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=400&h=400`} 
          alt={plant.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm">
          <span className={`material-icons ${status.color} text-sm`}>{status.icon}</span>
        </div>
      </div>
      <div className="p-3">
        <h4 className="font-medium text-neutral-900">{plant.name}</h4>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center">
            <span className={`material-icons ${status.color} text-sm mr-1`}>{status.icon}</span>
            <span className="text-xs text-neutral-600">{status.text}</span>
          </div>
          <Progress className="w-16 h-1.5" value={plant.healthScore} />
        </div>
      </div>
    </div>
  );
}
