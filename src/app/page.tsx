import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import TypewriterTitle from "@/components/TypewriterTitle";

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div
        className="absolute inset-0 bg-gradient-to-r from-blue-200 to-purple-200 backdrop-filter backdrop-blur-sm"
        style={{ zIndex: -1 }}
      ></div>

      <div className="text-center text-black z-10">
        <h1 className="font-semibold text-7xl">
          Potion{" "}<span className="text-purple-500 font-bold">AI</span>
        </h1>
        <div className="mt-4"></div>
        <div className="flex items-center justify-center">
          <img
            src="https://cdn3.emoji.gg/emojis/6197-purple-potion.png"
            alt="Potion Emoji"
            className="w-8 h-8 mr-2"
          />
          <h2 className="font-semibold text-3xl text-slate-700">
            <TypewriterTitle />
          </h2>
        </div>
        <div className="mt-8"></div>

        <div className="flex justify-center">
          <Link href="/dashboard">
            <Button className="bg-purple-500">
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" strokeWidth={3} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
