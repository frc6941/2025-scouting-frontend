// app/layout.js
import { FormProvider } from "@/app/scouting/contexts/FormContent";
import {ThemeSwitcher} from "@/components/ThemeSwitcher";

export default function RootLayout({ children }) {
  return (
      <main className="pl-16 pt-4" suppressHydrationWarning>
        <FormProvider>{children}</FormProvider>

      </main>
  );
}
