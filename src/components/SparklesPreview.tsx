"use client";
import React from "react";
import { SparklesCore } from "./ui/sparkles";

export function SparklesPreview() {
  return (
    <div className="h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="md:text-6xl top-[40%] absolute text-4xl lg:text-8xl font-bold text-center text-white animate-glow z-40 [font-family:'Mars',Helvetica]">
          Rotharc
        </h1>
        <p className="top-1/2 absolute text-xl md:text-2xl lg:text-4xl text-white/80 [font-family:'Montserrat_Alternates',Helvetica] z-20">
          technologies
        </p>
                        {/* Gradients */}
                        <div className="absolute top-[60%] z-40 w-1/2 h-full">
                <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-3/4" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
        </div>
      </div>

      <div className="w-full h-full relative z-20">
        {/* Core component */}
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={200}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
        {/* Radial Gradient to prevent sharp edges */}
        <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(500px_500px_at_center,transparent_50%,white)]"></div>
      </div>

        <p className="absolute top-[70%] z-40 text-lg md:text-2xl text-white/70 [font-family:'Montserrat_Alternates',Helvetica]">
          Découvrez le futur de l'humanité augmentée
        </p>
    </div>
  );
}
