import { useRef, useEffect } from "react";
import Image from "next/image";
import Data from "../../data/collection.json";


export default function VideoPlayer() {

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(()=>{
    const v = videoRef.current;
    if(!v) return;
    v.muted = true;
    v.volume = 0;
    v.setAttribute("muted", "")
  },[]);

 
  return (
    <> 
    <div className="w-full p-5 space-x-5 flex justify-center bg-gray-200">
   
      <div className="relative w-1/2 lg:h-[600px] mx-auto">
        <video
          className="w-full object-cover h-full rounded-lg shadow-lg"
          ref={videoRef}
          loop  
          autoPlay 
          muted
          playsInline
          controls={false} 
          >
          <source 
          src="https://res.cloudinary.com/ddyppmxp1/video/upload/v1770344648/v28_v4wu8k.mp4" 
          type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 text-white text-sm p-6"></div>
      </div>

      <div className="relative w-1/2 lg:h-[600px] mx-auto">
        <video
          className="w-full object-cover h-full rounded-lg shadow-lg"
          ref={videoRef}
          loop  
          autoPlay 
          muted
          playsInline
          controls={false}
          src="https://res.cloudinary.com/ddyppmxp1/video/upload/v1770344648/v28_v4wu8k.mp4"
        
          >
         
          Your browser does not support the video tag.
        </video>

        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 text-white text-sm p-6"></div>
      </div>


     
    </div>
     <div className="w-[90%] m-auto mb-10 overflow-hidden">
  <div className="flex gap-4 p-4 overflow-x-auto scroll-smooth no-scrollbar">
    {Data.map((items, i) => (
      <div key={i} className="flex-shrink-0">
        <Image
          src={items.image}
          width={300}
          height={300}
          className="w-[300px] h-[300px] object-cover"
          alt="img"
        />
      </div>
    ))}
  </div>
</div>

    </>
  );
}
