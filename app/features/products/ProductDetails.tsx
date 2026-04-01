"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import slugify from "@/app/lib/utils/slugify";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addToCart } from "@/app/lib/redux/actions";
import Data from "@/app/data/products.json";
import MoreProducts from "@/app/features/products/MoreProducts";
import Accordion from "@/app/components/ui/Accordion";

interface Product {
  id: string;
  name: string;
  price: string | number;
  images: string[];
  color?: string[];
  col?: string;
  [key: string]: any;
}

export default function ProductDetails() {
  const params = useParams();
  const slug = params?.slug as string;
  const dispatch = useDispatch();

  // Find product using memoization
  const product = useMemo(
    () => (Data as Product[]).find((item) => slugify(item.name) === slug) ?? null,
    [slug]
  );

  // Derive colors from product
  const colors: string[] = product?.color || (product?.col ? [product.col] : []);

  // Initialize state
  const [mainImage, setMainImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedColor, setColor] = useState<string>(() => colors[0] ?? "");

  // Update mainImage when product changes
  useEffect(() => {
    if (product) setMainImage(product.images[0]); // eslint-disable-line react-hooks/exhaustive-deps
  }, [product?.id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    const numericPrice = Number(product!.price.toString().replace(/,/g, ""));

    const cartItem = {
      ...(product as Required<typeof product>),
      price: numericPrice,
      size: selectedSize,
      quantity,
      color: selectedColor,
    };

    dispatch(addToCart(cartItem));
    alert("Product added to cart!");
  };

  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    <div>
      <div className="p-8 mb-8 flex md:flex-row flex-col justify-between pt-[40px] gap-20">
        <div className="flex md:flex-row flex-col justify-evenly items-start md:w-1/2">

          {/* Mobile title */}
          <div className="text-2xl space-y-3 md:hidden mb-10">
            <h1 className="font-bold text-xl tracking-widest">{product.name}</h1>
            <p className="text-xl tracking-widest leading-3">₦ {product.price}</p>
          </div>

          {/* Images */}
          <div className="md:ml-4 items-center flex-col-reverse md:flex-row flex justify-center">
            <div className="flex md:flex-col gap-2 md:mr-5 w-fit justify-center mt-5">
              {product.images.map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  width={130}
                  height={130}
                  className="w-32 h-32 md:h-[100px] md:w-40 lg:w-32 cursor-pointer object-cover"
                  onClick={() => setMainImage(image)}
                  alt={`Thumbnail ${index + 1}`}
                />
              ))}
            </div>
            <div>
              <Image
                src={mainImage}
                width={500}
                height={550}
                className="lg:w-[500px] lg:h-[550px] md:w-[380px] w-full object-cover"
                alt={product.name}
              />
            </div>
          </div>
        </div>

        {/* Product details */}
        <div className="flex flex-1 flex-col gap-4 md:w-1/2">

          {/* Desktop title */}
          <div className="text-2xl space-y-3 md:flex flex-col hidden">
            <h1 className="md:text-3xl font-bold leading-[150%] tracking-[0.1em]">
              {product.name}
            </h1>
            <p className="tracking-widest">₦ {product.price}.00</p>
          </div>

          <div className="md:mt-0 flex flex-col md:justify-center md:items-start uppercase leading-5 md:w-full">

            {/* Size selector */}
            <div className="w-full">
              <p className="underline py-4 font-bold">Available in size</p>
            </div>
            <ul className="flex gap-3">
              {["S", "M", "L", "XL", "2XL"].map((size) => (
                <li
                  key={size}
                  className={`cursor-pointer font-semibold uppercase border-[2px] border-black/40 py-2 text-center px-5 w-[80px] md:w-[40px] ${
                    selectedSize === size ? "bg-black text-white" : ""
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </li>
              ))}
            </ul>

            {/* Color selector */}
            <div className="w-full">
              <p className="underline mt-10 font-bold">Available in Colour:</p>
            </div>
            <ul className="flex gap-3 mt-5">
              {colors.map((color) => (
                <li
                  key={color}
                  className={`cursor-pointer font-semibold uppercase border-[2px] border-black/40 py-2 text-center px-5 ${
                    selectedColor === color ? "bg-black text-white" : ""
                  }`}
                  onClick={() => setColor(color)}
                >
                  {color}
                </li>
              ))}
            </ul>

            {/* Quantity */}
            <div className="flex flex-col">
              <label className="py-4 text-sm font-bold underline">Quantity</label>
              <input
                type="number"
                className="border-2 p-3"
                min={1}
                value={quantity}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setQuantity(Math.max(1, Number(e.target.value)))
                }
              />
            </div>

            {/* Custom measurement */}
            <div className="mt-16 flex items-center mb-10">
              <Link
                href="https://wa.me/+2347072971284?text= Welcome to MapbyRuby. Where we value creativity, quality, and self-expression."
                className="text-white text-sm tracking-widest font-semibold px-5 p-3 bg-black hover:bg-black/90 rounded-full"
              >
                Click here
              </Link>
              <p className="ml-2 font-semibold cursor-pointer text-sm tracking-widest">
                for custom measurement
              </p>
            </div>

            {/* Add to cart */}
            <button
              className="mt-8 w-full hover:bg-black/90 transition-all duration-500 bg-black p-3 text-white font-bold uppercase"
              onClick={handleAddToCart}
            >
              Add to cart
            </button>
          </div>

          <div className="flex flex-col">
            <div className="bg-gray-100">
              <Accordion />
            </div>
            <div className="flex gap-2 justify-between mt-[40px] uppercase font-bold text-white">
              <a
                href="tel:+2347033821612"
                className="p-3 bg-yellow-900 hover:bg-yellow-600 rounded-md w-full flex items-center space-x-5 justify-center"
              >
                <img src="/phoneImg.webp" className="w-4" alt="phone" />
                <p className="tracking-widest font-medium text-white text-sm">
                  Call to order
                  <span className="tracking-widest ml-3 font-bold">+234 707 297 1284</span>
                </p>
              </a>
            </div>
          </div>
        </div>
      </div>
      <MoreProducts />
    </div>
  );
}