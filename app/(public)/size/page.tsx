import sizeImage from "../assets/mapsc.webp";

export default function Size() {
  return (

    <div>
       <div className="bg-wine text-white py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-8 text-center  ">
          <h1 className="text-4xl max-sm:text-2xl md:text-5xl font-bold tracking-tight mb-4">
            Size Chart
          </h1>
          <p className="text-lg max-sm:text-sm max-w-2xl mx-auto">
            Where creativity, elegance, and individuality come together
          </p>
        </div>
      </div>

   
    <div className="flex flex-col items-center justify-center p-8">
      
      <p className="text-3xl max-sm:text-xl font-bold text-center mb-8">Size Chart</p>

      <div className="">
        <img src="../sc.webp" className="w-[600px] h-[600px] max-sm:h-[400px] max-sm:w-[450px]" />
        <div>
          <p>NB</p>
          <li>The measurement table is a UK size chart format</li>
          <li>Measurement are in INCHES</li>
          <li>
            We recommend a Higher size for sizes in US format i.e For a US 10, a
            UK 12 is more suitable
          </li>
          <li>All pants have a standard length of 47 INCHES</li>
        </div>
      </div>

     
    </div> 
    
    </div>
  );
}
