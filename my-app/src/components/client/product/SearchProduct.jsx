import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import imgFallback from "../../../assets/images/shop/6.png";
import { useCart } from "../../../contexts/CartContext.jsx";
import {
  fetchAddToCart,
  fetchProductImageById,
  fetchProducts,
} from "../../../api/product.js";
import { getCart } from "../../../api/user.js";

const USE_OBJECT_URL = true;

const arrayBufferToDataUrl = (buffer, contentType) => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  const base64 = btoa(binary);
  return `data:${contentType || "image/png"};base64,${base64}`;
};

const PAGE_SIZE = 10;

const SearchProduct = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageUrls, setImageUrls] = useState({});

  // Search & Pagination - Initialize from URL params
  const urlQuery = searchParams.get('q') || "";
  const [query, setQuery] = useState(urlQuery);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);

  // Filters & Sort state (funnel)
  const [category, setCategory] = useState("ALL");
  const [status, setStatus] = useState("ALL"); // in_stock / out_of_stock / ALL
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sortKey, setSortKey] = useState("Trending"); // Trending | Featured | Best Selling | Price: low to high | Price: high to low

  // Track created object URLs to revoke
  const createdUrlsRef = useRef([]);

  // Load all products (client-side filter + paginate)
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetchProducts();
        const list = Array.isArray(res?.data) ? res.data : res?.data?.content || [];
        setProducts(list);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Sync URL query parameter when component mounts or URL changes
  useEffect(() => {
    const urlQuery = searchParams.get('q') || "";
    if (urlQuery !== query) {
      setQuery(urlQuery);
    }
  }, [searchParams]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  // Reset to page 1 when filters/search change
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, category, status, onlyDiscounted, priceMin, priceMax, sortKey]);

  // Calculate min/max price for slider
  const priceRange = useMemo(() => {
    const prices = products.map((p) => Number(p.price || 0)).filter(Boolean);
    return {
      min: prices.length ? Math.min(...prices) : 0,
      max: prices.length ? Math.max(...prices) : 1000000,
    };
  }, [products]);

  // Helpers: get category text from product
  const categoryOf = (p) =>
    p?.category?.name ||
    p?.categoryName ||
    p?.category?.title ||
    p?.category_id ||
    p?.categoryId 

  // Helpers: compute total stock from sizes (align with AllProduct.jsx)
  const totalStockOf = (p) => {
    if (!p || !Array.isArray(p.sizes)) return 0;
    return p.sizes.reduce((sum, size) => sum + (Number(size?.stock) || 0), 0);
  };


  // 1) Base filter by search
  const filteredBySearch = useMemo(() => {
    if (!debouncedQuery) return products;
    const q = debouncedQuery.toLowerCase();
    return products.filter((p) => {
      const name = (p.name || "").toLowerCase();
      const desc = (p.description || "").toLowerCase();
      return name.includes(q) || desc.includes(q);
    });
  }, [products, debouncedQuery]);

  // 2) Apply filters
  const filtered = useMemo(() => {
    let arr = filteredBySearch;

    if (category !== "ALL") {
      arr = arr.filter((p) => categoryOf(p) === category);
    }

    if (status !== "ALL") {
      arr = arr.filter((p) => String(p.status) === status);
    }

    if (onlyDiscounted) {
      arr = arr.filter((p) => {
        const price = Number(p.price || 0);
        const original = Number(p.originalPrice || p.original_price || price);
        return original > price;
      });
    }

    const min = priceMin === "" ? -Infinity : Number(priceMin);
    const max = priceMax === "" ? Infinity : Number(priceMax);
    if (!(isNaN(min) && isNaN(max))) {
      arr = arr.filter((p) => {
        const price = Number(p.price || 0);
        return (isNaN(min) ? true : price >= min) && (isNaN(max) ? true : price <= max);
      });
    }

    // Hide products that are completely out of stock (all sizes quantity = 0)
    arr = arr.filter((p) => totalStockOf(p) > 0);

    const sorted = [...arr];
    if (sortKey === "Price: low to high") {
      sorted.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (sortKey === "Price: high to low") {
      sorted.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    }
    // Trending/Featured/Best Selling: keep original order

    return sorted;
  }, [filteredBySearch, category, status, onlyDiscounted, priceMin, priceMax, sortKey]);

  // Pagination
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  // Load images for current page only
  useEffect(() => {
    if (pageItems.length === 0) {
      setImageUrls({});
      return;
    }

    let isActive = true;
    const newUrls = {};
    const tempCreatedUrls = [];

    const loadImages = async () => {
      await Promise.all(
        pageItems.map(async (product) => {
          try {
            if (product.imageId) {
              const res = await fetchProductImageById(product.imageId);
              const contentType = res.headers?.["content-type"] || "image/png";

              if (USE_OBJECT_URL) {
                const blob = new Blob([res.data], { type: contentType });
                const url = URL.createObjectURL(blob);
                newUrls[product.id] = url;
                tempCreatedUrls.push(url);
              } else {
                newUrls[product.id] = arrayBufferToDataUrl(res.data, contentType);
              }
            } else {
              newUrls[product.id] = imgFallback;
            }
          } catch {
            newUrls[product.id] = imgFallback;
          }
        })
      );

      if (!isActive) return;

      if (USE_OBJECT_URL && createdUrlsRef.current.length) {
        createdUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
      }
      createdUrlsRef.current = tempCreatedUrls;

      setImageUrls(newUrls);
    };

    loadImages();

    return () => {
      isActive = false;
      if (USE_OBJECT_URL && createdUrlsRef.current.length) {
        createdUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
        createdUrlsRef.current = [];
      }
    };
  }, [pageItems]);

  const gotoPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetFilters = () => {
    setCategory("ALL");
    setStatus("ALL");
    setOnlyDiscounted(false);
    setPriceMin("");
    setPriceMax("");
    setSortKey("Trending");
  };

  // UI helpers for funnel chips
  const activeChips = useMemo(() => {
    const chips = [];
    if (debouncedQuery) chips.push({ k: "q", label: `Search: "${debouncedQuery}"`, clear: () => setQuery("") });
    if (category !== "ALL") chips.push({ k: "cat", label: `Category: ${category}`, clear: () => setCategory("ALL") });
    if (status !== "ALL") chips.push({ k: "st", label: `Status: ${status}`, clear: () => setStatus("ALL") });
    if (onlyDiscounted) chips.push({ k: "disc", label: "Discounted", clear: () => setOnlyDiscounted(false) });
    if (priceMin !== "") chips.push({ k: "min", label: `Min: ${priceMin}`, clear: () => setPriceMin("") });
    if (priceMax !== "") chips.push({ k: "max", label: `Max: ${priceMax}`, clear: () => setPriceMax("") });
    if (sortKey !== "Trending") {
      chips.push({ k: "sort", label: `Sort: ${sortKey}`, clear: () => setSortKey("Trending") });
    }
    return chips;
  }, [debouncedQuery, category, status, onlyDiscounted, priceMin, priceMax, sortKey]);

  if (loading) return <div className="text-center">Loading products...</div>;

  return (

    <section className="product-area section-space">
      <div className="container">
        <section className="shop-top-bar-area">
          <div className="container">
            <div className="shop-top-bar">
              <select className="select-shoing" value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
                <option value="Price: low to high">Price: Low to High</option>
                <option value="Price: high to low">Price: High to Low</option>
              </select>

              <div className="select-on-sale d-flex d-md-none">
                <h5>On Sale :</h5>
                <select className="select-on-sale-form" value={onlyDiscounted ? "Yes" : "No"} onChange={(e) => setOnlyDiscounted(e.target.value === "Yes")}>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div className="select-price-range">
                <h4 className="title">Pricing</h4>
                <div className="select-price-range-slider">
                  <input type="range" className="slider-range" 
                    min={priceRange.min} max={priceRange.max}
                    value={priceMin || priceRange.min}
                    onChange={(e) => setPriceMin(e.target.value)}
                  />
                  <input type="range" className="slider-range"
                    min={priceRange.min} max={priceRange.max}
                    value={priceMax || priceRange.max}
                    onChange={(e) => setPriceMax(e.target.value)}
                  />
                  <div className="slider-labels">
                    <span id="slider-range-value1">${Number(priceMin || priceRange.min).toLocaleString()}</span>
                    <span>-</span>
                    <span id="slider-range-value2">${Number(priceMax || priceRange.max).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="select-on-sale d-none d-md-flex">
                <h5>On Sale :</h5>
                <select className="select-on-sale-form" value={onlyDiscounted ? "Yes" : "No"} onChange={(e) => setOnlyDiscounted(e.target.value === "Yes")}>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
          </div>
          <h6 className="visually-hidden">Shop Top Bar Area</h6>
        </section>

        {/* --- Grid --- */}
        <div className="row mb-n6" style={{ marginTop: '40px' }}>
          {pageItems.length === 0 && (
            <div className="col-12">
              <div className="alert alert-light border text-center">No products found.</div>
            </div>
          )}

          {pageItems.map((product) => (
            <div className="col-sm-6 col-lg-4 mb-6" key={product.id}>
              <div className="product-item product-item-border">
                <Link className="product-thumb" to={`/product/${product.id}`} style={{ 
                  display: 'block',
                  position: 'relative',
                  paddingBottom: '100%',
                  overflow: 'hidden',
                  backgroundColor: '#f8f9fa'
                }}>
                  <img
                    src={imageUrls[product.id] || imgFallback}
                    onError={(e) => {
                      e.currentTarget.src = imgFallback;
                    }}
                    alt={product.name}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </Link>
                {product.status && <span className="badges">{product.status}</span>}

                <div className="product-action">
                  <button type="button" className="product-action-btn" title="Quick View">
                    <i className="fa fa-expand" />
                  </button>
                  <button type="button" className="product-action-btn">
                    <i className="fa fa-heart-o" />
                  </button>
                  <button type="button" className="product-action-btn" title="Compare">
                    <i className="fa fa-exchange" />
                  </button>
                </div>

                <div className="product-info">
                  <h4 className="title">
                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                  </h4>
                  <div className="price">
                    {"$" + Number(product.price || 0).toLocaleString("en-US")}
                    {product.originalPrice && Number(product.originalPrice) !== Number(product.price) && (
                      <span className="price-old">
                        {" $" + Number(product.originalPrice).toLocaleString("en-US")}
                      </span>
                    )}
                  </div>
                  
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- Pagination --- */}
        {totalPages > 1 && (
          <div className="row mt-5">
            <div className="col-12 d-flex justify-content-center">
              <nav>
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => gotoPage(currentPage - 1)}>
                      «
                    </button>
                  </li>

                  {Array.from({ length: totalPages }).map((_, i) => {
                    const p = i + 1;
                    const shouldShow = p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1);
                    const isEllipsisBefore = p === currentPage - 2 && p > 1;
                    const isEllipsisAfter = p === currentPage + 2 && p < totalPages;

                    if (isEllipsisBefore || isEllipsisAfter) {
                      return (
                        <li key={`ellipsis-${p}`} className="page-item disabled">
                          <span className="page-link">…</span>
                        </li>
                      );
                    }

                    if (!shouldShow) return null;

                    return (
                      <li key={p} className={`page-item ${p === currentPage ? "active" : ""}`}>
                        <button className="page-link" onClick={() => gotoPage(p)}>
                          {p}
                        </button>
                      </li>
                    );
                  })}

                  <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => gotoPage(currentPage + 1)}>
                      »
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        )}
      </div>

      
    </section>
  );
};

export default SearchProduct;
