"use client"

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Data from "@/app/data/products.json";
import slugify from "../../lib/utils/slugify";
//import { useNavigate } from "react-router-dom";
import { useRouter } from "next/navigation";

export default function Product() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategory, setFilteredCategory] = useState("");


  const router = useRouter();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = Data.filter((item) => {
    return (
      (!filteredCategory || item.category === filteredCategory) &&
      (!searchTerm ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Shop</h1>

     
      <div className="flex md:flex-row flex-col md:space-y-0 space-y-8 justify-between items-center mb-8">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearch}
          className="p-2 border border-gray-300 rounded w-full md:max-w-md"
        />

        <div className="flex justify-center">
          <button 
            onClick={() => setFilteredCategory("")}
            className={`p-2 mr-4 tracking-widest px-4 rounded text-xs ${!filteredCategory 
            ? "bg-wine text-white" : "border"}`}>
             All
          </button>
          
          <button
            onClick={() => setFilteredCategory("gown")}
            className={`p-2 mr-4 tracking-widest rounded text-xs px-4 ${filteredCategory === "gown" ? "bg-wine text-white"
                : "border"}`}>
            Gown
          </button>
          <button
            onClick={() => setFilteredCategory("jumpsuit")}
            className={`p-2 mr-4 tracking-widest rounded text-xs px-4 ${filteredCategory === "jumpsuit" ? "bg-wine text-white"
                : "border"}`}>
            Jumpsuit
          </button>

          <button
            onClick={() => setFilteredCategory("two-piece")}
            className={`p-2 mr-4 tracking-widest text-xs rounded px-4 ${filteredCategory === "two-piece" ? "bg-wine text-white"
                : "border"}`}>
            Two Piece
          </button>

          <button
            onClick={() => setFilteredCategory("trouser")}
            className={`p-2 mr-4 tracking-widest text-xs rounded px-4 ${filteredCategory === "trouser" ? "bg-wine text-white"
                : "border"}`}>
            Trouser
          </button>
         
        
        </div>
      </div>

    
      


      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item) => (
            <div key={item.id} className="bg-gray-50 shadow-md p-2 mb-10 rounded-lg">
              
              <Link href={`/product/${slugify(item.name)}`}>
                <Image src={item.images[0]} width={320} height={320} alt={item.name} className="w-full h-[320px] object-cover mb-4 rounded" /> 
              </Link>
             
              <h2 className="font-semibold tracking-widest pb-2">{item.name}</h2>
              <h2 className="pb-2 text-gray-400 text-sm">{item.description}</h2>
              <p className="font-semibold tracking-widest"> ₦{Number(item.price).toLocaleString("en-NG")}</p>
        
            </div>
          ))
        ) : (
          <p className="text-gray-600">No products found</p>
        )}
      </div>
    </div>
  );
}
