'use client'

import React from 'react';
import { Textarea, Button, Select, SelectItem, Card } from "@heroui/react";
import { useForm } from "@/app/scouting/contexts/FormContent";
import { useRouter } from "next/navigation";
import { Description as DescriptionIcon, Flag as FlagIcon } from "@mui/icons-material";
import { useToast } from "@/hooks/use-toast";
import { getCookie } from 'cookies-next/client';

const Step5 = () => {
  // @ts-ignore
  const { formData, setFormData } = useForm();
  const router = useRouter();
  const { toast } = useToast();

  const handleGoBack = () => {
    router.push("/scouting/step4");
  };

  const endGameStates = [
    { key: "PARK", label: "Park" },
    { key: "DEEP", label: "Deep Climb" },
    { key: "SHALLOW", label: "Shallow Climb" },
    { key: "FAILED", label: "Failed" },
    { key: "PLAYED_DEFENSE", label: "Played Defense" },
  ];

  async function onSubmit() {
    console.log(formData);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scouting/record`, {
        method: "POST",
        headers: {"Authorization": `Bearer ${getCookie("Authorization")}`},
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data);
      if (!(data.message)) {
        toast({
          title: "Success!",
          description: "Form submitted successfully",
        });
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
      else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message,
        });
      }

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Something went wrong, contact the admin",
      });
    }
  }

  return (
    <main className="container mx-auto px-4 py-8 h-full">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-google-sans mb-1 font-extrabold">End Game</h1>
        <div className="h-1 w-16 bg-primary mx-auto rounded-full"/>
      </div>

      {/* Main Content */}
      <Card className="p-6 backdrop-blur-md border-1 border-primary dark:border-white h-full">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FlagIcon className="text-default-600" />
              <h2 className="text-xl font-google-sans">Final Position</h2>
            </div>
            <Select
              items={endGameStates}
              label="select end game state"
              className="w-full"
              variant="underlined"
              description="end game position"
              selectedKeys={formData.endAndAfterGame.endGameState}
              onSelectionChange={(e) => {
                console.log(e.currentKey)
                setFormData({
                  ...formData,
                  endAndAfterGame: {
                    ...formData.endAndAfterGame,
                    stopStatus: e.currentKey
                  }
                });
              }}
              classNames={{
                listbox: "bg-white dark:bg-black",
                trigger: "",
              }}
            >
              {(state) => (
                <SelectItem key={state.key}>{state.label}</SelectItem>
              )}
            </Select>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <DescriptionIcon className="text-default-600" />
              <h2 className="text-xl font-google-sans">Additional Notes</h2>
            </div>
            <Textarea
              variant="underlined"
              description="Add any additional observations..."
              label="Comments"
              value={formData.endAndAfterGame.comments}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  endAndAfterGame: {
                    ...formData.endAndAfterGame,
                    comments: e.target.value
                  }
                });
              }}
              className="w-full"
              minRows={24}
              classNames={{
                input: "resize-y",
              }}
            />
          </div>
        </div>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-12 px-4">
        <Button
          variant="flat"
          className="font-google-sans px-12"
          size="lg"
          onPress={handleGoBack}
        >
          Back
        </Button>
        <Button
          color="primary"
          className="font-google-sans px-12 py-6"
          size="lg"
          type="submit"
          onPress={onSubmit}
        >
          Submit
        </Button>
      </div>
    </main>
  );
};

export default Step5;