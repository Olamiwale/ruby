"use client"

import { useEffect } from "react";
import Hero from "../app/features/home/Hero";
import Shop from "../app/features/home/Shop";
import VideoPlayer from "../app/features/home/VideoPlayer";

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div>
      <Hero />
      <Shop />
      <VideoPlayer />
    </div>
  );
}
  