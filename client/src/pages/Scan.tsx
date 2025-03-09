import { useState } from "react";
import { useLocation } from "wouter";
import AppLayout from "@/components/layouts/AppLayout";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function Scan() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [showTutorial, setShowTutorial] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  // Mock mutation for uploading plant image for analysis
  const uploadImageMutation = useMutation({
    mutationFn: async (imageData: FormData) => {
      // This would be a real API call in a production app
      // For now, we'll simulate a successful response
      
      // simulate delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return {
        plantId: 1, // Normally this would come from the API
        success: true
      };
    },
    onSuccess: (data) => {
      navigate(`/analysis/${data.plantId}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to analyze image. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleCapture = () => {
    // In a real app, this would access the camera
    // For demo, we'll use a mock image
    setImageSrc("https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=400&h=600");
    
    setTimeout(() => {
      // Simulate form data
      const formData = new FormData();
      formData.append('plantImage', 'mock-image-data');
      uploadImageMutation.mutate(formData);
    }, 1000);
  };

  const openLibrary = () => {
    // In a real app, this would open the device's photo library
    toast({
      title: "Photo Library",
      description: "This would open your photo library in a real app."
    });
  };

  const switchCamera = () => {
    toast({
      title: "Camera Switch",
      description: "This would switch between front and back cameras in a real app."
    });
  };

  const openTutorial = () => {
    setShowTutorial(true);
  };

  const closeTutorial = () => {
    setShowTutorial(false);
  };

  return (
    <AppLayout title="Scan Plant">
      <section className="h-full flex flex-col">
        <div className="p-4 pb-0">
          <h2 className="font-heading font-semibold text-lg text-neutral-900 mb-1">Scan Plant</h2>
          <p className="text-sm text-neutral-600 mb-4">Take a photo to analyze your plant's health</p>
        </div>
        
        <div className="flex-1 relative">
          {/* Camera Viewfinder */}
          <div className="h-full bg-black flex items-center justify-center overflow-hidden">
            <div className="relative w-full">
              {imageSrc ? (
                <img 
                  src={imageSrc} 
                  alt="Camera viewfinder showing a plant" 
                  className="w-full h-auto"
                />
              ) : (
                <img 
                  src="https://images.unsplash.com/photo-1619285022251-ee3f00f05969?auto=format&fit=crop&w=400&h=600" 
                  alt="Camera viewfinder showing a plant" 
                  className="w-full h-auto"
                />
              )}
              
              {/* Overlay frame */}
              <div className="absolute inset-0 border-2 border-white border-opacity-50 m-8 rounded-lg"></div>
              
              {/* Scanning animation */}
              <div className="absolute inset-x-0 top-1/2 h-0.5 bg-primary animate-pulse"></div>
              
              {/* Helper text */}
              <div className="absolute bottom-8 inset-x-0 text-center">
                <p className="text-white text-sm bg-black bg-opacity-40 inline-block px-3 py-1 rounded-full">
                  {uploadImageMutation.isPending 
                    ? "Analyzing plant..." 
                    : "Center your plant in the frame"}
                </p>
              </div>
            </div>
          </div>
          
          {/* Camera Controls */}
          <div className="absolute bottom-0 inset-x-0 p-6 flex items-center justify-between">
            <button 
              className="bg-white rounded-full p-3 shadow-lg"
              onClick={openLibrary}
              disabled={uploadImageMutation.isPending}
            >
              <span className="material-icons text-neutral-600">photo_library</span>
            </button>
            
            <button 
              className="camera-trigger bg-white rounded-full p-5 shadow-lg"
              onClick={handleCapture}
              disabled={uploadImageMutation.isPending}
            >
              <span className="material-icons text-primary text-3xl">
                {uploadImageMutation.isPending ? "hourglass_top" : "camera"}
              </span>
            </button>
            
            <button 
              className="bg-white rounded-full p-3 shadow-lg"
              onClick={switchCamera}
              disabled={uploadImageMutation.isPending}
            >
              <span className="material-icons text-neutral-600">flip_camera_ios</span>
            </button>
          </div>
        </div>
      </section>

      {/* Tutorial Overlay */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 flex items-end">
          <div className="w-full bg-white rounded-t-xl p-6 slide-up">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-heading font-semibold text-xl">How to Scan Your Plant</h3>
              <button className="p-1" onClick={closeTutorial}>
                <span className="material-icons">close</span>
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex">
                <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                  <span className="text-primary font-medium">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900 mb-1">Frame Your Plant</h4>
                  <p className="text-sm text-neutral-600">Center your plant in the viewfinder, making sure the leaves are visible.</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                  <span className="text-primary font-medium">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900 mb-1">Good Lighting</h4>
                  <p className="text-sm text-neutral-600">Ensure your plant is well-lit for better analysis results.</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                  <span className="text-primary font-medium">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900 mb-1">Capture Clearly</h4>
                  <p className="text-sm text-neutral-600">Tap the center button to take the photo and wait for analysis.</p>
                </div>
              </div>
            </div>
            
            <button 
              className="w-full bg-primary hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              onClick={closeTutorial}
            >
              Got It, Let's Scan!
            </button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
