import Image from "next/image";
import { ModeToggle } from "@/components/ModeToggle";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 relative">
    <div className="absolute bottom-8 right-8 ">
      <h1>hi</h1>
    <ModeToggle/>
    </div>
    </main>
  );
}