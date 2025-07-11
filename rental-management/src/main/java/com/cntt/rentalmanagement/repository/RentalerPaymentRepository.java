package com.cntt.rentalmanagement.repository;

import com.cntt.rentalmanagement.domain.models.RentalerPayment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RentalerPaymentRepository extends JpaRepository<RentalerPayment, Long> {
    Optional<RentalerPayment> findByAppTransId(String appTransId);
}
