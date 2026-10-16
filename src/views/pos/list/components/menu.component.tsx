"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { usePOSStore } from "../../store/posStore";
import { POSListProps, IEntityStatus } from "../../type/posType";
import { resolveImageUrl } from "@/utils/imageUrl";

interface MenuItemImageProps {
  photo?: string | null;
  name: string;
  noImageLabel?: string;
}

type SortMode = "default" | "asc" | "desc" | "price_asc" | "price_desc";

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
    updateCartItemQuantity,
    cart,
    loading,
  } = usePOSStore();

  const [layoutMode, setLayoutMode] = useState<"grid" | "list">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pos_menu_layout_mode");
      if (saved === "list" || saved === "grid") return saved;
    }
    return "grid";
  });

  const handleLayoutModeChange = (mode: "grid" | "list") => {
    setLayoutMode(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem("pos_menu_layout_mode", mode);
    }
  };

  const [sortMode, setSortMode] = useState<SortMode>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pos_menu_sort_mode");
      if (
        saved === "asc" ||
        saved === "desc" ||
        saved === "price_asc" ||
        saved === "price_desc" ||
        saved === "default"
      ) {
        return saved as SortMode;
      }
    }
    return "default";
  });

  const handleSortChange = (mode: SortMode) => {
    setSortMode(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem("pos_menu_sort_mode", mode);
    }
  };

  // Helper to get category name by id
  const getCategoryName = (catId?: string) => {
    if (!catId) return "";
    const found = categories.find((c) => c._id === catId);
    return found ? found.name : "";
  };

  // Filter items by category and search keyword, then sort
  const filteredItems = useMemo(() => {
    const list = menuItems.filter((item) => {
      const matchesCategory =
        selectedCategoryId === IEntityStatus.all || item.categoryId === selectedCategoryId;
      const matchesKeyword =
        !menuSearchKeyword ||
        item.name.toLowerCase().includes(menuSearchKeyword.toLowerCase());
      return matchesCategory && matchesKeyword;
    });

    if (sortMode === "asc") {
      return [...list].sort((a, b) =>
        (a.name || "").localeCompare(b.name || "", undefined, {
          sensitivity: "base",
          numeric: true,
        })
      );
    }
    if (sortMode === "desc") {
      return [...list].sort((a, b) =>
        (b.name || "").localeCompare(a.name || "", undefined, {
          sensitivity: "base",
          numeric: true,
        })
      );
    }
    if (sortMode === "price_asc") {
      return [...list].sort(
        (a, b) => (Number(a.price) || 0) - (Number(b.price) || 0)
      );
    }
    if (sortMode === "price_desc") {
      return [...list].sort(
        (a, b) => (Number(b.price) || 0) - (Number(a.price) || 0)
      );
    }

    return list;
  }, [menuItems, selectedCategoryId, menuSearchKeyword, sortMode]);

  // Helper to get quantity of an item currently in local cart
  const getItemCartQty = (itemId: string) => {
    const found = cart.find((c) => c.menuItemId === itemId);
    return found ? found.quantity : 0;
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden p-4 md:p-6 space-y-4">
      {/* Top Toolbar: Categories + Side-by-Side Dropdowns (A-Z Sort & Grid/List View) */}
      <div className="flex items-center justify-between gap-3">
        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin flex-1 min-w-0">
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

        {/* Right Side: A-Z Sort Dropdown + Grid/List View Dropdown (Side-by-Side) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* A-Z Sort Dropdown */}
          <div className="relative min-w-[125px] sm:min-w-[145px]">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400">
              <i
                className={`text-sm ${
                  sortMode === "asc"
                    ? "tabler-sort-ascending-letters text-[#2F57AB] dark:text-blue-400"
                    : sortMode === "desc"
                    ? "tabler-sort-descending-letters text-[#2F57AB] dark:text-blue-400"
                    : "tabler-arrows-sort"
                }`}
              />
            </div>
            <select
              value={sortMode}
              onChange={(e) => handleSortChange(e.target.value as SortMode)}
              className={`w-full pl-8 pr-7 py-1.5 text-xs font-semibold bg-white dark:bg-gray-800 border rounded-lg shadow-xs appearance-none outline-none cursor-pointer transition-all ${
                sortMode !== "default"
                  ? "border-[#2F57AB] text-[#2F57AB] dark:text-blue-300 ring-1 ring-[#2F57AB]/20"
                  : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-[#2F57AB] focus:border-[#2F57AB]"
              }`}
            >
              <option value="default">{lang === "la" ? "ຄ່າເລີ່ມຕົ້ນ" : "Default Sort"}</option>
              <option value="asc">A - Z ({lang === "la" ? "ກ - ຮ" : "Ascending"})</option>
              <option value="desc">Z - A ({lang === "la" ? "ຮ - ກ" : "Descending"})</option>
              <option value="price_asc">{lang === "la" ? "ລາຄາ: ຕ່ຳ - ສູງ" : "Price: Low - High"}</option>
              <option value="price_desc">{lang === "la" ? "ລາຄາ: ສູງ - ຕ່ຳ" : "Price: High - Low"}</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-gray-400">
              <i className="tabler-chevron-down text-xs" />
            </div>
          </div>

          {/* Grid / List View Dropdown */}
          <div className="relative min-w-[110px] sm:min-w-[125px]">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[#2F57AB] dark:text-blue-400">
              <i
                className={`text-sm ${
                  layoutMode === "grid" ? "tabler-layout-grid" : "tabler-list"
                }`}
              />
            </div>
            <select
              value={layoutMode}
              onChange={(e) => handleLayoutModeChange(e.target.value as "grid" | "list")}
              className="w-full pl-8 pr-7 py-1.5 text-xs font-semibold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg shadow-xs appearance-none outline-none cursor-pointer hover:border-[#2F57AB] focus:border-[#2F57AB] focus:ring-1 focus:ring-[#2F57AB]/20 transition-all"
            >
              <option value="grid">{lang === "la" ? "ຕາຕະລາງ (Grid)" : "Grid View"}</option>
              <option value="list">{lang === "la" ? "ລາຍການ (List)" : "List View"}</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-gray-400">
              <i className="tabler-chevron-down text-xs" />
            </div>
          </div>
        </div>
      </div>

      {/* Menu Content Area: Grid or List */}
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
        ) : layoutMode === "grid" ? (
          /* ==================== GRID VIEW ==================== */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
            {filteredItems.map((item) => {
              const qtyInCart = getItemCartQty(item._id);
              const price = Number(item.price) || 0;

              return (
                <div
                  key={item._id}
                  onClick={() => addToCart(item)}
                  className={`group relative bg-white dark:bg-gray-800 rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between select-none active:scale-[0.98] ${
                    qtyInCart > 0
                      ? "border-[#2F57AB] ring-1 ring-[#2F57AB]/40 shadow-sm"
                      : "border-gray-200 dark:border-gray-700 hover:border-[#2F57AB] dark:hover:border-blue-500"
                  }`}
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

                    {/* Price and Add/Stepper button */}
                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700/60">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {price.toLocaleString()} ₭
                      </span>

                      {qtyInCart > 0 ? (
                        <div
                          className="flex items-center gap-1 bg-blue-50 dark:bg-blue-950/50 p-0.5 rounded-lg border border-blue-200 dark:border-blue-900/60"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => updateCartItemQuantity(item._id, -1)}
                            className="w-6 h-6 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 transition-colors shadow-xs"
                            title="Decrease"
                          >
                            <i className="tabler-minus text-xs" />
                          </button>
                          <span className="w-5 text-center text-xs font-bold text-[#2F57AB] dark:text-blue-300">
                            {qtyInCart}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartItemQuantity(item._id, 1)}
                            className="w-6 h-6 rounded-md bg-[#2F57AB] text-white flex items-center justify-center hover:bg-[#25468a] transition-colors shadow-xs"
                            title="Increase"
                          >
                            <i className="tabler-plus text-xs" />
                          </button>
                        </div>
                      ) : (
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
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ==================== LIST VIEW ==================== */
          <div className="space-y-2">
            {filteredItems.map((item) => {
              const qtyInCart = getItemCartQty(item._id);
              const price = Number(item.price) || 0;
              const categoryName = getCategoryName(item.categoryId);

              return (
                <div
                  key={item._id}
                  onClick={() => addToCart(item)}
                  className={`group bg-white dark:bg-gray-800 rounded-xl border p-2.5 sm:p-3 flex items-center justify-between gap-3 shadow-xs hover:shadow-md transition-all cursor-pointer select-none active:scale-[0.99] ${
                    qtyInCart > 0
                      ? "border-[#2F57AB] bg-blue-50/20 dark:bg-blue-950/20 ring-1 ring-[#2F57AB]/30"
                      : "border-gray-200 dark:border-gray-700 hover:border-[#2F57AB] dark:hover:border-blue-500"
                  }`}
                >
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 shrink-0 overflow-hidden">
                      <MenuItemImage
                        photo={item.photo}
                        name={item.name}
                        noImageLabel={dic.posPage?.noImage ?? "No Image"}
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-100 truncate group-hover:text-[#2F57AB] dark:group-hover:text-blue-400 transition-colors">
                          {item.name}
                        </h4>
                        {categoryName && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-medium shrink-0">
                            {categoryName}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5 max-w-sm sm:max-w-md">
                          {item.description}
                        </p>
                      )}
                      <div className="text-xs font-bold text-gray-900 dark:text-white mt-1 sm:hidden">
                        {price.toLocaleString()} ₭
                      </div>
                    </div>
                  </div>

                  {/* Right: Price & Stepper / Add Button */}
                  <div
                    className="flex items-center gap-3 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-sm sm:text-base font-bold text-gray-900 dark:text-white hidden sm:block">
                      {price.toLocaleString()} ₭
                    </span>

                    {qtyInCart > 0 ? (
                      <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/50 p-1 rounded-lg border border-blue-200 dark:border-blue-900/60">
                        <button
                          type="button"
                          onClick={() => updateCartItemQuantity(item._id, -1)}
                          className="w-7 h-7 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 transition-colors shadow-xs"
                          title="Decrease"
                        >
                          <i className="tabler-minus text-xs" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-[#2F57AB] dark:text-blue-300">
                          {qtyInCart}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartItemQuantity(item._id, 1)}
                          className="w-7 h-7 rounded-md bg-[#2F57AB] text-white flex items-center justify-center hover:bg-[#25468a] transition-colors shadow-xs"
                          title="Increase"
                        >
                          <i className="tabler-plus text-xs" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => addToCart(item)}
                        className="py-1.5 px-3 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-[#2F57AB] dark:text-blue-300 font-semibold text-xs flex items-center gap-1 hover:bg-[#2F57AB] hover:text-white transition-all shadow-xs"
                      >
                        <i className="tabler-plus text-sm" />
                        <span className="hidden sm:inline">{dic.posPage?.orderNow ?? "Add"}</span>
                      </button>
                    )}
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
