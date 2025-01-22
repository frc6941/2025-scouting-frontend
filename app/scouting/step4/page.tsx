// // app/form/step4/page.js
// "use client";
//
// import { useForm } from "@/app/scouting/contexts/FormContent";
//
// export default function Step4() {
//   // @ts-ignore
//   const { formData } = useForm();
//
//   const handleSubmit = () => {
//     console.log("Submitted Data:", formData);
//     alert("Form Submitted!");
//   };
//
//   return (
//     <div>
//       <h1>Step 4: Review & Submit</h1>
//       <p>Name: {formData.name}</p>
//       <p>Email: {formData.email}</p>
//       <p>Age: {formData.age}</p>
//       <p>Address: {formData.address}</p>
//       <button onClick={handleSubmit}>Submit</button>
//     </div>
//   );
// }
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
    router.push("/scouting/step5");
  };

  function handleGoBack(){
    router.push("/scouting/step3");
  }

  return (
    <main>
      <div className="flex justify-center pr-40 font-extrabold"><p className="text-5xl">Teleop</p></div>
      <div className="flex justify-center gap-14">
        {/*leftSide*/}
        <div className="flex flex-col justify-between gap-6">
          <div className="flex justify-center  font-extrabold"><p className="text-3xl pl-14">Coral</p></div>
          <div className="flex justify-between gap-4">
            <div className="pt-1.5" onClick={()=>{setFormData({...formData, teleop: {...formData.teleop, coralCount: {...formData.teleop.coralCount, l4: formData.teleop.coralCount.l4-1}}})}}><Chip variant="shadow" className="py-6"><Minus /></Chip></div>
            <Chip size="lg" variant="shadow" className="px-16 py-8 text-2xl">L4:<strong>{formData.teleop.coralCount.l4}</strong></Chip>
            <div className="pt-2" onClick={()=>{setFormData({...formData, teleop: {...formData.teleop, coralCount: {...formData.teleop.coralCount, l4: formData.teleop.coralCount.l4+1}}})}}><Chip variant="shadow" className="py-6"><Plus /></Chip></div>
          </div>
          <div className="flex justify-between gap-4">
            <div className="pt-1.5" onClick={()=>{setFormData({...formData, teleop: {...formData.teleop, coralCount: {...formData.teleop.coralCount, l3: formData.teleop.coralCount.l3-1}}})}}><Chip variant="shadow" className="py-6"><Minus /></Chip></div>
            <Chip size="lg" variant="shadow" className="px-16 py-8 text-2xl">L3: <strong>{formData.teleop.coralCount.l3}</strong></Chip>
            <div className="pt-2" onClick={()=>{setFormData({...formData, teleop: {...formData.teleop, coralCount: {...formData.teleop.coralCount, l3: formData.teleop.coralCount.l3+1}}})}}><Chip variant="shadow" className="py-6"><Plus /></Chip></div>
          </div>
          <div className="flex justify-between gap-4">
            <div className="pt-1.5" onClick={()=>{setFormData({...formData, teleop: {...formData.teleop, coralCount: {...formData.teleop.coralCount, l2: formData.teleop.coralCount.l2-1}}})}}><Chip variant="shadow" className="py-6"><Minus /></Chip></div>
            <Chip size="lg" variant="shadow" className="px-16 py-8 text-2xl">L2: <strong>{formData.teleop.coralCount.l2}</strong></Chip>
            <div className="pt-2" onClick={()=>{setFormData({...formData, teleop: {...formData.teleop, coralCount: {...formData.teleop.coralCount, l2: formData.teleop.coralCount.l2+1}}})}}><Chip variant="shadow" className="py-6"><Plus /></Chip></div>
          </div>
          <div className="flex justify-between gap-4">
            <div className="pt-1.5" onClick={()=>{setFormData({...formData, teleop: {...formData.teleop, coralCount: {...formData.teleop.coralCount, l1: formData.teleop.coralCount.l1-1}}})}}><Chip variant="shadow" className="py-6"><Minus /></Chip></div>
            <Chip size="lg" variant="shadow" className="px-16 py-8 text-2xl">L1: <strong>{formData.teleop.coralCount.l1}</strong></Chip>
            <div className="pt-2" onClick={()=>{setFormData({...formData, teleop: {...formData.teleop, coralCount: {...formData.teleop.coralCount, l1: formData.teleop.coralCount.l1+1}}})}}><Chip variant="shadow" className="py-6"><Plus /></Chip></div>
          </div>
          <div className="flex justify-between gap-4">
            <div className="pt-1.5" onClick={()=>{setFormData({...formData, teleop: {...formData.teleop, coralCount: {...formData.teleop.coralCount, dropOrMiss: formData.teleop.coralCount.dropOrMiss-1}}})}}><Chip variant="shadow" className="py-6"><Minus /></Chip></div>
            <Chip size="lg" variant="shadow" className="px-12 py-8 text-2xl">Miss: <strong>{formData.teleop.coralCount.dropOrMiss}</strong></Chip>
            <div className="pt-2" onClick={()=>{setFormData({...formData, teleop: {...formData.teleop, coralCount: {...formData.teleop.coralCount, dropOrMiss: formData.teleop.coralCount.dropOrMiss+1}}})}}><Chip variant="shadow" className="py-6"><Plus /></Chip></div>
          </div>
        </div>
        {/*rightSide*/}
        <div className="flex flex-col  gap-4">
          <div className="flex justify-center  font-extrabold"><p className="text-3xl pl-14">Algae</p></div>
          <div className="flex justify-between gap-6">
            <div className="pt-10" onClick={()=>{setFormData({...formData, teleop: {...formData.teleop, algaeCount: {...formData.teleop.algaeCount, netShot: formData.teleop.algaeCount.netShot-1}}})}}><Chip variant="shadow" className="py-6"><Minus /></Chip></div>
            <Chip size="lg" variant="shadow" className="px-10 py-16 text-2xl"><strong>Net Shot</strong><div className="flex justify-start gap-3"><ShoppingBasket size={40}/><strong className="pt-1">:</strong> <strong className="pt-1.5">{formData.teleop.algaeCount.netShot}</strong></div></Chip>
            <div className="pt-10" onClick={()=>{setFormData({...formData, teleop: {...formData.teleop, algaeCount: {...formData.teleop.algaeCount, netShot: formData.teleop.algaeCount.netShot+1}}})}}><Chip variant="shadow" className="py-6"><Plus /></Chip></div>
          </div>
          <div className="flex justify-between gap-6">
            <div className="pt-10" onClick={()=>{setFormData({...formData, teleop: {...formData.teleop, algaeCount: {...formData.teleop.algaeCount, processor: formData.teleop.algaeCount.processor-1}}})}}><Chip variant="shadow" className="py-6"><Minus /></Chip></div>
            <Chip size="lg" variant="shadow" className="px-10 py-16 text-2xl"><strong>Processor</strong><div className="flex justify-start gap-3"><PersonStanding  size={40}/><strong className="pt-1">:</strong> <strong className="pt-1.5">{formData.teleop.algaeCount.processor}</strong></div></Chip>
            <div className="pt-10" onClick={()=>{setFormData({...formData, teleop: {...formData.teleop, algaeCount: {...formData.teleop.algaeCount, processor: formData.teleop.algaeCount.processor+1}}})}}><Chip variant="shadow" className="py-6"><Plus /></Chip></div>
          </div>
          <div className="flex justify-between gap-6">
            <div className="pt-10" onClick={()=>{setFormData({...formData, teleop: {...formData.teleop, algaeCount: {...formData.teleop.algaeCount, dropOrMiss: formData.teleop.algaeCount.dropOrMiss-1}}})}}><Chip variant="shadow" className="py-6"><Minus /></Chip></div>
            <Chip size="lg" variant="shadow" className="px-10 py-16 text-2xl"><strong>Miss</strong><div className="flex justify-start gap-3"><Ban  size={40}/><strong className="pt-1">:</strong> <strong className="pt-1.5">{formData.teleop.algaeCount.dropOrMiss}</strong></div></Chip>
            <div className="pt-10" onClick={()=>{setFormData({...formData, teleop: {...formData.teleop, algaeCount: {...formData.teleop.algaeCount, dropOrMiss: formData.teleop.algaeCount.dropOrMiss+1}}})}}><Chip variant="shadow" className="py-6"><Plus /></Chip></div>
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
