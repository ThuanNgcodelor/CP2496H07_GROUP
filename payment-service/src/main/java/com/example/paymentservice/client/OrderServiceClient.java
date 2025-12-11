package com.example.paymentservice.client;

import com.example.paymentservice.config.FeignConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@FeignClient(name = "order-service", configuration = FeignConfig.class)
public interface OrderServiceClient {
    
    @PutMapping("/v1/order/internal/update-payment-status/{orderId}")
    Object updatePaymentStatus(
            @PathVariable String orderId,
            @RequestParam String paymentStatus
    );
    
    @PostMapping("/v1/order/internal/create-from-payment")
    Object createOrderFromPayment(@RequestBody Map<String, Object> orderData);
}

