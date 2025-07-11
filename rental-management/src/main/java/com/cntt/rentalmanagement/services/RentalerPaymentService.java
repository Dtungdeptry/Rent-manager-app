package com.cntt.rentalmanagement.services;

import com.cntt.rentalmanagement.domain.models.RentalerPayment;
import com.cntt.rentalmanagement.repository.RentalerPaymentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class RentalerPaymentService {
    private final RentalerPaymentRepository repository;

    public RentalerPaymentService(RentalerPaymentRepository repository) {
        this.repository = repository;
    }

    public String generateAppTransId() {
        String dateStr = java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("yyMMdd"));
        int rand = new Random().nextInt(10000);
        return dateStr + "_" + rand;
    }

    public RentalerPayment createPayment(Long userId, int amount) {
        String appTransId = generateAppTransId();

        RentalerPayment payment = new RentalerPayment();
        payment.setAppTransId(appTransId);
        payment.setUserId(userId);
        payment.setAmount(amount);
        payment.setStatus("PENDING");
        payment.setCreatedAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());

        return repository.save(payment);
    }

    public Optional<RentalerPayment> findByAppTransId(String appTransId) {
        return repository.findByAppTransId(appTransId);
    }

    public RentalerPayment updateStatus(RentalerPayment payment, String status) {
        payment.setStatus(status);
        payment.setUpdatedAt(LocalDateTime.now());
        return repository.save(payment);
    }
}
