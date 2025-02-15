'use client';

import { useForm } from "@/app/scouting/contexts/FormContent";
import { useRouter } from "next/navigation";
import { Button, Card, Tooltip } from "@heroui/react";
import Image from 'next/image';

export default function GameLayout() {
  const router = useRouter();
  // @ts-ignore
  const { formData, setFormData } = useForm();

  const handleButtonClick = (buttonId) => {
    console.log(buttonId)
    setFormData({
      ...formData,
      autonomous: {
        ...formData.autonomous,
        autoStart: `${buttonId}`
      }
    });
  };

  const handleNext = () => {
    router.push("/scouting/step3");
  };

  const handleGoBack = () => {
    router.push("/scouting/step1");
  };

  const OverlayButton = ({ id, position }) => (
    <Tooltip
      content={`Position ${id}`}
      classNames={{content:"text-default-600 bg-white dark:bg-black"}}
      placement="right"
    >
      <button
        className={`absolute ${position} w-[28%] h-[13%] 
                   rounded-lg border-1 border-transparent
                   hover:border-primary hover:bg-primary/20
                   transition-all duration-200`}
        onClick={() => handleButtonClick(id)}
        aria-label={`Position ${id}`}
      />
    </Tooltip>
  );

  return (
    <main className="container mx-auto px-6 py-12 max-w-7xl min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-google-sans font-extrabold mb-3">
          Robot Starting Position
        </h1>
        <div className="h-1 w-16 bg-primary mx-auto rounded-full"/>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Left Section - Image and Buttons */}
        <section>
          <Card className="p-8 backdrop-blur-md hover:shadow-xl transition-shadow duration-300 border-1 border-black dark:border-white">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/site.png"
                alt="Game Field Layout"
                fill
                className="object-contain"
                priority
              />

              <OverlayButton id={1} position="top-[12%] left-[9%]" />
              <OverlayButton id={2} position="top-[25%] left-[9%]" />
              <OverlayButton id={3} position="top-[38%] left-[9%]" />
              <OverlayButton id={4} position="top-[55%] left-[9%]" />
              <OverlayButton id={5} position="top-[68%] left-[9%]" />
              <OverlayButton id={6} position="top-[81%] left-[9%]" />
            </div>
          </Card>
        </section>

        {/* Right Section - Instructions */}
        <section>
          <Card className="p-8 backdrop-blur-md hover:shadow-xl transition-shadow duration-300 border-1 border-black dark:border-white">
            <div className="space-y-8">
              <div>
                <h2 className="text-xl text-default-600 font-google-sans font-extrabold mb-4">
                  Instructions
                </h2>
                <p className="text-default-600 font-google-sans text-lg">
                  Click on one of the highlighted positions on the field to indicate your robot's starting position.
                </p>
              </div>

              {formData?.autonomous?.autoStart && (
                <div className="mt-6">
                  <h2 className="text-xl text-default-600 font-google-sans font-extrabold mb-4">
                    Selected Position
                  </h2>
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <p className="text-default-600 font-google-sans text-lg">
                      Position {formData.autonomous.autoStart}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </section>
      </div>

      <div className="flex justify-between mt-16 px-6">
        <Button
          variant="flat"
          size="lg"
          className="font-google-sans px-12 py-6 text-xl"
          onPress={handleGoBack}
        >
          Back
        </Button>
        <Button
          color="primary"
          size="lg"
          className="font-google-sans px-12 py-6 text-xl"
          onPress={handleNext}
        >
          Next
        </Button>
      </div>
    </main>
  );
}