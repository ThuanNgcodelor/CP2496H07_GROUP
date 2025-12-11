package com.example.userservice.service.role;

import com.example.userservice.dto.FullShopRegistrationRequest;
import com.example.userservice.enums.RequestStatus;
import com.example.userservice.enums.Role;
import com.example.userservice.exception.NotFoundException;
import com.example.userservice.model.*;
import com.example.userservice.repository.RoleRequestRepository;
import com.example.userservice.repository.ShopOwnerRepository;
import com.example.userservice.repository.UserRepository;
import com.example.userservice.request.RoleRequestRequest;
import com.example.userservice.request.ShopOwnerRegisterRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
@Slf4j
@Service
@RequiredArgsConstructor
public class RoleRequestService {
    private final RoleRequestRepository roleRequestRepository;
    private final UserRepository userRepository;
    private final ShopOwnerRepository shopOwnerRepository;

    public RoleRequest getRoleRequestById(String requestId){
        return roleRequestRepository.findById(requestId)
                .orElseThrow(() -> new NotFoundException("404"));
    }

    private void createRoleRequestRecord(User user, RoleRequestRequest roleRequestData) {
        // Kiểm tra spam request
        boolean existsPending = roleRequestRepository.existsByUserAndStatus(user, RequestStatus.PENDING);
        if (existsPending) {
            throw new RuntimeException("Your request has already been pending.");
        }

        // Chặn tạo request nếu role đã được duyệt hoặc user đã có role đó
        Role requestedRole = Role.valueOf(roleRequestData.getRole());
        boolean hasRoleAlready = user.getRoles() != null && user.getRoles().contains(requestedRole);
        boolean existsApproved = roleRequestRepository
                .findByUserIdAndRequestedRoleAndStatus(user.getId(), requestedRole, RequestStatus.APPROVED)
                .isPresent();
        if (hasRoleAlready || existsApproved) {
            throw new RuntimeException("You already have this role approved.");
        }

        RoleRequest newRequest = RoleRequest.builder()
                .user(user)
                .requestedRole(requestedRole)
                .reason(roleRequestData.getReason())
                .status(RequestStatus.PENDING)
                .build();

        roleRequestRepository.save(newRequest);
    }

    @Transactional
    public void createShopOwner(String userId, FullShopRegistrationRequest fullRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        createShopOwnerProfile(user, fullRequest.getShopDetails());

        createRoleRequestRecord(user, fullRequest.getRoleRequest());
    }
    @Transactional
    public RoleRequest approveRequest(String requestId, String adminId, String adminNote) {
        RoleRequest request = roleRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        
        if (request.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Request is not pending");
        }
        
        String userId = request.getUser().getId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Role requestedRole = request.getRequestedRole();
        
        // Add role to user
        user.getRoles().add(requestedRole);
        userRepository.saveAndFlush(user);
        
        // Create ShopOwner profile if role is SHOP_OWNER
//        if (requestedRole == Role.SHOP_OWNER) {
//            createShopOwnerProfile(userId);
//        }
        
        request.setStatus(RequestStatus.APPROVED);
        request.setReviewedBy(adminId);
        request.setReviewedAt(LocalDateTime.now());
        request.setAdminNote(adminNote);

        return roleRequestRepository.save(request);
    }
    
    @Transactional
    public RoleRequest rejectRequest(String requestId, String adminId, String rejectionReason) {
        RoleRequest request = roleRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        
        if (request.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Request is not pending");
        }
        
        request.setStatus(RequestStatus.REJECTED);
        request.setReviewedBy(adminId);
        request.setReviewedAt(LocalDateTime.now());
        request.setRejectionReason(rejectionReason);
        
        return roleRequestRepository.save(request);
    }
    
    public List<RoleRequest> getPendingRequests() {
        return roleRequestRepository.findByStatusOrderByCreationTimestampDesc(RequestStatus.PENDING);
    }
    
    public List<RoleRequest> getUserRequests(String userId) {
        return roleRequestRepository.findByUserIdOrderByCreationTimestampDesc(userId);
    }

    private void createShopOwnerProfile(User user, ShopOwnerRegisterRequest request) {

        if (shopOwnerRepository.existsById(user.getId())) {
            return;
        }

        // Tạo chuỗi địa chỉ hiển thị
        String fullAddress = String.format("%s, %s, %s, %s",
                request.getStreetAddress(),
                request.getWardName(),
                request.getDistrictName(),
                request.getProvinceName());

        ShopOwner shopOwner = ShopOwner.builder()
                .user(user) // User đã map ID
                .shopName(request.getShopName())   // SỬA LỖI 1: Lấy từ request
                .ownerName(request.getOwnerName()) // SỬA LỖI 1: Lấy từ request
                .phone(request.getPhone())         // Đừng quên số điện thoại
                .address(fullAddress)              // SỬA LỖI 3: Lưu địa chỉ full

                // Logic mặc định
                .verified(false)      // SỬA LỖI 2: Mới tạo phải là false chờ duyệt
                .totalRatings(0)
                .followersCount(0)
                .followingCount(0)

                // Mapping địa chỉ GHN
                .provinceId(request.getProvinceId())
                .provinceName(request.getProvinceName())
                .districtId(request.getDistrictId())
                .districtName(request.getDistrictName())
                .wardCode(request.getWardCode())
                .wardName(request.getWardName())
                .streetAddress(request.getStreetAddress())

                // Tọa độ
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .build();

        shopOwnerRepository.save(shopOwner);
    }
}
