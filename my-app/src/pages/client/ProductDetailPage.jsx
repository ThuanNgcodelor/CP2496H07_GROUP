import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/client/Header.jsx";
import CommentsBox from "../../components/client/product/CommentsBox.jsx";
import ShopInfoBar from "../../components/client/product/ShopInfoBar.jsx";
import { fetchProductById, fetchProductImageById, fetchAddToCart } from "../../api/product.js";
import { getCart, getShopOwnerByUserId } from "../../api/user.js";
import { useCart } from "../../contexts/CartContext.jsx";
import imgFallback from "../../assets/images/shop/6.png";

const USE_OBJECT_URL = true;

const arrayBufferToDataUrl = (buffer, contentType) => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  const base64 = btoa(binary);
  return `data:${contentType};base64,${base64}`;
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setCart } = useCart();
  const [product, setProduct] = useState(null);
  const [shopOwner, setShopOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSizeId, setSelectedSizeId] = useState(null);
  const [qty, setQty] = useState(1);
  const [imgUrl, setImgUrl] = useState(null);
  const createdUrlsRef = useRef([]);
  const [error, setError] = useState(null);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setError(null);
        const res = await fetchProductById(id);
        const p = res.data;
        setProduct(p);

        // Load shop owner info if userId exists
        if (p?.userId) {
          try {
            console.log('Loading shop owner for userId:', p.userId);
            const shopData = await getShopOwnerByUserId(p.userId);
            console.log('Shop owner data received:', shopData);
            setShopOwner(shopData);
          } catch (err) {
            console.error('Error loading shop owner:', err);
            console.error('Error details:', err.response?.data || err.message);
          }
        } else {
          console.log('Product has no userId:', p);
        }

        if (p?.imageId) {
          try {
            const imgRes = await fetchProductImageById(p.imageId);
            const contentType = imgRes.headers["content-type"] || "image/jpeg";
            let url;
            if (USE_OBJECT_URL && imgRes.data) {
              const blob = new Blob([imgRes.data], { type: contentType });
              url = URL.createObjectURL(blob);
              createdUrlsRef.current.push(url);
            } else {
              url = arrayBufferToDataUrl(imgRes.data, contentType);
            }
            setImgUrl(url);
          } catch {
            setImgUrl(null);
          }
        }
      } catch (e) {
        setError(e?.response?.data?.message || e.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => {
      if (USE_OBJECT_URL && createdUrlsRef.current.length) {
        createdUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
        createdUrlsRef.current = [];
      }
    };
  }, [id]);

  const priceDisplay = useMemo(() => {
    if (!product) return "";
    const { price, originalPrice, discountPercent } = product;
    if (discountPercent && discountPercent > 0 && originalPrice && originalPrice > price) {
      return (
        <div className="d-flex align-items-center gap-2">
          <span className="fs-4 fw-bold">
            {price.toLocaleString("vi-VN")} ₫
          </span>
          <span className="text-decoration-line-through text-muted">
            {originalPrice.toLocaleString("vi-VN")} ₫
          </span>
          <span className="badge bg-danger">-{discountPercent}%</span>
        </div>
      );
    }
    return (
      <span className="fs-4 fw-bold">
        {(product.price || 0).toLocaleString("vi-VN")} ₫
      </span>
    );
  }, [product]);

  const onAddToCart = async () => {
    if (!product) return;
    
    if (product.sizes && product.sizes.length > 0 && !selectedSizeId) {
      setError("Please select a size before adding to cart.");
      return;
    }
    
    try {
      setPosting(true);
      setError(null);
      
      const requestData = { 
        productId: product.id, 
        quantity: Number(qty) || 1 
      };
      
      if (selectedSizeId) {
        requestData.sizeId = selectedSizeId;
      }
      
      await fetchAddToCart(requestData);
      const cart = await getCart();
      setCart(cart);
      
      window.dispatchEvent(new CustomEvent('cart-updated'));
      
    } catch (e) {
      if (e?.response?.status === 403) {
        setError("You need to sign in to add items to the cart.");
      } else {
        setError(e?.response?.data?.message || e.message || "Failed to add to cart");
      }
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="wrapper">
      <Header />
      <main className="main-content">
        <div className="container py-4">
          {loading && <p>Loading product...</p>}
          {error && <div className="alert alert-danger">{error}</div>}
          {product && (
            <div className="row">
              <div className="col-md-6">
                <div className="border rounded p-2 d-flex justify-content-center align-items-center" style={{ minHeight: 320 }}>
                  <img
                    src={imgUrl || imgFallback}
                    onError={(e) => (e.currentTarget.src = imgFallback)}
                    alt={product.name}
                    style={{ maxWidth: "100%", maxHeight: 420, objectFit: "contain" }}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <h2 className="mb-2">{product.name}</h2>
                {product.createdAt && (
                  <div className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
                    Created: {new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(product.createdAt))}
                  </div>
                )}
                <div className="mb-4">{priceDisplay}</div>
                <div className="mb-4 ">
                  <span className="badge bg-light text-dark">Stock: {product.stock ?? "-"}</span>
                  {product.status && <span className="badge bg-info ms-2">{product.status}</span>}
                  {product.category?.name && <span className="badge bg-secondary ms-2">{product.category.name}</span>}
                </div>
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mb-3">
                    <label className="form-label fw-bold">Select Size:</label>
                    <div className="d-flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size.id}
                          type="button"
                          className={`btn ${selectedSizeId === size.id ? 'btn-primary' : 'btn-outline-secondary'}`}
                          onClick={() => setSelectedSizeId(size.id)}
                          style={{ minWidth: '60px' }}
                        >
                          {size.name}
                          <br />
                          <small style={{ fontSize: '0.75rem' }}>
                            Stock: {size.stock}
                          </small>
                        </button>
                      ))}
                    </div>
                    {selectedSizeId && (
                      <p className="text-success mt-2">
                        <i className="fa fa-check-circle"></i> Size selected
                      </p>
                    )}
                  </div>
                )}

                {/* Quantity and Add to Cart */}
                <div className="d-flex align-items-center gap-2 my-3">
                  <label className="form-label fw-bold mb-0">Quantity:</label>
                  <input
                    type="number"
                    min="1"
                    max={selectedSizeId 
                      ? product.sizes?.find(s => s.id === selectedSizeId)?.stock || 1
                      : product.stock || 1}
                    value={qty}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      const maxQty = selectedSizeId 
                        ? product.sizes?.find(s => s.id === selectedSizeId)?.stock || 1
                        : product.stock || 1;
                      setQty(Math.min(val, maxQty));
                    }}
                    className="form-control"
                    style={{ maxWidth: 100 }}
                  />
                  <button 
                    disabled={posting || (product.sizes?.length > 0 && !selectedSizeId)} 
                    className="btn btn-primary btn-lg"
                    onClick={onAddToCart}
                  >
                    {posting ? (
                      <>
                        <i className="fa fa-spinner fa-spin me-2"></i>
                        Adding...
                      </>
                    ) : (
                      <>
                        <i className="fa fa-shopping-cart me-2"></i>
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>

                {/* Description inside right column */}
                <p className="text-muted">{product.description || ""}</p>
              </div>
            </div>
          )}

          {product && shopOwner && (
            <>
              {/* Full-width Shop Info Bar below product section */}
              <div className="row mt-3">
                <div className="col-12">
                  <ShopInfoBar 
                    shopOwner={shopOwner}
                    onViewShop={() => navigate(`/shop/${product.userId}`)}
                  />
                </div>
              </div>

              <div className="row mt-4">
                <div className="col-12">
                  <CommentsBox productId={product.id} product={product} />
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
