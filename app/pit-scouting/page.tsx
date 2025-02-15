"use client";

import React, { useState, useRef } from 'react';
import { Camera, X } from 'lucide-react';
import { Input, Button, Card } from "@heroui/react";
import { Checkbox } from "@/components/ui/checkbox";

export default function PitScouting() {
  const [photos, setPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection or capture
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Convert FileList to Array and process each file
    const fileArray = Array.from(files);
    
    // Process each file
    fileArray.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    // Reset the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");
    // Add your form submission logic here
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
                />
              </div>

              {/* Robot Capabilities Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-google-sans font-semibold">Robot Capabilities</h2>
                <div className="grid gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="amp" />
                    <label
                      htmlFor="amp"
                      className="text-sm font-medium leading-none"
                    >
                      能放 Amp
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="speaker" />
                    <label
                      htmlFor="speaker"
                      className="text-sm font-medium leading-none"
                    >
                      能投 Speaker
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="trap" />
                    <label
                      htmlFor="trap"
                      className="text-sm font-medium leading-none"
                    >
                      能放 Trap
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