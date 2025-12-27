package com.FarmChainX.backend.Service;

import com.FarmChainX.backend.Model.*;
import com.FarmChainX.backend.Repository.*;
import com.FarmChainX.backend.enums.OrderStatus;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
public class OrderService {

    @Autowired
    private ListingRepository listingRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CropRepository cropRepository;

    @Autowired
    private UserRepository userRepository;

    // -------------------- PLACE ORDER --------------------
    @Transactional
    public Order placeOrder(
            Long listingId,
            String consumerId,
            Double requestedQty,
            String deliveryAddress,
            String contactNumber
    ) {

        if (consumerId == null || consumerId.isEmpty()) {
            throw new RuntimeException("Consumer ID cannot be null or empty");
        }

        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        if (listing.getQuantity() < requestedQty) {
            throw new RuntimeException("Insufficient quantity available");
        }

        listing.setQuantity(listing.getQuantity() - requestedQty);
        listingRepository.save(listing);

        double basePrice = listing.getPrice();
        double farmerProfit = basePrice * 0.10 * requestedQty;
        double distributorProfit = basePrice * 0.10 * requestedQty;
        double totalAmount = basePrice * requestedQty;

        Order order = new Order();
        order.setListingId(listingId);
        order.setBatchId(listing.getBatchId());

        order.setConsumerId(consumerId);
        order.setDistributorId(listing.getDistributorId());

        order.setQuantity(requestedQty);
        order.setPricePerKg(basePrice);
        order.setTotalAmount(totalAmount);
        order.setFarmerProfit(farmerProfit);
        order.setDistributorProfit(distributorProfit);

        order.setDeliveryAddress(deliveryAddress);
        order.setContactNumber(contactNumber);

        order.setStatus(OrderStatus.ORDER_PLACED);
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());

        notifyDistributor(order);

        return orderRepository.save(order);
    }

    // -------------------- UPDATE ORDER STATUS --------------------
    @Transactional
    public Order updateOrderStatus(Long orderId, OrderStatus status, String distributorId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getDistributorId().equals(distributorId)) {
            throw new RuntimeException("Unauthorized distributor");
        }

        order.setStatus(status);
        order.setUpdatedAt(LocalDateTime.now());

        switch (status) {
            case IN_WAREHOUSE -> {
                if (order.getWarehouseAt() == null)
                    order.setWarehouseAt(LocalDateTime.now());
            }
            case IN_TRANSIT -> {
                if (order.getInTransitAt() == null)
                    order.setInTransitAt(LocalDateTime.now());
            }
            case DELIVERED -> {
                if (order.getDeliveredAt() == null)
                    order.setDeliveredAt(LocalDateTime.now());
                settlePayment(order);
            }
        }

        return orderRepository.save(order);
    }

    // -------------------- SET EXPECTED DELIVERY --------------------
    @Transactional
    public Order setExpectedDelivery(Long orderId, String distributorId, LocalDateTime expectedDelivery) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getDistributorId().equals(distributorId)) {
            throw new RuntimeException("Unauthorized distributor");
        }

        order.setExpectedDelivery(expectedDelivery);
        order.setUpdatedAt(LocalDateTime.now());

        return orderRepository.save(order);
    }

    // -------------------- CANCEL ORDER --------------------
    @Transactional
    public Order cancelOrder(Long orderId, String distributorId, String reason) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getDistributorId().equals(distributorId)) {
            throw new RuntimeException("Unauthorized distributor");
        }

        if (order.getStatus() == OrderStatus.CANCELLED)
            throw new RuntimeException("Order already cancelled");

        if (order.getStatus() == OrderStatus.DELIVERED)
            throw new RuntimeException("Delivered orders cannot be cancelled");

        Listing listing = listingRepository.findById(order.getListingId())
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        listing.setQuantity(listing.getQuantity() + order.getQuantity());
        listingRepository.save(listing);

        order.setStatus(OrderStatus.CANCELLED);
        order.setCancelReason(reason);
        order.setCancelledAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());

        return orderRepository.save(order);
    }

    // -------------------- PAYMENT SPLIT --------------------
    private void settlePayment(Order order) {

        Listing listing = listingRepository.findById(order.getListingId()).orElse(null);
        if (listing == null) return;

        User farmer = userRepository.findById(listing.getFarmerId()).orElse(null);
        if (farmer != null) {
            farmer.setBalance((farmer.getBalance() != null ? farmer.getBalance() : 0)
                    + order.getFarmerProfit());
            userRepository.save(farmer);
        }

        User distributor = userRepository.findById(order.getDistributorId()).orElse(null);
        if (distributor != null) {
            distributor.setBalance((distributor.getBalance() != null ? distributor.getBalance() : 0)
                    + order.getDistributorProfit());
            userRepository.save(distributor);
        }
    }

    // -------------------- NOTIFICATION --------------------
    private void notifyDistributor(Order order) {
        System.out.println("📢 New order for distributor: " + order.getDistributorId());
    }

    // -------------------- BASIC FETCH --------------------
    public List<Order> getOrdersByConsumer(String consumerId) {
        return orderRepository.findByConsumerId(consumerId);
    }

    // -------------------- CONSUMER FULL DETAILS (SAFE) --------------------
    public List<OrderDetailsDTO> getOrdersByConsumerFull(String consumerId) {

        return orderRepository.findByConsumerId(consumerId).stream()
                .map(order -> buildSafeDTO(order))
                .filter(Objects::nonNull)
                .toList();
    }

    // -------------------- DISTRIBUTOR FULL DETAILS (SAFE) --------------------
    public List<OrderDetailsDTO> getOrdersByDistributorFull(String distributorId) {

        return orderRepository.findByDistributorId(distributorId).stream()
                .map(order -> buildSafeDTO(order))
                .filter(Objects::nonNull)
                .toList();
    }

    // -------------------- SAFE DTO BUILDER --------------------
    private OrderDetailsDTO buildSafeDTO(Order order) {

        Listing listing = listingRepository.findById(order.getListingId()).orElse(null);
        if (listing == null) return null;

        Crop crop = cropRepository.findById(listing.getCropId()).orElse(null);
        User farmer = userRepository.findById(listing.getFarmerId()).orElse(null);
        User distributor = userRepository.findById(order.getDistributorId()).orElse(null);

        OrderDetailsDTO dto = new OrderDetailsDTO();

        dto.setOrderId(order.getOrderId());
        dto.setOrderCode("ORD-" + order.getOrderId());
        dto.setQuantity(order.getQuantity());
        dto.setPricePerKg(order.getPricePerKg());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setCancelReason(order.getCancelReason());

        dto.setExpectedDelivery(order.getExpectedDelivery());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setWarehouseAt(order.getWarehouseAt());
        dto.setInTransitAt(order.getInTransitAt());
        dto.setDeliveredAt(order.getDeliveredAt());
        dto.setCancelledAt(order.getCancelledAt());

        dto.setDeliveryAddress(order.getDeliveryAddress());
        dto.setContactNumber(order.getContactNumber());

        if (crop != null) {
            dto.setCropName(crop.getCropName());
            dto.setCropType(crop.getCropType());
            dto.setCropImageUrl(crop.getCropImageUrl());
        }

        if (farmer != null) {
            dto.setFarmerName(farmer.getName());
            dto.setFarmerContact(farmer.getPhone());
        }

        if (distributor != null) {
            dto.setDistributorName(distributor.getName());
            dto.setDistributorContact(distributor.getPhone());
        }

        return dto;
    }
    public List<Order> getOrdersByFarmer(String farmerId) {
        // Assuming Order has a farmerId field
        return orderRepository.findByFarmerId(farmerId);
    }
    public void cancelOrder(Long orderId, String reason) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(OrderStatus.CANCELLED);
        order.setCancelReason(reason);
        order.setCancelledAt(LocalDateTime.now());
        orderRepository.save(order);

        // Notify distributor logic here
    }


}
