'use client'

import React from 'react';
import { Textarea, Button, Select, SelectItem, Card } from "@heroui/react";
import { useForm } from "@/app/scouting/contexts/FormContent";
import { useRouter } from "next/navigation";
import { Description as DescriptionIcon, Flag as FlagIcon } from "@mui/icons-material";

const Step5 = () => {
  // @ts-ignore
  const { formData, setFormData } = useForm();
  const router = useRouter();

  const handleNext = () => {
    router.push("/scouting/step5");
  };

  const handleGoBack = () => {
    router.push("/scouting/step4");
  };

  const endGameStates = [
    { key: "park", label: "Park" },
    { key: "deepClimb", label: "Deep Climb" },
    { key: "shallowClimb", label: "Shallow Climb" },
    { key: "failed", label: "Failed" },
    { key: "playedDefense", label: "Played Defense" },
  ];

  function onSubmit() {
    console.log(formData);
  }

  return (
    <main className="container mx-auto px-4 py-8 h-full">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-google-sans mb-1 font-extrabold">End Game</h1>
        <div className="h-1 w-16 bg-primary mx-auto rounded-full"/>
      </div>

      {/* Main Content */}
      <Card className="p-6 backdrop-blur-md border-1 border-black dark:border-white h-full">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <FlagIcon className="text-default-600" />
              <h2 className="text-xl font-google-sans">Final Position</h2>
            </div>
            <Select
              items={endGameStates}
              className="w-full"
              variant="underlined"
              description="end game position"
              label="select end game state"
              classNames={{
                listbox: "bg-white dark:bg-black", // Add background to dropdown
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
                input: "resize-y ",
              }}
            />
          </div>
        </div>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button
          variant="flat"
          className="font-google-sans px-6 py-2"
          onPress={handleGoBack}
        >
          Back
        </Button>
        <Button
          color="primary"
          className="font-google-sans px-6 py-2"
          onPress={onSubmit}
        >
          Submit
        </Button>
      </div>
    </main>
  );
};

export default Step5;