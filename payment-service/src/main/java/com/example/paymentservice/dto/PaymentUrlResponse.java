package com.example.paymentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PaymentUrlResponse {
    private String code;
    private String message;
    private String paymentUrl;
    private String txnRef;
}
