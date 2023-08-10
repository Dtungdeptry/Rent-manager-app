package com.cntt.rentalmanagement.services;

import com.cntt.rentalmanagement.domain.payload.response.MessageResponse;
import com.cntt.rentalmanagement.domain.payload.response.RequireResponse;
import org.springframework.data.domain.Page;

public interface RequestService {
    Page<RequireResponse> getRequestOfRentHome(String keyword, Integer pageNo, Integer pageSize);

    MessageResponse changeStatusOfRequest(Long id);
}
