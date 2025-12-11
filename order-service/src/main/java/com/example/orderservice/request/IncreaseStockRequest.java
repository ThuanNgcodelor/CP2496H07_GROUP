package com.example.orderservice.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IncreaseStockRequest {
    private String sizeId;
    private Integer quantity;
}

