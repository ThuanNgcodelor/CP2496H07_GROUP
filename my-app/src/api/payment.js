import createApiInstance from "./createApiInstance.js";

const API_URL = "/v1/payment";
const api = createApiInstance(API_URL);

/**
 * Tạo URL thanh toán VNPay
 * @param {{amount:number, orderId?:string, orderInfo?:string, bankCode?:string, locale?:string, returnUrl?:string}} payload
 * @returns {Promise<{paymentUrl:string, txnRef:string}>}
 */
export const createVnpayPayment = async (payload) => {
  const { data } = await api.post("/vnpay/create", payload);
  return data;
};

