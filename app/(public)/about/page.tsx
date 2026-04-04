import Image from "next/image";
import aboutImage from "@/app/assets/aboutMe.webp";

export default function About() {
  return (
    <div className="bg-white">
     
      <div className="bg-[#7a0d20]  py-16 md:py-20">
        <div className="max-w-6xl text-white mx-auto px-6 md:px-8 text-center  ">
          <h1 className="text-2xl max-sm:text-2xl md:text-3xl font-bold tracking-tight mb-4">
            About MapbyRuby
          </h1>
          <p className="text-sm max-sm:text-sm max-w-xl mx-auto">
            Where creativity, elegance, and individuality come together
          </p>
        </div>
      </div>

    
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-16 md:py-20">
        <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-center">
          <div className="w-full md:w-2/3 flex justify-center">
            <Image
              src={aboutImage}
              alt="Ruby"
              className="rounded-lg shadow-xl max-w-lg w-full object-cover"
            />
          </div>

          <div className="w-full md:w-2/3">
            <h2 className="text-2xl font-bold mb-6">Meet Ruby</h2>

            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p className=" text-sm">
                I&apos;m Ruby, the founder and creative mind behind Millennial Apparel By Ruby.
              </p>
              <p className=" text-sm">
                With a background in fashion and a lifelong passion for design, I created 
                MapbyRuby as a space where creativity, elegance, and individuality come 
                together. Every piece is guided by a love for beautiful details, confident 
                silhouettes, and styles that allow women to express themselves effortlessly.
              </p>
              <p className=" text-sm">
                MapbyRuby was born from the belief that fashion should feel personal, 
                inspiring, and accessible whether you&apos;re dressing for everyday moments 
                or unforgettable occasions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* What We Create Section */}
      <div className="bg-gray-50 py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center">What We Create</h2>
          <div className="max-w-3xl mx-auto space-y-4 text-gray-700 leading-relaxed">
            <p className=" text-sm">
              At MapbyRuby, we design and curate women&apos;s wear for every mood, moment, 
              and lifestyle.
            </p>
            <p className=" text-sm">
              From refined everyday essentials to statement looks, our collections span 
              across all areas of fashion, bringing together luxury appeal and wearable 
              comfort. We work with a wide range of styles and influences, drawing 
              inspiration both locally and internationally to deliver pieces that feel 
              modern yet timeless.
            </p>
          </div>
        </div>
      </div>

      {/* What Sets Us Apart */}
      <div className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center">What Sets Us Apart</h2>
          <div className="max-w-3xl mx-auto space-y-4 text-gray-700 leading-relaxed mb-12">
            <p className=" text-sm">
              Creativity and uniqueness are at the heart of everything we do.
            </p>
            <p className=" text-sm">
              Each design is thoughtfully developed to stand out while remaining elegant, 
              versatile, and flattering. We focus on quality craftsmanship, distinctive 
              touches, and silhouettes that celebrate women of all ages and styles.
            </p>
            <p className=" text-sm">
              Whether you&apos;re shopping for something subtle or bold, casual or luxurious, 
              MapbyRuby is designed to meet you where you are.
            </p>
          </div>

          {/* Vision Box */}
          <div className="bg-black text-white p-8 md:p-12 rounded-lg max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
            <p className="leading-relaxed  text-sm">
              To become a trusted destination for women&apos;s fashion known for originality, 
              refined design, and a seamless shopping experience. Based in Nigeria and 
              serving customers locally, we are proud to contribute to the growing fashion 
              culture at home while staying connected to global trends and inspiration.
            </p>
          </div>
        </div>
      </div>

    
      <div className="bg-gray-50 py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Have questions or feedback? We&apos;d love to hear from you.
          </p>

          <div className="space-y-3 text-sm text-gray-700">
            
            <p className="flex items-center justify-center gap-2">
              <span className="font-semibold">Email:</span> Mapbyruby@gmail.com
            </p>

            <p className="flex items-center justify-center gap-2">
              <span className="font-semibold">Phone:</span> +234 707 297 1284
            </p>
            <p className="flex items-center justify-center gap-2">
              <span className="font-semibold">Address:</span> 5B, Chris Efunyemi Onanuga Street, Lekki Phase 1
            </p>
          </div>
        </div>
      </div>

    
      <div className="py-16 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6 md:px-8 text-center">
          <h2 className="text-2xl font-bold mb-6">Welcome to MapbyRuby</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Thank you for being part of our journey. Explore our collections and 
            discover fashion that is expressive, elevated, and unmistakably Ruby.
          </p>
        </div>
      </div>
    </div>
  );
}
 