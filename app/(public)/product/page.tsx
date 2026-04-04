"use client"

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Data from "@/app/data/products.json";
import slugify from "../../lib/utils/slugify";

export default function Product() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategory, setFilteredCategory] = useState("");

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
      <h1 className="text-2xl font-bold text-center mb-8">Shop</h1>

     
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

            className={`p-2 mr-4 tracking-widest px-3 rounded  text-xs ${!filteredCategory 
            ? "bg-wine text-white bg-[#7a0d20]" : "border "}`}>
             All
          </button>
          
          <button
            onClick={() => setFilteredCategory("gown")}
            className={`p-2 mr-4 tracking-widest rounded  text-xs px-4 ${filteredCategory === "gown" ? "bg-wine text-white bg-[#7a0d20]"
                : "border"}`}>
            Gown
          </button>
          <button
            onClick={() => setFilteredCategory("jumpsuit")}
            className={`p-2 mr-4 tracking-widest rounded  text-[8px] px-4 ${filteredCategory === "jumpsuit" ? "bg-wine text-white bg-[#7a0d20]"
                : "border"}`}>
            Jumpsuit
          </button>

          <button
            onClick={() => setFilteredCategory("two-piece")}
            className={`p-2 mr-4 tracking-widest  text-xs rounded px-4 ${filteredCategory === "two-piece" ? "bg-wine text-white bg-[#7a0d20]"
                : "border"}`}>
            Two Piece
          </button>

          <button
            onClick={() => setFilteredCategory("trouser")}
            className={`p-2 mr-4 tracking-widest  text-xs rounded px-4 ${filteredCategory === "trouser" ? "bg-wine text-white bg-[#7a0d20]"
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
             
              <p className="font-semibold text-xs tracking-widest pb-2">{item.name}</p>
              <p className="pb-2 text-gray-400 text-[8px]">{item.description}</p>
              <p className="font-semibold text-sm tracking-widest"> ₦{Number(item.price).toLocaleString("en-NG")}</p>
        
            </div>
          ))
        ) : (
          <p className="text-gray-600">No products found</p>
        )}
      </div>
    </div>
  );
}
