package com.example.paymentservice.controller;



import com.example.paymentservice.dto.CreateVnpayPaymentRequest;
import com.example.paymentservice.dto.PaymentUrlResponse;
import com.example.paymentservice.enums.PaymentStatus;
import com.example.paymentservice.service.VnpayPaymentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/v1/payment/vnpay")
@RequiredArgsConstructor
public class PaymentController {

    private final VnpayPaymentService vnpayPaymentService;

    @PostMapping("/create")
    public ResponseEntity<PaymentUrlResponse> createPayment(@Valid @RequestBody CreateVnpayPaymentRequest req,
                                                            HttpServletRequest servletRequest) {
        PaymentUrlResponse response = vnpayPaymentService.createPayment(req, servletRequest);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/return")
    public ResponseEntity<?> handleReturn(HttpServletRequest request) {
        PaymentStatus status = vnpayPaymentService.handleReturn(request.getParameterMap());
        Map<String, String> response = new HashMap<>();
        response.put("status", status.name());
        return ResponseEntity.ok(response);
    }
}