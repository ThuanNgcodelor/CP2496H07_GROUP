import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { addProduct, getProductById, updateProduct } from '../../api/shopOwner';
import categoryApi from '../../api/categoryApi';
import '../../components/shop-owner/ShopOwnerLayout.css';

export default function AddProductPage() {
  const navigate = useNavigate();
  const { id: productId } = useParams();
  const isEditMode = Boolean(productId);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    discountPercent: '',
    categoryId: '',
    status: 'IN_STOCK',
    sizes: [
      {
        name: '',
        description: '',
        stock: '',
        priceModifier: ''
      }
    ],
    images: []
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [initialLoading, setInitialLoading] = useState(false);

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryApi.getAll();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        alert('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  // Load product in edit mode
  useEffect(() => {
    if (!isEditMode) return;
    const loadProduct = async () => {
      try {
        setInitialLoading(true);
        const data = await getProductById(productId);
        setFormData({
          name: data.name || '',
          description: data.description || '',
          price: data.price != null ? String(data.price) : '',
          originalPrice: data.originalPrice != null ? String(data.originalPrice) : '',
          discountPercent: data.discountPercent != null ? String(data.discountPercent) : '',
          categoryId: data.categoryId != null ? String(data.categoryId) : '',
          status: (data.status || 'IN_STOCK').toUpperCase(),
          sizes: Array.isArray(data.sizes) && data.sizes.length > 0 ? data.sizes.map(s => ({
            name: s.name || '',
            description: s.description || '',
            stock: s.stock != null ? String(s.stock) : '',
            priceModifier: s.priceModifier != null ? String(s.priceModifier) : ''
          })) : [{ name: '', description: '', stock: '', priceModifier: '' }],
          images: []
        });
        const previews = [];
        if (data.imageId) previews.push(`/v1/file-storage/get/${data.imageId}`);
        if (Array.isArray(data.imageIds)) {
          data.imageIds.forEach(imgId => {
            if (imgId) previews.push(`/v1/file-storage/get/${imgId}`);
          });
        }
        setImagePreviews(previews);
      } catch (e) {
        console.error('Error loading product:', e);
        alert('Failed to load product details');
        navigate('/shop-owner/products');
      } finally {
        setInitialLoading(false);
      }
    };
    loadProduct();
  }, [isEditMode, productId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSizeChange = (index, field, value) => {
    const updatedSizes = [...formData.sizes];
    updatedSizes[index][field] = value;
    setFormData(prev => ({
      ...prev,
      sizes: updatedSizes
    }));
  };

  const addSize = () => {
    setFormData(prev => ({
      ...prev,
      sizes: [
        ...prev.sizes,
        {
          name: '',
          description: '',
          stock: '',
          priceModifier: ''
        }
      ]
    }));
  };

  const removeSize = (index) => {
    if (formData.sizes.length > 1) {
      const updatedSizes = formData.sizes.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        sizes: updatedSizes
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + imagePreviews.length > 10) {
      alert('Maximum 10 images');
      return;
    }

    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result]);
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, file]
          }));
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const calculateDiscount = () => {
    const price = parseFloat(formData.price) || 0;
    const originalPrice = parseFloat(formData.originalPrice) || 0;
    
    if (originalPrice > 0 && price < originalPrice) {
      const discount = ((originalPrice - price) / originalPrice) * 100;
      setFormData(prev => ({
        ...prev,
        discountPercent: discount.toFixed(2)
      }));
    }
  };

  React.useEffect(() => {
    if (formData.price && formData.originalPrice) {
      calculateDiscount();
    }
  }, [formData.price, formData.originalPrice]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Product description is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Invalid product price';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Please select a category';
    }

    if (!formData.status) {
      newErrors.status = 'Please select status';
    }

    if (formData.sizes.some(size => !size.name || !size.stock)) {
      newErrors.sizes = 'Please fill in all information for all sizes';
    }

    if (!isEditMode) {
      if (imagePreviews.length === 0) {
        newErrors.images = 'Please add at least 1 product photo';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fill in all required information');
      return;
    }

    setLoading(true);

    try {
      const sizesData = formData.sizes.map(size => ({
        name: size.name,
        description: size.description || '',
        stock: parseInt(size.stock) || 0,
        priceModifier: parseFloat(size.priceModifier) || 0
      }));

      const productData = {
        id: isEditMode ? productId : undefined,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: parseFloat(formData.originalPrice) || parseFloat(formData.price),
        discountPercent: parseFloat(formData.discountPercent) || 0,
        categoryId: formData.categoryId,
        status: (formData.status || 'IN_STOCK').toUpperCase(),
        sizes: sizesData
      };

      if (isEditMode) {
        await updateProduct(productData, formData.images);
        alert('Product updated successfully!');
      } else {
        await addProduct(productData, formData.images);
        alert('Product created successfully!');
      }
      navigate('/shop-owner/products');
      } catch (error) {
      console.error('Error creating product:', error);
      alert((isEditMode ? 'Error updating product: ' : 'Error creating product: ') + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <h1>{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
            <p className="text-muted">{isEditMode ? 'Update details of your product' : 'Fill in detailed information about your product'}</p>
          </div>
          <Link to="/shop-owner/products" className="btn btn-secondary-shop">
            <i className="fas fa-arrow-left"></i> Back
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-8">
            <div className="card" style={{marginBottom: '20px'}}>
              <div className="card-header">
                <h5><i className="fas fa-info-circle"></i> Basic Information</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Product name <span style={{color: 'red'}}>*</span></label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Status <span style={{color: 'red'}}>*</span></label>
                  <select
                    className={`form-select ${errors.status ? 'is-invalid' : ''}`}
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="IN_STOCK">In Stock</option>
                    <option value="OUT_OF_STOCK">Out of Stock</option>
                  </select>
                  {errors.status && <div className="invalid-feedback">{errors.status}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Product description <span style={{color: 'red'}}>*</span></label>
                  <textarea
                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="5"
                    placeholder="Enter detailed product description"
                  />
                  {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Price (₫) <span style={{color: 'red'}}>*</span></label>
                      <input
                        type="number"
                        className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="0"
                        min="0"
                        step="1000"
                      />
                      {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Original price (₫)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="originalPrice"
                        value={formData.originalPrice}
                        onChange={handleInputChange}
                        placeholder="0"
                        min="0"
                        step="1000"
                      />
                    </div>
                  </div>
                </div>

                {formData.discountPercent && parseFloat(formData.discountPercent) > 0 && (
                  <div className="alert alert-info">
                    <i className="fas fa-percent"></i> Discount: {parseFloat(formData.discountPercent).toFixed(1)}%
                  </div>
                )}
              </div>
            </div>

            {/* Sizes & Variants */}
            <div className="card" style={{marginBottom: '20px'}}>
              <div className="card-header">
                <h5><i className="fas fa-ruler"></i> Sizes / Variants</h5>
              </div>
              <div className="card-body">
                {formData.sizes.map((size, index) => (
                  <div key={index} className="border rounded p-3 mb-3" style={{background: '#f8f9fa'}}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <strong>Biến thể #{index + 1}</strong>
                      {formData.sizes.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removeSize(index)}
                        >
                          <i className="fas fa-trash"></i> Remove
                        </button>
                      )}
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Size name <span style={{color: 'red'}}>*</span></label>
                          <input
                            type="text"
                            className="form-control"
                            value={size.name}
                            onChange={(e) => handleSizeChange(index, 'name', e.target.value)}
                            placeholder="E.g., 128GB, XS, S, M, L"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Description (optional)</label>
                          <input
                            type="text"
                            className="form-control"
                            value={size.description}
                            onChange={(e) => handleSizeChange(index, 'description', e.target.value)}
                            placeholder="E.g., 128GB storage"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Stock <span style={{color: 'red'}}>*</span></label>
                          <input
                            type="number"
                            className="form-control"
                            value={size.stock}
                            onChange={(e) => handleSizeChange(index, 'stock', e.target.value)}
                            placeholder="0"
                            min="0"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Price modifier (₫)</label>
                          <input
                            type="number"
                            className="form-control"
                            value={size.priceModifier}
                            onChange={(e) => handleSizeChange(index, 'priceModifier', e.target.value)}
                            placeholder="0"
                            step="1000"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={addSize}
                >
                  <i className="fas fa-plus"></i> Add variant
                </button>

                {errors.sizes && (
                  <div className="text-danger mt-2">{errors.sizes}</div>
                )}
              </div>
            </div>

            {/* Images */}
            <div className="card">
              <div className="card-header">
                <h5><i className="fas fa-images"></i> Product images</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Choose images{isEditMode ? '' : ' '}<span style={{color: 'red'}}>*</span></label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleImageChange}
                    accept="image/*"
                    multiple
                  />
                  <small className="text-muted">Up to 10 images</small>
                </div>

                {errors.images && (
                  <div className="text-danger mb-3">{errors.images}</div>
                )}

                {imagePreviews.length > 0 && (
                  <div className="row">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="col-md-3 mb-3">
                        <div className="position-relative">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            style={{
                              width: '100%',
                              height: '150px',
                              objectFit: 'cover',
                              borderRadius: '8px'
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            style={{
                              position: 'absolute',
                              top: '5px',
                              right: '5px'
                            }}
                            onClick={() => removeImage(index)}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-md-4">
            <div className="card" style={{position: 'sticky', top: '20px'}}>
              <div className="card-header">
                <h5><i className="fas fa-cog"></i> Options</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Category <span style={{color: 'red'}}>*</span></label>
                  <select
                    className={`form-select ${errors.categoryId ? 'is-invalid' : ''}`}
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && <div className="invalid-feedback">{errors.categoryId}</div>}
                </div>

                <hr />

                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary-shop"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i> Saving...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save"></i> {isEditMode ? 'Update product' : 'Save product'}
                      </>
                    )}
                  </button>
                  <Link to="/shop-owner/products" className="btn btn-secondary-shop">
                    <i className="fas fa-times"></i> Cancel
                  </Link>
                </div>

                <div className="mt-3">
                  <small className="text-muted">
                    <i className="fas fa-info-circle"></i> Fields marked with <span style={{color: 'red'}}>*</span> are required
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
