package com.example.paymentservice.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateVnpayPaymentRequest {
    @NotNull
    @Min(1)
    private Long amount; // VNĐ, chưa nhân 100

    private String orderInfo;
    private String orderId; // Optional - only if order already exists
    private String locale;
    private String bankCode;
    private String returnUrl;
    
    // Order data to create order after payment success
    private String userId;
    private String addressId;
    private String orderDataJson; // JSON string of selectedItems
}
