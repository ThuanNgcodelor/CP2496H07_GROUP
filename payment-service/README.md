## payment-service (VNPay sandbox)

Các endpoint
- `POST /v1/payment/vnpay/create`
  - Body: `{ amount, orderId?, orderInfo?, bankCode?, locale?, returnUrl? }`
  - Trả: `{ code, message, paymentUrl, txnRef }`
  - Lưu Payment status = PENDING, method = VNPAY.
- `GET /v1/payment/vnpay/return`
  - Đọc query VNPay, verify `vnp_SecureHash`, cập nhật Payment status PAID/FAILED, lưu callback.
  - Trả `{ status }`.

Payment model
- id (UUID), orderId, txnRef (unique), amount (VND), currency, method, status, bankCode, cardType, gatewayTxnNo, responseCode, message, paymentUrl, returnUrl, rawCallback, createdAt, updatedAt.

Cấu hình chính (`application.properties`)
- `vnpay.tmn-code`, `vnpay.hash-secret`, `vnpay.pay-url`, `vnpay.return-url`, `vnpay.api-url`
- `spring.config.import=optional:configserver:http://localhost:8888/`
- `eureka.client.service-url.defaultZone=http://localhost:8761/eureka`
- Datasource mẫu MySQL + JPA `ddl-auto=update` (sửa user/pass thực tế).

Luồng khuyến nghị
1) FE tạo order (PENDING) ở order-service.
2) FE gọi `/vnpay/create`, nhận `paymentUrl`, redirect VNPay.
3) VNPay redirect về `vnpay.return-url` (public/gateway), service verify hash, cập nhật Payment.
4) (Tương lai) phát Kafka event `payment-success/failed` để order-service cập nhật trạng thái.

Việc cần làm thêm
- IPN endpoint (server-to-server) để chắc chắn khi user không quay lại.
- Kafka event sau khi cập nhật Payment.
- Đồng bộ OrderStatus qua API/Kafka.
- querydr/refund nếu cần đối soát/hoàn tiền.

