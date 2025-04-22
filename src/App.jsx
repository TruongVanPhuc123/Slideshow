import React from "react";
import Slideshow from "./components/slideshow/index";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  return (
    <main className="container mx-auto py-10 px-4">
      <Toaster position="top-center" richColors />
      <h1 className="text-3xl font-bold mb-6 text-center">Image Slideshow</h1>
      <Slideshow />
    </main>
  );
}
