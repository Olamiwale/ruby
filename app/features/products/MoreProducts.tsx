"use client";

import { useEffect, useState } from "react";
import Data from "@/app/data/products.json";
import slugify from "@/app/lib/utils/slugify";

interface Product {
  name: string;
  images: string[];
  price: string | number;
  [key: string]: any;
}

function getRandomItems(arr: Product[], num: number): Product[] {
  return [...arr].sort(() => 0.5 - Math.random()).slice(0, num);
}

export default function MoreProduct() {
  const [random, setRandom] = useState<Product[]>([]);

  useEffect(() => {
    setRandom(getRandomItems(Data as Product[], 3));
  }, []);

  return (
    <div className="p-8 flex justify-center flex-col items-center">
      <div className="justify-center items-center flex flex-col uppercase">
        <p className="font-semibold tracking-widest text-sm border-2 p-3 mb-3">
          related products
        </p>
      </div>
      <div className="grid grid-cols-3 justify-between gap-4">
        {random.map((item, id) => (
          <div key={id} className="flex flex-col justify-center p-5">
            <a
              className="h-[150px] md:w-full md:h-[300px]"
              href={`/product/${slugify(item.name)}`}
            >
              <img src={item.images[1]} className="w-full h-full" alt={item.name} />
            </a>
            <p className="py-3 text-center text-[10px]">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}