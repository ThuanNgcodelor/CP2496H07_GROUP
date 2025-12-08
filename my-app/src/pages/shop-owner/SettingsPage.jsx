import React, { useState, useEffect } from 'react';
import { getShopOwnerInfo, updateShopOwner } from '../../api/user';
import { getProvinces, getDistricts, getWards } from '../../api/ghn';
import '../../components/shop-owner/ShopOwnerLayout.css';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    shopName: '',
    ownerName: '',
    email: '',
    address: '',
    // GHN Address Fields
    phone: '',
    provinceId: null,
    provinceName: '',
    districtId: null,
    districtName: '',
    wardCode: '',
    wardName: '',
    streetAddress: ''
  });

  const [shopStats, setShopStats] = useState({
    verified: false,
    totalRatings: 0,
    followersCount: 0,
    followingCount: 0,
    createdAt: null,
    updatedAt: null
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errors, setErrors] = useState({});
  
  // GHN Location Data
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  // Load shop owner information
  useEffect(() => {
    const loadShopOwnerInfo = async () => {
      try {
        setInitialLoading(true);
        const data = await getShopOwnerInfo();
        
        setSettings({
          shopName: data.shopName || '',
          ownerName: data.ownerName || '',
          email: data.email || '',
          address: data.address || '',
          // GHN Address Fields
          phone: data.phone || '',
          provinceId: data.provinceId || null,
          provinceName: data.provinceName || '',
          districtId: data.districtId || null,
          districtName: data.districtName || '',
          wardCode: data.wardCode || '',
          wardName: data.wardName || '',
          streetAddress: data.streetAddress || ''
        });
        
        // Load districts and wards if province/district already set
        if (data.provinceId) {
          await loadDistricts(data.provinceId);
          if (data.districtId) {
            await loadWards(data.districtId);
          }
        }

        setShopStats({
          verified: data.verified || false,
          totalRatings: data.totalRatings || 0,
          followersCount: data.followersCount || 0,
          followingCount: data.followingCount || 0,
          createdAt: data.createdAt || null,
          updatedAt: data.updatedAt || null
        });

        // Load image if exists
        if (data.imageUrl) {
          setImagePreview(`/v1/file-storage/get/${data.imageUrl}`);
        }
      } catch (error) {
        console.error('Error loading shop owner info:', error);
        alert('Failed to load shop information');
      } finally {
        setInitialLoading(false);
      }
    };

    loadShopOwnerInfo();
    loadProvinces();
  }, []);
  
  // Load GHN Provinces
  const loadProvinces = async () => {
    try {
      setLoadingProvinces(true);
      const data = await getProvinces();
      setProvinces(data || []);
    } catch (err) {
      console.error('Error loading provinces:', err);
    } finally {
      setLoadingProvinces(false);
    }
  };
  
  // Load Districts when province changes
  const loadDistricts = async (provinceId) => {
    if (!provinceId) {
      setDistricts([]);
      setWards([]);
      return;
    }
    
    try {
      setLoadingDistricts(true);
      const data = await getDistricts(provinceId);
      setDistricts(data || []);
      setWards([]);
    } catch (err) {
      console.error('Error loading districts:', err);
    } finally {
      setLoadingDistricts(false);
    }
  };
  
  // Load Wards when district changes
  const loadWards = async (districtId) => {
    if (!districtId) {
      setWards([]);
      return;
    }
    
    try {
      setLoadingWards(true);
      const data = await getWards(districtId);
      setWards(data || []);
    } catch (err) {
      console.error('Error loading wards:', err);
    } finally {
      setLoadingWards(false);
    }
  };
  
  const handleProvinceChange = async (e) => {
    const provinceId = parseInt(e.target.value);
    const selectedProvince = provinces.find(p => p.ProvinceID === provinceId);
    
    setSettings(prev => ({
      ...prev,
      provinceId: provinceId || null,
      provinceName: selectedProvince ? selectedProvince.ProvinceName : '',
      districtId: null,
      districtName: '',
      wardCode: '',
      wardName: ''
    }));
    
    await loadDistricts(provinceId);
  };
  
  const handleDistrictChange = async (e) => {
    const districtId = parseInt(e.target.value);
    const selectedDistrict = districts.find(d => d.DistrictID === districtId);
    
    setSettings(prev => ({
      ...prev,
      districtId: districtId || null,
      districtName: selectedDistrict ? selectedDistrict.DistrictName : '',
      wardCode: '',
      wardName: ''
    }));
    
    await loadWards(districtId);
  };
  
  const handleWardChange = (e) => {
    const wardCode = e.target.value;
    const selectedWard = wards.find(w => w.WardCode === wardCode);
    
    setSettings(prev => ({
      ...prev,
      wardCode: wardCode || '',
      wardName: selectedWard ? selectedWard.WardName : ''
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview('');
    setImageFile(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!settings.shopName.trim()) {
      newErrors.shopName = 'Shop name is required';
    } else if (settings.shopName.trim().length < 2) {
      newErrors.shopName = 'Shop name must be at least 2 characters';
    }

    if (!settings.ownerName.trim()) {
      newErrors.ownerName = 'Owner name is required';
    } else if (settings.ownerName.trim().length < 2) {
      newErrors.ownerName = 'Owner name must be at least 2 characters';
    }

    if (!settings.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fill in all required information correctly');
      return;
    }

    setLoading(true);

    try {
      await updateShopOwner(settings, imageFile);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error updating settings:', error);
      alert(error.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Settings</h1>
        </div>
        <div className="text-center py-5">
          <i className="fas fa-spinner fa-spin fa-3x" style={{ color: '#ee4d2d' }}></i>
          <p className="mt-3">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Settings</h1>
      </div>

      {/* Shop Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card" style={{border: '1px solid #e0e0e0'}}>
            <div className="card-body text-center">
              <i className="fas fa-star fa-2x mb-2" style={{color: '#ffc107'}}></i>
              <h3 className="mb-0">{shopStats.totalRatings.toLocaleString()}</h3>
              <small className="text-muted">Total Ratings</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card" style={{border: '1px solid #e0e0e0'}}>
            <div className="card-body text-center">
              <i className="fas fa-users fa-2x mb-2" style={{color: '#ee4d2d'}}></i>
              <h3 className="mb-0">{shopStats.followersCount.toLocaleString()}</h3>
              <small className="text-muted">Followers</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card" style={{border: '1px solid #e0e0e0'}}>
            <div className="card-body text-center">
              <i className="fas fa-user-friends fa-2x mb-2" style={{color: '#17a2b8'}}></i>
              <h3 className="mb-0">{shopStats.followingCount.toLocaleString()}</h3>
              <small className="text-muted">Following</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card" style={{border: '1px solid #e0e0e0'}}>
            <div className="card-body text-center">
              {shopStats.verified ? (
                <>
                  <i className="fas fa-check-circle fa-2x mb-2" style={{color: '#28a745'}}></i>
                  <h5 className="mb-0">Verified</h5>
                  <small className="text-success">Official Shop</small>
                </>
              ) : (
                <>
                  <i className="fas fa-clock fa-2x mb-2" style={{color: '#6c757d'}}></i>
                  <h5 className="mb-0">Not Verified</h5>
                  <small className="text-muted">Pending</small>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="orders-table">
        <div className="table-header">
          <div className="table-title">Shop Information</div>
          {shopStats.createdAt && (
            <small className="text-muted">
              Shop created: {new Date(shopStats.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </small>
          )}
        </div>

        <div style={{padding: '20px'}}>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-8">
                <h5 className="mb-3" style={{color: '#ee4d2d'}}>Basic Information</h5>
                
                <div className="mb-3">
                  <label className="form-label">Shop Name <span style={{color: 'red'}}>*</span></label>
                  <input
                    type="text"
                    className={`form-control ${errors.shopName ? 'is-invalid' : ''}`}
                    name="shopName"
                    value={settings.shopName}
                    onChange={handleInputChange}
                    placeholder="Enter your shop name"
                  />
                  {errors.shopName && <div className="invalid-feedback">{errors.shopName}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Owner Name <span style={{color: 'red'}}>*</span></label>
                  <input
                    type="text"
                    className={`form-control ${errors.ownerName ? 'is-invalid' : ''}`}
                    name="ownerName"
                    value={settings.ownerName}
                    onChange={handleInputChange}
                    placeholder="Enter owner name"
                  />
                  {errors.ownerName && <div className="invalid-feedback">{errors.ownerName}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Email <span style={{color: 'red'}}>*</span></label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    name="email"
                    value={settings.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Phone <span style={{color: 'red'}}>*</span></label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phone"
                    value={settings.phone}
                    onChange={handleInputChange}
                    placeholder="Enter shop phone number"
                  />
                  <small className="text-muted">Required for GHN shipping</small>
                </div>

                <hr style={{margin: '20px 0'}} />
                
                <h6 className="mb-3" style={{color: '#ee4d2d'}}>Shop Address (GHN Integration)</h6>
                <small className="text-muted mb-3 d-block">Configure your shop address for shipping. This address will be used as the "FROM" address when creating shipping orders.</small>
                
                <div className="mb-3">
                  <label className="form-label">Province/City</label>
                  <select
                    className="form-control"
                    value={settings.provinceId || ''}
                    onChange={handleProvinceChange}
                    disabled={loadingProvinces}
                  >
                    <option value="">Select Province/City</option>
                    {provinces.map(province => (
                      <option key={province.ProvinceID} value={province.ProvinceID}>
                        {province.ProvinceName}
                      </option>
                    ))}
                  </select>
                  {loadingProvinces && <small className="text-muted">Loading provinces...</small>}
                </div>

                <div className="mb-3">
                  <label className="form-label">District</label>
                  <select
                    className="form-control"
                    value={settings.districtId || ''}
                    onChange={handleDistrictChange}
                    disabled={!settings.provinceId || loadingDistricts}
                  >
                    <option value="">Select District</option>
                    {districts.map(district => (
                      <option key={district.DistrictID} value={district.DistrictID}>
                        {district.DistrictName}
                      </option>
                    ))}
                  </select>
                  {loadingDistricts && <small className="text-muted">Loading districts...</small>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Ward</label>
                  <select
                    className="form-control"
                    value={settings.wardCode || ''}
                    onChange={handleWardChange}
                    disabled={!settings.districtId || loadingWards}
                  >
                    <option value="">Select Ward</option>
                    {wards.map(ward => (
                      <option key={ward.WardCode} value={ward.WardCode}>
                        {ward.WardName}
                      </option>
                    ))}
                  </select>
                  {loadingWards && <small className="text-muted">Loading wards...</small>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Street Address <span style={{color: 'red'}}>*</span></label>
                  <textarea
                    className="form-control"
                    name="streetAddress"
                    value={settings.streetAddress}
                    onChange={handleInputChange}
                    rows="2"
                    placeholder="Enter street address (house number, street name)"
                  />
                  <small className="text-muted">Required for GHN shipping</small>
                </div>

                <div className="mb-3">
                  <label className="form-label">Address (Legacy)</label>
                  <textarea
                    className="form-control"
                    name="address"
                    value={settings.address}
                    onChange={handleInputChange}
                    rows="2"
                    placeholder="Enter shop address (optional, for display only)"
                  />
                  <small className="text-muted">Optional: For display purposes only</small>
                </div>
              </div>

              <div className="col-md-4">
                <h5 className="mb-3" style={{color: '#ee4d2d'}}>Shop Logo / Avatar</h5>
                
                <div className="mb-3">
                  <label className="form-label">Upload Image</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                  <small className="text-muted">Max size: 5MB</small>
                </div>

                {imagePreview && (
                  <div className="position-relative mb-3">
                    <img
                      src={imagePreview}
                      alt="Shop logo preview"
                      style={{
                        width: '100%',
                        maxHeight: '250px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '2px solid #e0e0e0'
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px'
                      }}
                      onClick={removeImage}
                    >
                      <i className="fas fa-times"></i> Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            <hr style={{margin: '30px 0'}} />

            <div style={{marginTop: '30px'}}>
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
                    <i className="fas fa-save"></i> Save Settings
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
