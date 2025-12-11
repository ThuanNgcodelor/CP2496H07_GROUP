package com.example.paymentservice.config;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Getter
@Setter
@Validated
@ConfigurationProperties(prefix = "vnpay")
public class VnpayProperties {

    /**
     * Terminal code được VNPay cấp cho merchant.
     */
    @NotBlank
    private String tmnCode;

    /**
     * Hash secret để ký HmacSHA512.
     */
    @NotBlank
    private String hashSecret;

    /**
     * URL thanh toán (sandbox/prod).
     */
    @NotBlank
    private String payUrl;

    /**
     * Return URL mà VNPay redirect sau khi thanh toán.
     */
    @NotBlank
    private String returnUrl;

    /**
     * API URL cho querydr / refund (dùng sau).
     */
    @NotBlank
    private String apiUrl;
}

