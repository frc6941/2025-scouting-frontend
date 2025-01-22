'use client'

import React from 'react';
import {Textarea} from "@heroui/input";
import { useForm } from "@/app/scouting/contexts/FormContent";
import { useRouter } from "next/navigation";
import {Button, Select, SelectItem} from "@heroui/react";



const Step5 = () => {

  // @ts-ignore
  const { formData, setFormData } = useForm();
  const router = useRouter();

  const handleNext = () => {
    router.push("/scouting/step5");
  };
  function handleGoBack(){
    router.push("/scouting/step4");
  }

  const animals = [
    {key: "cat", label: "Park"},
    {key: "dog", label: "Deep Climb"},
    {key: "elephant", label: "Shallow Climb"},
    {key: "lion", label: "Failed"},
    {key: "tiger", label: "Played Defense"},
  ];

  function onSubmit(){
    console.log(formData)
  }

  return (
    <div className=" flex justify-center gap-5 ">
      <Select
        className="max-w-xs"
        placeholder="Select a state"
        onSelect={(value)=>{}}
      >
        {animals.map((animal) => (
          <SelectItem key={animal.key}>{animal.label}</SelectItem>
        ))}
      </Select>
      <Textarea
        isClearable
        className="max-w-xs"
        label="Description"
        placeholder="Description"
        value = {formData.endAndAfterGame.comments}
        onChange={(e)=>{setFormData({...formData, endAndAfterGame:{...formData.endAndAfterGame, comments: e.target.value}})}}
        variant="bordered"
        onClear={()=>setFormData({...formData, endAndAfterGame:{...formData.endAndAfterGame, comments: ""}})}
      />
      <div className="flex justify-center gap-[480px] mt-8">
        <Button  variant="bordered" className="px-8 py-8 text-2xl" onPressStart={handleGoBack}>
          Back
        </Button>
        <Button  variant="bordered" className="px-8 py-8 text-2xl"
                 type="submit"
                 onPressStart={onSubmit}>
          Proceed
        </Button>
      </div>    </div>
  );
};

export default Step5;
