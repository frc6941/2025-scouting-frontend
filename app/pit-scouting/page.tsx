"use client";

import React, { useState, useRef } from 'react';
import { Camera, X } from 'lucide-react';
import { Input, Button, Card } from "@heroui/react";
import { Checkbox } from "@/components/ui/checkbox";
import { getCookie } from 'cookies-next/client';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '@/components/NavBar';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';

export default function PitScouting() {
  const [photos, setPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [formData, setFormData] = useState({
    teamNumber: '',
    capabilities: {
      amp: false,
      speaker: false,
      trap: false
    },
    chassisType: '',
    cycleTime: '',
    autoType: '',
    photos: [] as string[]
  });

  // Add image compression function
  const compressImage = (base64: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        // Reduce maximum dimensions
        const maxWidth = 600;  // Reduced from 800
        const maxHeight = 600; // Reduced from 800
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round(height * maxWidth / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round(width * maxHeight / height);
            height = maxHeight;
          }
        }
        
        // Create a temporary canvas for multi-step compression
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d')!;
        
        // Step 1: Initial resize
        tempCanvas.width = width;
        tempCanvas.height = height;
        tempCtx.drawImage(img, 0, 0, width, height);
        
        // Step 2: Further reduce final dimensions
        canvas.width = Math.round(width * 0.8);  // 20% smaller
        canvas.height = Math.round(height * 0.8);
        
        // Step 3: Final draw with smoothing
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
        
        // Step 4: Export with lower quality
        resolve(canvas.toDataURL('image/jpeg', 0.4)); // Reduced quality from 0.6 to 0.4
      };
    });
  };

  // Handle file selection or capture
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string);
        setPhotos(prev => [...prev, compressed]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = getCookie("Authorization");
      if (!token) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Not authenticated. Please login first.",
        });
        return;
      }

      const submitData = {
        teamNumber: parseInt(formData.teamNumber),
        capabilities: formData.capabilities,
        chassisType: formData.chassisType,
        cycleTime: parseInt(formData.cycleTime),
        autoType: formData.autoType,
        photos: photos.map(photo => photo.split(',')[1].substring(0, 100000)) // Limit image size
      };

      console.log("Submitting data:", submitData);  

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pit-scouting/create`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit');
      }

      const data = await response.json();
      toast({
        title: "Success!",
        description: "Form submitted successfully",
      });
      
      setTimeout(() => {
        router.push("/");
      }, 1500);

    } catch (error) {
      console.error("Submit error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit form",
      });
    }
  };

  // Handle input changes
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      capabilities: {
        ...prev.capabilities,
        [field]: checked
      }
    }));
  };

  // Remove a photo
  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl lg:max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-google-sans font-extrabold mb-3">Pit Scouting</h1>
        <div className="h-1 w-16 bg-primary mx-auto rounded-full"/>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="p-6 lg:p-8 border-1 border-black dark:border-white rounded-2xl">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Team Info Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-google-sans font-semibold">Team Information</h2>
                <Input 
                  type="number" 
                  label="Team Number"
                  placeholder="Enter team number" 
                  variant="bordered"
                  className="max-w-xs"
                  value={formData.teamNumber}
                  onChange={(e) => handleInputChange('teamNumber', e.target.value)}
                />
              </div>

              {/* Robot Capabilities Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-google-sans font-semibold">Robot Capabilities</h2>
                <div className="grid gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="amp"
                      checked={formData.capabilities.amp}
                      onCheckedChange={(checked) => handleCheckboxChange('amp', checked as boolean)}
                    />
                    <label
                      htmlFor="amp"
                      className="text-sm font-medium leading-none"
                    >
                      L4
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="speaker"
                      checked={formData.capabilities.speaker}
                      onCheckedChange={(checked) => handleCheckboxChange('speaker', checked as boolean)}
                    />
                    <label
                      htmlFor="speaker"
                      className="text-sm font-medium leading-none"
                    >
                      Netshot
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="trap"
                      checked={formData.capabilities.trap}
                      onCheckedChange={(checked) => handleCheckboxChange('trap', checked as boolean)}
                    />
                    <label
                      htmlFor="trap"
                      className="text-sm font-medium leading-none"
                    >
                      Processor
                    </label>
                  </div>
                </div>
              </div>

              {/* Chassis Type Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-google-sans font-semibold">底盘类型</h2>
                <Input 
                  label="Chassis Type"
                  placeholder="Enter chassis type" 
                  variant="bordered"
                  className="max-w-xs"
                  value={formData.chassisType}
                  onChange={(e) => handleInputChange('chassisType', e.target.value)}
                />
              </div>

              {/* Cycle Time Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-google-sans font-semibold">Cycle 时间</h2>
                <Input 
                  type="number" 
                  label="Cycle Time"
                  placeholder="Enter cycle time" 
                  variant="bordered"
                  className="max-w-xs"
                  value={formData.cycleTime}
                  onChange={(e) => handleInputChange('cycleTime', e.target.value)}
                />
              </div>

              {/* Auto Type Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-google-sans font-semibold">自动类型</h2>
                <Input 
                  label="Auto Type"
                  placeholder="Enter auto type" 
                  variant="bordered"
                  className="max-w-xs"
                  value={formData.autoType}
                  onChange={(e) => handleInputChange('autoType', e.target.value)}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <h2 className="text-xl font-google-sans font-semibold">Robot Photos</h2>
              
              <div className="flex flex-wrap gap-4">
                {/* Existing Photos */}
                {photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={photo} 
                      alt={`Robot photo ${index + 1}`} 
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <Button
                      isIconOnly
                      size="sm"
                      color="danger"
                      variant="solid"
                      onPress={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                {/* Add Photo Button */}
                <div className="w-32 h-32">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  <Button
                    variant="bordered"
                    onPress={() => fileInputRef.current?.click()}
                    className="w-full h-full flex flex-col items-center justify-center gap-2"
                  >
                    <Camera className="w-6 h-6" />
                    <span className="text-sm">Take Photo</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            variant="flat"
            type="reset"
            className="font-google-sans px-8"
          >
            重置
          </Button>
          <Button
            color="primary"
            type="submit"
            className="font-google-sans px-8"
          >
            提交
          </Button>
        </div>
      </form>
    </div>
  );
} 