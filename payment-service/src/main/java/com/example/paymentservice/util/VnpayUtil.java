package com.example.paymentservice.util;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

public final class VnpayUtil {
    private VnpayUtil() {
    }

    public static String hmacSHA512(String key, String data) {
        try {
            Mac hmac512 = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac512.init(secretKey);
            byte[] result = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(2 * result.length);
            for (byte b : result) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();
        } catch (Exception e) {
            return "";
        }
    }

    public static String buildQueryAndHash(Map<String, String> params, String secret) {
        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = params.get(fieldName);
            if (fieldValue != null && !fieldValue.trim().isEmpty()) {
                hashData.append(fieldName);
                hashData.append("=");
                hashData.append(encode(fieldValue));

                query.append(encode(fieldName));
                query.append("=");
                query.append(encode(fieldValue));
                if (itr.hasNext()) {
                    query.append("&");
                    hashData.append("&");
                }
            }
        }

        String secureHash = hmacSHA512(secret, hashData.toString());
        query.append("&vnp_SecureHash=").append(secureHash);
        return query.toString();
    }

    public static boolean verifySecureHash(Map<String, String> params, String secret) {
        if (params == null || !params.containsKey("vnp_SecureHash")) {
            return false;
        }
        String receivedHash = params.get("vnp_SecureHash");
        Map<String, String> toHash = new HashMap<>(params);
        toHash.remove("vnp_SecureHash");
        toHash.remove("vnp_SecureHashType");

        List<String> fieldNames = new ArrayList<>(toHash.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = toHash.get(fieldName);
            if (fieldValue != null && !fieldValue.trim().isEmpty()) {
                hashData.append(fieldName);
                hashData.append("=");
                hashData.append(encode(fieldValue));
                if (itr.hasNext()) {
                    hashData.append("&");
                }
            }
        }
        String calcHash = hmacSHA512(secret, hashData.toString());
        return calcHash.equalsIgnoreCase(receivedHash);
    }

    private static String encode(String input) {
        try {
            return URLEncoder.encode(input, StandardCharsets.US_ASCII.name());
        } catch (Exception e) {
            return input;
        }
    }
}

