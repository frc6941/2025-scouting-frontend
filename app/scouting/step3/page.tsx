"use client";

import { useForm } from "@/app/scouting/contexts/FormContent";
import { useRouter } from "next/navigation";
import {Chip} from "@heroui/chip";
import {Ban, Minus, PersonStanding, Plus, ShoppingBasket} from "lucide-react";
import {Button} from "@heroui/react";

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

  return (
    <main>
      <div className="flex justify-center pr-40 font-extrabold"><p className="text-5xl">Autonomous</p></div>
      <div className="flex justify-center gap-14">
        {/*leftSide*/}
        <div className="flex flex-col justify-between gap-6">
          <div className="flex justify-center  font-extrabold"><p className="text-3xl pl-14">Coral</p></div>
          <div className="flex justify-between gap-4">
            <div className="pt-1.5" onClick={()=>{setFormData({...formData, autonomous: {...formData.autonomous, coralCount: {...formData.autonomous.coralCount, l4: formData.autonomous.coralCount.l4-1}}})}}><Chip variant="shadow" className="py-6"><Minus /></Chip></div>
            <Chip size="lg" variant="shadow" className="px-16 py-8 text-2xl">L4:<strong>{formData.autonomous.coralCount.l4}</strong></Chip>
            <div className="pt-2" onClick={()=>{setFormData({...formData, autonomous: {...formData.autonomous, coralCount: {...formData.autonomous.coralCount, l4: formData.autonomous.coralCount.l4+1}}})}}><Chip variant="shadow" className="py-6"><Plus /></Chip></div>
          </div>
          <div className="flex justify-between gap-4">
            <div className="pt-1.5" onClick={()=>{setFormData({...formData, autonomous: {...formData.autonomous, coralCount: {...formData.autonomous.coralCount, l3: formData.autonomous.coralCount.l3-1}}})}}><Chip variant="shadow" className="py-6"><Minus /></Chip></div>
            <Chip size="lg" variant="shadow" className="px-16 py-8 text-2xl">L3: <strong>{formData.autonomous.coralCount.l3}</strong></Chip>
            <div className="pt-2" onClick={()=>{setFormData({...formData, autonomous: {...formData.autonomous, coralCount: {...formData.autonomous.coralCount, l3: formData.autonomous.coralCount.l3+1}}})}}><Chip variant="shadow" className="py-6"><Plus /></Chip></div>
          </div>
          <div className="flex justify-between gap-4">
            <div className="pt-1.5" onClick={()=>{setFormData({...formData, autonomous: {...formData.autonomous, coralCount: {...formData.autonomous.coralCount, l2: formData.autonomous.coralCount.l2-1}}})}}><Chip variant="shadow" className="py-6"><Minus /></Chip></div>
            <Chip size="lg" variant="shadow" className="px-16 py-8 text-2xl">L2: <strong>{formData.autonomous.coralCount.l2}</strong></Chip>
            <div className="pt-2" onClick={()=>{setFormData({...formData, autonomous: {...formData.autonomous, coralCount: {...formData.autonomous.coralCount, l2: formData.autonomous.coralCount.l2+1}}})}}><Chip variant="shadow" className="py-6"><Plus /></Chip></div>
          </div>
          <div className="flex justify-between gap-4">
            <div className="pt-1.5" onClick={()=>{setFormData({...formData, autonomous: {...formData.autonomous, coralCount: {...formData.autonomous.coralCount, l1: formData.autonomous.coralCount.l1-1}}})}}><Chip variant="shadow" className="py-6"><Minus /></Chip></div>
            <Chip size="lg" variant="shadow" className="px-16 py-8 text-2xl">L1: <strong>{formData.autonomous.coralCount.l1}</strong></Chip>
            <div className="pt-2" onClick={()=>{setFormData({...formData, autonomous: {...formData.autonomous, coralCount: {...formData.autonomous.coralCount, l1: formData.autonomous.coralCount.l1+1}}})}}><Chip variant="shadow" className="py-6"><Plus /></Chip></div>
          </div>
          <div className="flex justify-between gap-4">
            <div className="pt-1.5" onClick={()=>{setFormData({...formData, autonomous: {...formData.autonomous, coralCount: {...formData.autonomous.coralCount, dropOrMiss: formData.autonomous.coralCount.dropOrMiss-1}}})}}><Chip variant="shadow" className="py-6"><Minus /></Chip></div>
            <Chip size="lg" variant="shadow" className="px-12 py-8 text-2xl">Miss: <strong>{formData.autonomous.coralCount.dropOrMiss}</strong></Chip>
            <div className="pt-2" onClick={()=>{setFormData({...formData, autonomous: {...formData.autonomous, coralCount: {...formData.autonomous.coralCount, dropOrMiss: formData.autonomous.coralCount.dropOrMiss+1}}})}}><Chip variant="shadow" className="py-6"><Plus /></Chip></div>
          </div>
        </div>
        {/*rightSide*/}
        <div className="flex flex-col  gap-4">
          <div className="flex justify-center  font-extrabold"><p className="text-3xl pl-14">Algae</p></div>
          <div className="flex justify-between gap-6">
            <div className="pt-10" onClick={()=>{setFormData({...formData, autonomous: {...formData.autonomous, algaeCount: {...formData.autonomous.algaeCount, netShot: formData.autonomous.algaeCount.netShot-1}}})}}><Chip variant="shadow" className="py-6"><Minus /></Chip></div>
            <Chip size="lg" variant="shadow" className="px-10 py-16 text-2xl"><strong>Net Shot</strong><div className="flex justify-start gap-3"><ShoppingBasket size={40}/><strong className="pt-1">:</strong> <strong className="pt-1.5">{formData.autonomous.algaeCount.netShot}</strong></div></Chip>
            <div className="pt-10" onClick={()=>{setFormData({...formData, autonomous: {...formData.autonomous, algaeCount: {...formData.autonomous.algaeCount, netShot: formData.autonomous.algaeCount.netShot+1}}})}}><Chip variant="shadow" className="py-6"><Plus /></Chip></div>
          </div>
          <div className="flex justify-between gap-6">
            <div className="pt-10" onClick={()=>{setFormData({...formData, autonomous: {...formData.autonomous, algaeCount: {...formData.autonomous.algaeCount, processor: formData.autonomous.algaeCount.processor-1}}})}}><Chip variant="shadow" className="py-6"><Minus /></Chip></div>
            <Chip size="lg" variant="shadow" className="px-10 py-16 text-2xl"><strong>Processor</strong><div className="flex justify-start gap-3"><PersonStanding  size={40}/><strong className="pt-1">:</strong> <strong className="pt-1.5">{formData.autonomous.algaeCount.processor}</strong></div></Chip>
            <div className="pt-10" onClick={()=>{setFormData({...formData, autonomous: {...formData.autonomous, algaeCount: {...formData.autonomous.algaeCount, processor: formData.autonomous.algaeCount.processor+1}}})}}><Chip variant="shadow" className="py-6"><Plus /></Chip></div>
          </div>
          <div className="flex justify-between gap-6">
            <div className="pt-10" onClick={()=>{setFormData({...formData, autonomous: {...formData.autonomous, algaeCount: {...formData.autonomous.algaeCount, dropOrMiss: formData.autonomous.algaeCount.dropOrMiss-1}}})}}><Chip variant="shadow" className="py-6"><Minus /></Chip></div>
            <Chip size="lg" variant="shadow" className="px-10 py-16 text-2xl"><strong>Miss</strong><div className="flex justify-start gap-3"><Ban  size={40}/><strong className="pt-1">:</strong> <strong className="pt-1.5">{formData.autonomous.algaeCount.dropOrMiss}</strong></div></Chip>
            <div className="pt-10" onClick={()=>{setFormData({...formData, autonomous: {...formData.autonomous, algaeCount: {...formData.autonomous.algaeCount, dropOrMiss: formData.autonomous.algaeCount.dropOrMiss+1}}})}}><Chip variant="shadow" className="py-6"><Plus /></Chip></div>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-[480px] mt-8">
        <Button  variant="bordered" className="px-8 py-8 text-2xl" onPressStart={handleGoBack}>
          Back
        </Button>
        <Button  variant="bordered" className="px-8 py-8 text-2xl"
                 onPressStart={handleNext}>
          Proceed
        </Button>
      </div>
    </main>
  );
}
