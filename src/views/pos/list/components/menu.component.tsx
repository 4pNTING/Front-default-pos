"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePOSStore } from "../../store/posStore";
import { POSListProps, IEntityStatus } from "../../type/posType";
import { resolveImageUrl } from "@/utils/imageUrl";

interface MenuItemImageProps {
  photo?: string | null;
  name: string;
  noImageLabel?: string;
}

const MenuItemImage: React.FC<MenuItemImageProps> = ({ photo, name, noImageLabel = "No Image" }) => {
  const [imgError, setImgError] = useState(false);
  const imageUrl = resolveImageUrl(photo);

  if (!photo || imgError || !imageUrl) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center text-gray-400 dark:text-gray-500 select-none">
        <i className="tabler-photo text-3xl mb-1 group-hover:scale-110 transition-transform" />
        <span className="text-[10px] font-medium tracking-wide uppercase">
          {noImageLabel}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={name}
      fill
      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
      className="object-cover group-hover:scale-105 transition-transform duration-300"
      onError={() => setImgError(true)}
      unoptimized
    />
  );
};

const MenuComponent: React.FC<{ props: POSListProps }> = ({ props }) => {
  // Var
  const { lang, dictionary: dic } = props;

  const {
    categories,
    menuItems,
    selectedCategoryId,
    setSelectedCategoryId,
    menuSearchKeyword,
    addToCart,
    cart,
    loading,
  } = usePOSStore();

  // Filter items by category and search keyword
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategoryId === IEntityStatus.all || item.categoryId === selectedCategoryId;
    const matchesKeyword =
      !menuSearchKeyword ||
      item.name.toLowerCase().includes(menuSearchKeyword.toLowerCase());
    return matchesCategory && matchesKeyword;
  });

  // Helper to get quantity of an item currently in local cart
  const getItemCartQty = (itemId: string) => {
    const found = cart.find((c) => c.menuItemId === itemId);
    return found ? found.quantity : 0;
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden p-4 md:p-6 space-y-4">
      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <button
          onClick={() => setSelectedCategoryId(IEntityStatus.all)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCategoryId === IEntityStatus.all
              ? "bg-[#2F57AB] text-white shadow-sm"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[#2F57AB]"
          }`}
        >
          {dic.posPage?.allCategories ?? "All Items"} ({menuItems.length})
        </button>
        {categories.map((cat) => {
          const countInCat = menuItems.filter((m) => m.categoryId === cat._id).length;
          return (
            <button
              key={cat._id}
              onClick={() => setSelectedCategoryId(cat._id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategoryId === cat._id
                  ? "bg-[#2F57AB] text-white shadow-sm"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[#2F57AB]"
              }`}
            >
              {cat.name} ({countInCat})
            </button>
          );
        })}
      </div>

      {/* Menu Cards Grid */}
      <div className="flex-1 overflow-y-auto pr-1">
        {loading && menuItems.length === 0 ? (
          <div className="flex justify-center items-center py-20 text-gray-400">
            <i className="tabler-loader animate-spin text-3xl mr-2" />
            <span>{dic.posPage?.loadingMenu ?? "Loading menu items..."}</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center mb-3 text-gray-400 dark:text-gray-500">
              <i className="tabler-meat-off text-3xl" />
            </div>
            <p className="text-sm font-medium">{dic.posPage?.noMenuItems ?? "No menu items found."}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
            {filteredItems.map((item) => {
              const qtyInCart = getItemCartQty(item._id);
              const price = Number(item.price) || 0;

              return (
                <div
                  key={item._id}
                  onClick={() => addToCart(item)}
                  className="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md hover:border-[#2F57AB] dark:hover:border-blue-500 transition-all cursor-pointer flex flex-col justify-between select-none active:scale-[0.98]"
                >
                  {/* Item Image or Fallback */}
                  <div className="relative w-full h-28 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center overflow-hidden">
                    <MenuItemImage
                      photo={item.photo}
                      name={item.name}
                      noImageLabel={dic.posPage?.noImage ?? "No Image"}
                    />

                    {/* Quantity Badge if in cart */}
                    {qtyInCart > 0 && (
                      <span className="absolute top-2 right-2 bg-[#2F57AB] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md animate-bounce">
                        {qtyInCart}
                      </span>
                    )}
                  </div>

                  {/* Item Info */}
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-100 line-clamp-1 group-hover:text-[#2F57AB] dark:group-hover:text-blue-400 transition-colors">
                        {item.name}
                      </h4>
                      {item.description && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-1 mt-0.5">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Price and Add button */}
                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700/60">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {price.toLocaleString()} ₭
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item);
                        }}
                        className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-[#2F57AB] dark:text-blue-300 flex items-center justify-center hover:bg-[#2F57AB] hover:text-white transition-all shadow-sm"
                      >
                        <i className="tabler-plus text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuComponent;
