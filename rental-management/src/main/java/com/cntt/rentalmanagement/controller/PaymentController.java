package com.cntt.rentalmanagement.controller;

import com.cntt.rentalmanagement.domain.models.RentalerPayment;
import com.cntt.rentalmanagement.services.RentalerPaymentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.*;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private final RentalerPaymentService paymentService;

    // ZaloPay credentials
    private final int APP_ID = 2554;
    private final String KEY1 = "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn";
    private final String KEY2 = "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf";

    public PaymentController(RentalerPaymentService paymentService) {
        this.paymentService = paymentService;
    }

    private String createMac(String data, String key) throws Exception {
        Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
        SecretKeySpec secret_key = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        sha256_HMAC.init(secret_key);
        byte[] hash = sha256_HMAC.doFinal(data.getBytes(StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder(2 * hash.length);
        for (byte b : hash) {
            sb.append(String.format("%02x", b & 0xff));
        }
        return sb.toString();
    }

    @PostMapping("/rentaler")
    public ResponseEntity<?> createRentalerPayment(@RequestBody Map<String, Object> payload) {
        try {
            Object userIdObj = payload.get("userId");
            if (userIdObj == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "userId is missing"));
            }

            Long userId;
            try {
                if (userIdObj instanceof Number) {
                    userId = ((Number) userIdObj).longValue();
                } else {
                    userId = Long.parseLong(userIdObj.toString());
                }
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest().body(Map.of("error", "userId must be a number"));
            }

            Object amountObj = payload.get("amount");
            if (amountObj == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "amount is missing"));
            }

            int amount;
            try {
                amount = Integer.parseInt(amountObj.toString());
                if (amount <= 0) {
                    return ResponseEntity.badRequest().body(Map.of("error", "amount must be greater than 0"));
                }
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest().body(Map.of("error", "amount must be a number"));
            }

            RentalerPayment payment = paymentService.createPayment(userId, amount);

            // ✅ Tạo item dạng List và chuyển sang JSON
            ObjectMapper objectMapper = new ObjectMapper();
            List<Map<String, Object>> itemList = new ArrayList<>();
            Map<String, Object> itemMap = new HashMap<>();
            itemMap.put("name", "Phí thuê Rentaler");
            itemMap.put("quantity", 1);
            itemMap.put("price", amount);
            itemList.add(itemMap);

            String itemJson = objectMapper.writeValueAsString(itemList);
            String embedData = "{}";
            String description = "Thanh toán phí thuê nhà";

            String dataToSign = String.format("%d|%s|%s|%d|%s|%s",
                    APP_ID, payment.getAppTransId(), userId, amount, embedData, itemJson);

            String mac = createMac(dataToSign, KEY1);

            Map<String, Object> zalopayPayload = new HashMap<>();
            zalopayPayload.put("app_id", APP_ID);
            zalopayPayload.put("app_trans_id", payment.getAppTransId());
            zalopayPayload.put("app_user", userId);
            zalopayPayload.put("amount", amount);
            zalopayPayload.put("item", itemList); // ✅ item dạng JSON string
            zalopayPayload.put("description", description);
            zalopayPayload.put("embed_data", embedData);
            zalopayPayload.put("callback_url", "https://ce55-27-79-141-81.ngrok-free.app/api/payment/callback");
            zalopayPayload.put("mac", mac);

            // ✅ In ra request gửi đi để debug
            System.out.println("GỬI DỮ LIỆU ĐI ZALOPAY:");
            System.out.println(objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(zalopayPayload));

            org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
            Map<String, Object> zalopayResponse = restTemplate.postForObject("https://sb-openapi.zalopay.vn/v2/create", zalopayPayload, Map.class);

            if (zalopayResponse != null && Integer.valueOf(1).equals(zalopayResponse.get("return_code"))) {
                Map<String, String> result = new HashMap<>();
                result.put("order_url", (String) zalopayResponse.get("order_url"));
                result.put("app_trans_id", payment.getAppTransId());
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.status(400).body(zalopayResponse);
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/callback")
    public ResponseEntity<?> paymentCallback(@RequestBody Map<String, Object> callbackData) {
        System.out.println("ZaloPay callback data: " + callbackData);

        String appTransId = (String) callbackData.get("apptransid");
        int returnCode = (Integer) callbackData.get("returncode");

        Optional<RentalerPayment> paymentOpt = paymentService.findByAppTransId(appTransId);

        if (paymentOpt.isPresent()) {
            RentalerPayment payment = paymentOpt.get();
            if (returnCode == 1) {
                paymentService.updateStatus(payment, "SUCCESS");
            } else {
                paymentService.updateStatus(payment, "FAILED");
            }
        } else {
            System.err.println("Không tìm thấy đơn hàng với appTransId: " + appTransId);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("return_code", 1);
        response.put("return_message", "success");
        return ResponseEntity.ok(response);
    }
}
