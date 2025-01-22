import Image from "next/image";
import NavBar from "@/components/NavBar";
import {ThemeSwitcher} from "@/components/ThemeSwitcher";

export default function Home() {
  return (
    <div className="flex flex-col justify-between pl-16 pt-10" suppressHydrationWarning>
      <div className="justify-center pr-36 flex"><p className="font-extrabold text-6xl">Main Page</p></div>
      <div className="absolute right-8 top-[23px]">
        <ThemeSwitcher></ThemeSwitcher>
      </div>
    </div>
  );
}
