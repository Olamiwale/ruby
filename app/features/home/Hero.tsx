import { useRef, useEffect } from "react";


export default function VideoPlayer() {

  const videoRef = useRef(null);

  useEffect(()=>{
    const v = videoRef.current;
    if(!v) return;
    v.muted = true;
    v.volume = 0;
    v.setAttribute("muted", "")
  },[]);


  return (
    <>
      <div className="w-full flex max-sm:h-screen justify-center bg-gray-200">
        
      <div className="relative w-1/2 lg:h-[600px] mx-auto">
          <video
          className="w-full object-cover h-full shadow-lg"
          ref={videoRef}
          src="https://res.cloudinary.com/ddyppmxp1/video/upload/v1770804544/THE_LADY_T_COLLECTION_Q1_2026-_THE_VISIONARY_10-02-26_1_oufhbs.mp4"
          muted
          loop  
          autoPlay 
          playsInline
          controls={false}
          >
           
            Your browser does not support the video tag.
          </video>

          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 text-white text-sm p-6"></div>

        </div>

       

        <div className="relative w-1/2 lg:h-[600px] mx-auto">
          <video
          className="w-full object-cover h-full shadow-lg"
          ref={videoRef}
          muted
          loop  
          autoPlay 
          playsInline
          controls={false} >

            <source src="https://res.cloudinary.com/ddyppmxp1/video/upload/v1770810665/tcl_jbim2t.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 text-white text-sm p-6"></div>
        </div>
      


      </div>

      <div className="absolute md:top-[200px] top-[400px] w-full flex items-center justify-center px-4">
        <div className="bg-white/30 opacity-80 p-10 items-center flex flex-col rounded-md">
          <h1 className="text-center text-xl md:text-6xl font-extrabold text-black/70 tracking-wider">
            Discover <span className="text-wine/90">Royal Elegance</span> with
            <span className="text-wine/90"> Ruby</span>
          </h1>
          <p className="mt-4 tracking-wider text-sm md:text-xl text-center text-black max-w-xl">
            Step into luxury with our finest collections and redefine your style
            with
            <span className="font-semibold text-wine ml-2">sophistication</span>
          </p>

          {/*<button className="max-sm:hidden mt-8 bg-wine hover:bg-light-wine text-white tracking-wider px-10 w-[250px] py-3 rounded-full text-xl font-semibold transition duration-500 ease-in-out transform hover:scale-105 shadow-lg">
            <a href="/product">Explore Now</a>
          </button>*/}
        </div>
      </div>
    </>
  );
}
