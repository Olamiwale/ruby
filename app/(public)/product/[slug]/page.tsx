"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import slugify from "../../../lib/utils/slugify";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../lib/redux/actions";
import Data from "@/app/products.json";
import MoreProducts from "../../../../components/products/MoreProducts";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  originalPrice?: number;
  sizes?: string[];
  color?: string[];
  col?: string;
  description?: string;
  details?: any[];
  category: string;
}

export default function ProductDetailsPage() {
  const { slug } = useParams() as { slug: string };
  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState("");
  const dispatch = useDispatch();

  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setColor] = useState("");

  // set default color once product is loaded
  useEffect(() => {
    if (product) {
      const colors = product.color || (product.col ? [product.col] : []);
      if (colors.length && !selectedColor) {
        setColor(colors[0]);
      }
    }
  }, [product, selectedColor]);

  //fetching the products
  useEffect(() => {
    const product = Data.find((item) => slugify(item.name) === slug);
    if (product) {
      setProduct(product);
      setMainImage(product.images[0]);
    }
  }, [slug]);

  if (!product) {
    return <p>Product not found</p>;
  }

  //add product to the cart
  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      images: product.images,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
    };

    dispatch(addToCart(cartItem));
    alert("Product added to cart!");
    setQuantity(1);
    setSelectedSize("");
  };

  return (
    <div className="pt-[50px]">
      <div className="flex md:flex-row flex-col gap-8 max-w-6xl mx-auto px-4 mb-12">
        {/* Left - Image Gallery */}
        <div className="md:w-1/2 flex flex-col gap-3">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full rounded-lg object-cover h-96"
          />
          <div className="flex gap-2">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`thumb-${i}`}
                onClick={() => setMainImage(img)}
                className="w-20 h-20 rounded cursor-pointer border-2 border-gray-300 hover:border-black"
              />
            ))}
          </div>
        </div>

        {/* Right - Details */}
        <div className="md:w-1/2 flex flex-col gap-6">
          <h1 className="text-3xl font-bold text-black">{product.name}</h1>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-black">₦{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-lg text-gray-400 line-through">₦{product.originalPrice.toLocaleString()}</span>
            )}
          </div>

          {/* Size selection */}
          <div>
            <p className="font-semibold mb-2">Size</p>
            <div className="flex flex-wrap gap-2">
              {(product.sizes || ["xs", "s", "m", "l", "xl", "xxl"]).map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded uppercase text-sm font-semibold transition ${
                    selectedSize === size
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-gray-300 hover:border-black"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color selection */}
          {(product.color || product.col) && (
            <div>
              <p className="font-semibold mb-2">Color</p>
              <div className="flex flex-wrap gap-2">
                {(product.color || (product.col ? [product.col] : [])).map((col) => (
                  <button
                    key={col}
                    onClick={() => setColor(col)}
                    className={`px-4 py-2 border rounded text-sm font-semibold transition ${
                      selectedColor === col
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-gray-300 hover:border-black"
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <p className="font-semibold mb-2">Quantity</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 border rounded">
                −
              </button>
              <span className="text-lg font-semibold">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 border rounded">
                +
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-black text-white py-3 rounded font-semibold hover:bg-gray-800 transition"
          >
            Add to Cart
          </button>

          {product.description && (
            <div>
              <p className="font-semibold mb-2">Description</p>
              <p className="text-gray-600 text-sm">{product.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* More Products */}
      <MoreProducts />
    </div>
  );
}
