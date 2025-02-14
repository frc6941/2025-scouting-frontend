"use client";

import { useForm } from "@/app/scouting/contexts/FormContent";
import { useRouter } from "next/navigation";
import {Chip} from "@heroui/chip";
import {Ban, Minus, PersonStanding, Plus, ShoppingBasket} from "lucide-react"
import { Card, Button, Tooltip } from "@heroui/react";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";

export default function Step3() {
  // @ts-ignore
  const { formData, setFormData } = useForm();
  const router = useRouter();

  const handleNext = () => {
    router.push("/scouting/step4");
  };

  function handleGoBack(){
    router.push("/scouting/step2");
  }

  const handleCoralIncrement = (level: string) => {
    setFormData(prev => ({
      ...prev,
      autonomous: {
        ...prev.autonomous,
        coralCount: {
          ...prev.autonomous.coralCount,
          [level.toLowerCase()]: prev.autonomous.coralCount[level.toLowerCase()] + 1
        }
      }
    }));
  };

  const handleCoralDecrement = (level: string) => {
    setFormData(prev => ({
      ...prev,
      autonomous: {
        ...prev.autonomous,
        coralCount: {
          ...prev.autonomous.coralCount,
          [level.toLowerCase()]: Math.max(0, prev.autonomous.coralCount[level.toLowerCase()] - 1)
        }
      }
    }));
  };

  const handleAlgaeIncrement = (key: string) => {
    setFormData(prev => ({
      ...prev,
      autonomous: {
        ...prev.autonomous,
        algaeCount: {
          ...prev.autonomous.algaeCount,
          [key]: prev.autonomous.algaeCount[key] + 1
        }
      }
    }));
  };

  const handleAlgaeDecrement = (key: string) => {
    setFormData(prev => ({
      ...prev,
      autonomous: {
        ...prev.autonomous,
        algaeCount: {
          ...prev.autonomous.algaeCount,
          [key]: Math.max(0, prev.autonomous.algaeCount[key] - 1)
        }
      }
    }));
  };

  const CounterButton = ({placement, onClick, icon: Icon, label }) => (
    <Tooltip content={label}
             classNames={{content:"text-default-600 bg-white dark:bg-black"}}
             placement={placement}>
      <button
        onClick={onClick}
        className="p-2 rounded-full hover:bg-gray-400  transition-all duration-200 active:bg-gray-400"
        aria-label={label}
      >
        <Icon className="text-default-600" />
      </button>
    </Tooltip>
  );

  const Counter = ({ label, value, onIncrement, onDecrement }) => (
    <Card className="w-full p-4 backdrop-blur-sm hover:shadow-md transition-shadow duration-200 border-1  border-black dark:border-white">
      <div className="flex items-center justify-between gap-4">
        <CounterButton
          placement="right"
          onClick={onDecrement}
          icon={RemoveIcon}
          label={`Decrease ${label}`}
        />
        <div className="flex-1 text-center">
          <span className="text-sm text-default-600 block">{label}</span>
          <span className="text-2xl font-google-sans">{value}</span>
        </div>
        <CounterButton
          placement="left"
          onClick={onIncrement}
          icon={AddIcon}
          label={`Increase ${label}`}
        />
      </div>
    </Card>
  );

  const AlgaeCounter = ({label, value, onIncrement, onDecrement, icon: Icon }) => (
    <Card  className="w-full p-4 backdrop-blur-md hover:shadow-lg transition-shadow duration-200 border-1  border-black dark:border-white">
      <div className="flex items-center justify-between gap-4">
        <CounterButton
          placement="right"
          onClick={onDecrement}
          icon={RemoveIcon}
          label={`Decrease ${label}`}
        />
        <div className="flex-1 flex items-center justify-center gap-3">
          <Icon className="text-default-600 text-2xl" />
          <div className="text-center">
            <span className="text-sm text-default-600 block">{label}</span>
            <span className="text-2xl font-google-sans">{value}</span>
          </div>
        </div>
        <CounterButton
          placement="left"
          onClick={onIncrement}
          icon={AddIcon}
          label={`Increase ${label}`}
        />
      </div>
    </Card>
  );

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-google-sans font-extrabold mb-1">Autonomous</h1>
        <div className="h-1 w-16 bg-primary mx-auto rounded-full"/>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Coral Section */}
        <section className="space-y-6">
          <h2 className="text-xl font-google-sans ml-4">Coral</h2>
          <div className="space-y-4">
            {['L4', 'L3', 'L2', 'L1'].map(level => (
              <Counter
                key={level}
                label={level}
                value={formData.autonomous.coralCount[level.toLowerCase()]}
                onIncrement={() => handleCoralIncrement(level)}
                onDecrement={() => handleCoralDecrement(level)}
              />
            ))}
            <Counter
              label="Miss"
              value={formData.autonomous.coralCount.dropOrMiss}
              onIncrement={() => handleCoralIncrement('dropOrMiss')}
              onDecrement={() => handleCoralDecrement('dropOrMiss')}
            />
          </div>
        </section>

        {/* Algae Section */}
        <section className="space-y-6">
          <h2 className="text-xl font-google-sans ml-4">Algae</h2>
          <div className="space-y-4">
            {[
              { key: 'netShot', label: 'Net Shot', Icon: ShoppingBasket },
              { key: 'processor', label: 'Processor', Icon: PersonStanding },
              { key: 'dropOrMiss', label: 'Miss', Icon: Ban }
            ].map(({ key, label, Icon }) => (
              <AlgaeCounter
                key={key}
                label={label}
                value={formData.autonomous.algaeCount[key]}
                icon={Icon}
                onIncrement={() => handleAlgaeIncrement(key)}
                onDecrement={() => handleAlgaeDecrement(key)}
              />
            ))}
          </div>
        </section>
      </div>

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
          onPress={handleNext}
          size="lg"
        >
          Next
        </Button>
      </div>
    </main>
  )}