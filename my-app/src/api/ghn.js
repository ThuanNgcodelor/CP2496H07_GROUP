import axios from 'axios';

const GHN_API_URL = 'https://dev-online-gateway.ghn.vn/shiip/public-api';

// const GHN_TOKEN = 'd89f1716-d033-11f0-98c5-9a470762d0ab';
// const GHN_SHOP_ID = '6147002';
const GHN_TOKEN = '57404b9d-d3e9-11f0-a3d6-dac90fb956b5';
const GHN_SHOP_ID = '198371';

const ghnApi = axios.create({
    baseURL: GHN_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Token': GHN_TOKEN,
        'ShopId': GHN_SHOP_ID.toString()
    }
});

if (import.meta.env.DEV) {
    console.log('GHN API Config:', {
        url: GHN_API_URL,
        tokenSet: !!GHN_TOKEN && GHN_TOKEN !== 'demo-token-change-me',
        tokenPreview: GHN_TOKEN ? `${GHN_TOKEN.substring(0, 10)}...` : 'NOT SET',
        shopId: GHN_SHOP_ID
    });
}

/**
 * Get all provinces
 */
export const getProvinces = async () => {

    try {
        const response = await ghnApi.get('/master-data/province');
        
        if (import.meta.env.DEV) {
            console.log('GHN API Response:', {
                status: response.status,
                code: response.data?.code,
                message: response.data?.message
            });
        }
        
        if (response.data?.code === 200 && response.data?.data) {
            return response.data.data;
        }
        return [];
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch provinces');
    }
};

/**
 * Get districts by province ID
 */
export const getDistricts = async (provinceId) => {
    try {
        const response = await ghnApi.get('/master-data/district', {
            params: { province_id: provinceId }
        });
        if (response.data?.code === 200 && response.data?.data) {
            return response.data.data;
        }
        return [];
    } catch (error) {
        console.error('Error fetching districts:', error);
        throw new Error('Failed to fetch districts');
    }
};

/**
 * Get wards by district ID
 */
export const getWards = async (districtId) => {
    try {
        const response = await ghnApi.get('/master-data/ward', {
            params: { district_id: districtId }
        });
        if (response.data?.code === 200 && response.data?.data) {
            return response.data.data;
        }
        return [];
    } catch (error) {
        console.error('Error fetching wards:', error);
        throw new Error('Failed to fetch wards');
    }
};

/**
 * Calculate shipping fee
 */
export const calculateShippingFee = async (data) => {
    try {
        const response = await ghnApi.post('/v2/shipping-order/fee', data);
        if (response.data?.code === 200) {
            return response.data.data;
        }
        throw new Error(response.data?.message || 'Failed to calculate shipping fee');
    } catch (error) {
        console.error('Error calculating shipping fee:', error);
        throw error;
    }
};

