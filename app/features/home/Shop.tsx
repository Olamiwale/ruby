import Image from "next/image";
import Link from "next/link";
import Data from "@/app/data/products.json";
import slugify from "../../lib/utils/slugify";
//import { addToCart } from "../redux/actions";
//import { useDispatch } from "react-redux";

export default function Shop() {
  // const dispatch = useDispatch();

  return (
    <>
      <div className="bg-white px-6 py-16 lg:px-20">
        <div className="text-center flex justify-center items-center flex-col mb-12">
          <h2 className="text-sm border flex justify-center border-gray-400 w-[200px] p-3 font-bold uppercase tracking-widest text-gray-900">
            OUR COLLECTIONS
          </h2>
          <p className="mt-4 text-gray-600 text-[9px] tracking-wide">
            Discover the latest trends and timeless essentials, curated for you.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4 ">
          {Data.slice(0, 8).map((item, id) => (
            <div key={id} className="group relative bg-gray-50 cursor-pointer">
              <Link
                href={`/product/${slugify(item.name)}`}
                className="block overflow-hidden rounded-2xl">
                <Image
                  src={item.images[0]}
                  alt={item.name}
                  width={320}
                  height={320}
                  className="h-[320px] w-full object-cover transition duration-500 ease-in-out group-hover:scale-105"
                  //loading="eager"
                  priority={id === 0}
                />
              </Link>

              <div className="mt-4 space-y-1">
                <h3 className="text-xs font-medium text-gray-900 group-hover:underline">
                  {item.name}
                </h3>
                <p className="text-sm font-semibold tracking-wide text-gray-900">
                  ₦ {Number(item.price).toLocaleString("en-NG")}
                </p>

                <p className="text-xs text-gray-500 line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Link
            href="/product"
            className="inline-block rounded-full bg-black px-8 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-gray-800 hover:scale-105">
            Shop the Collection
          </Link>
        </div>
      </div>
    </>
  );
}
