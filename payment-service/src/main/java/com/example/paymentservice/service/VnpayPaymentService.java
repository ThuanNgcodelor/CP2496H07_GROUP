package com.example.paymentservice.service;

import com.example.paymentservice.client.OrderServiceClient;
import com.example.paymentservice.config.VnpayProperties;
import com.example.paymentservice.dto.CreateVnpayPaymentRequest;
import com.example.paymentservice.dto.PaymentUrlResponse;
import com.example.paymentservice.enums.PaymentMethod;
import com.example.paymentservice.enums.PaymentStatus;
import com.example.paymentservice.model.Payment;
import com.example.paymentservice.repository.PaymentRepository;
import com.example.paymentservice.util.VnpayUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class VnpayPaymentService {

    private final VnpayProperties props;
    private final PaymentRepository paymentRepository;
    private final OrderServiceClient orderServiceClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public PaymentUrlResponse createPayment(CreateVnpayPaymentRequest req, HttpServletRequest servletRequest) {
        long amountVnd = req.getAmount();
        long amountVnp = amountVnd * 100; // VNPay expects amount x100

        String vnpVersion = "2.1.0";
        String vnpCommand = "pay";
        String vnpTxnRef = randomNumber(12);
        String vnpIpAddr = getClientIp(servletRequest);
        String orderInfo = (StringUtils.hasText(req.getOrderInfo()) ? req.getOrderInfo() : "Thanh toan don hang");
        if (StringUtils.hasText(req.getOrderId())) {
            orderInfo = orderInfo + " - OrderId: " + req.getOrderId();
        }

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnpCreateDate = formatter.format(cld.getTime());
        cld.add(Calendar.MINUTE, 15);
        String vnpExpireDate = formatter.format(cld.getTime());

        Map<String, String> vnpParams = new HashMap<>();
        vnpParams.put("vnp_Version", vnpVersion);
        vnpParams.put("vnp_Command", vnpCommand);
        vnpParams.put("vnp_TmnCode", props.getTmnCode());
        vnpParams.put("vnp_Amount", String.valueOf(amountVnp));
        vnpParams.put("vnp_CurrCode", "VND");
        if (StringUtils.hasText(req.getBankCode())) {
            vnpParams.put("vnp_BankCode", req.getBankCode());
        }
        vnpParams.put("vnp_TxnRef", vnpTxnRef);
        vnpParams.put("vnp_OrderInfo", orderInfo);
        vnpParams.put("vnp_OrderType", "other");
        vnpParams.put("vnp_Locale", StringUtils.hasText(req.getLocale()) ? req.getLocale() : "vn");
        vnpParams.put("vnp_ReturnUrl", StringUtils.hasText(req.getReturnUrl()) ? req.getReturnUrl() : props.getReturnUrl());
        vnpParams.put("vnp_IpAddr", vnpIpAddr);
        vnpParams.put("vnp_CreateDate", vnpCreateDate);
        vnpParams.put("vnp_ExpireDate", vnpExpireDate);

        String queryUrl = VnpayUtil.buildQueryAndHash(vnpParams, props.getHashSecret());
        String paymentUrl = props.getPayUrl() + "?" + queryUrl;

        // Build orderData JSON if provided (for creating order after payment success)
        String orderDataJson = null;
        if (StringUtils.hasText(req.getUserId()) && StringUtils.hasText(req.getAddressId()) && StringUtils.hasText(req.getOrderDataJson())) {
            // Store order data to create order after payment success
            orderDataJson = req.getOrderDataJson();
        }
        
        Payment payment = Payment.builder()
                .orderId(req.getOrderId()) // May be null if order not created yet
                .txnRef(vnpTxnRef)
                .amount(BigDecimal.valueOf(amountVnd))
                .currency("VND")
                .method(PaymentMethod.VNPAY)
                .status(PaymentStatus.PENDING)
                .paymentUrl(paymentUrl)
                .returnUrl(vnpParams.get("vnp_ReturnUrl"))
                .orderData(orderDataJson) // Store order data temporarily
                .build();
        paymentRepository.save(payment);

        return new PaymentUrlResponse("00", "success", paymentUrl, vnpTxnRef);
    }

    public PaymentStatus handleReturn(Map<String, String[]> parameterMap) {
        Map<String, String> params = flattenParams(parameterMap);
        if (!VnpayUtil.verifySecureHash(params, props.getHashSecret())) {
            return PaymentStatus.FAILED;
        }
        String txnRef = params.get("vnp_TxnRef");
        String responseCode = params.get("vnp_ResponseCode");
        String transactionStatus = params.get("vnp_TransactionStatus");
        String bankCode = params.get("vnp_BankCode");
        String cardType = params.get("vnp_CardType");
        String gatewayTxnNo = params.get("vnp_TransactionNo");

        Payment payment = paymentRepository.findByTxnRef(txnRef)
                .orElse(null);
        if (payment == null) {
            return PaymentStatus.FAILED;
        }

        boolean success = "00".equals(responseCode) && "00".equals(transactionStatus);
        payment.setStatus(success ? PaymentStatus.PAID : PaymentStatus.FAILED);
        payment.setResponseCode(responseCode);
        payment.setGatewayTxnNo(gatewayTxnNo);
        payment.setBankCode(bankCode);
        payment.setCardType(cardType);
        payment.setRawCallback(params.toString());
        paymentRepository.save(payment);

        if (success) {
            // If order already exists, just update status
            if (payment.getOrderId() != null && !payment.getOrderId().trim().isEmpty()) {
                try {
                    orderServiceClient.updatePaymentStatus(payment.getOrderId(), "PAID");
                    log.info("[PAYMENT] Updated existing order {} status to PAID", payment.getOrderId());
                } catch (Exception e) {
                    log.error("[PAYMENT] Failed to update order status for orderId: {}", payment.getOrderId(), e);
                }
            } 
            // If order doesn't exist yet, create it from orderData
            else if (payment.getOrderData() != null && !payment.getOrderData().trim().isEmpty()) {
                try {
                    Map<String, Object> orderDataMap = objectMapper.readValue(payment.getOrderData(), Map.class);
                    Object orderResult = orderServiceClient.createOrderFromPayment(orderDataMap);
                    if (orderResult instanceof Map) {
                        Map<String, Object> resultMap = (Map<String, Object>) orderResult;
                        String orderId = (String) resultMap.get("orderId");
                        if (orderId != null) {
                            payment.setOrderId(orderId);
                            paymentRepository.save(payment);
                            log.info("[PAYMENT] Created order {} from payment data", orderId);
                        }
                    }
                } catch (Exception e) {
                    log.error("[PAYMENT] Failed to create order from payment data: {}", e.getMessage(), e);
                    // Don't fail payment processing, but log error
                }
            }
        } else {
            // Payment failed - rollback if order exists
            if (payment.getOrderId() != null && !payment.getOrderId().trim().isEmpty()) {
                try {
                    orderServiceClient.updatePaymentStatus(payment.getOrderId(), "FAILED");
                    log.info("[PAYMENT] Updated order {} payment status to FAILED", payment.getOrderId());
                } catch (Exception e) {
                    log.error("[PAYMENT] Failed to update order status for orderId: {}", payment.getOrderId(), e);
                }
            }
            // If no order was created, just log - no rollback needed
        }

        return payment.getStatus();
    }

    private Map<String, String> flattenParams(Map<String, String[]> parameterMap) {
        Map<String, String> flat = new HashMap<>();
        if (parameterMap == null) return flat;
        for (Map.Entry<String, String[]> entry : parameterMap.entrySet()) {
            if (entry.getValue() != null && entry.getValue().length > 0) {
                flat.put(entry.getKey(), entry.getValue()[0]);
            }
        }
        return flat;
    }

    private String randomNumber(int len) {
        Random rnd = new Random();
        String chars = "0123456789";
        StringBuilder sb = new StringBuilder(len);
        for (int i = 0; i < len; i++) {
            sb.append(chars.charAt(rnd.nextInt(chars.length())));
        }
        return sb.toString();
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-FORWARDED-FOR");
        if (ip != null && !ip.trim().isEmpty()) {
            return ip.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}