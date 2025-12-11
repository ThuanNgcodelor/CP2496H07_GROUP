package com.example.stockservice.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReviewRequest {
    private String userId;
    private String username; // Pass from FE if auth is loose, or fetch in BE
    private String userAvatar;
    private String productId;
    private int rating;
    private String comment;
    private List<String> imageIds;
}