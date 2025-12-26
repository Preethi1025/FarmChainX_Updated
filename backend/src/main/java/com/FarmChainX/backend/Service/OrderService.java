package com.FarmChainX.backend.Service;

import com.FarmChainX.backend.Model.*;
import com.FarmChainX.backend.Repository.*;
import com.FarmChainX.backend.enums.OrderStatus;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

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

        // ---------------- VALIDATION ----------------
        if (consumerId == null || consumerId.isEmpty()) {
            throw new RuntimeException("Consumer ID cannot be null or empty");
        }

        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        if (listing.getQuantity() < requestedQty) {
            throw new RuntimeException("Insufficient quantity available");
        }

        // ---------------- UPDATE LISTING QUANTITY ----------------
        listing.setQuantity(listing.getQuantity() - requestedQty);
        listingRepository.save(listing);

        // ---------------- CALCULATE AMOUNTS ----------------
        double basePrice = listing.getPrice();
        double farmerProfit = basePrice * 0.10 * requestedQty;
        double distributorProfit = basePrice * 0.10 * requestedQty;
        double totalAmount = basePrice * requestedQty;

        // ---------------- CREATE ORDER ----------------
        Order order = new Order();
        order.setListingId(listingId);
        order.setBatchId(listing.getBatchId());

        // 🔒 Ensure correct IDs
        order.setConsumerId(consumerId);                // must come from frontend / logged-in buyer
        order.setDistributorId(listing.getDistributorId()); // must come from listing

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

        // ---------------- LOGGING ----------------
        System.out.println(">>> placeOrder called");
        System.out.println("ListingId: " + listingId);
        System.out.println("ConsumerId (from frontend): " + consumerId);
        System.out.println("DistributorId (from listing): " + listing.getDistributorId());
        System.out.println("RequestedQty: " + requestedQty);
        System.out.println("DeliveryAddress: " + deliveryAddress);
        System.out.println("ContactNumber: " + contactNumber);

        // ---------------- NOTIFY DISTRIBUTOR ----------------
        notifyDistributor(order);

        // ---------------- SAVE ORDER ----------------
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

        // 🔥 AUTO SET TIMELINE
        switch (status) {
            case IN_WAREHOUSE -> {
                if (order.getWarehouseAt() == null) {
                    order.setWarehouseAt(LocalDateTime.now());
                }
            }
            case IN_TRANSIT -> {
                if (order.getInTransitAt() == null) {
                    order.setInTransitAt(LocalDateTime.now());
                }
            }
            case DELIVERED -> {
                if (order.getDeliveredAt() == null) {
                    order.setDeliveredAt(LocalDateTime.now());
                }
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

        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new RuntimeException("Order is already cancelled");
        }

        if (order.getStatus() == OrderStatus.DELIVERED) {
            throw new RuntimeException("Delivered orders cannot be cancelled");
        }

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
        double farmerProfit = order.getFarmerProfit() != null ? order.getFarmerProfit() : 0.0;
        double distributorProfit = order.getDistributorProfit() != null ? order.getDistributorProfit() : 0.0;

        System.out.println("💰 Payment settled");
        System.out.println("Farmer profit: " + farmerProfit);
        System.out.println("Distributor profit: " + distributorProfit);

        Listing listing = listingRepository.findById(order.getListingId()).orElse(null);
        if (listing == null) return;

        User farmer = userRepository.findById(listing.getFarmerId()).orElse(null);
        if (farmer != null) {
            farmer.setBalance((farmer.getBalance() != null ? farmer.getBalance() : 0.0) + farmerProfit);
            userRepository.save(farmer);
        }

        User distributor = userRepository.findById(order.getDistributorId()).orElse(null);
        if (distributor != null) {
            distributor.setBalance((distributor.getBalance() != null ? distributor.getBalance() : 0.0) + distributorProfit);
            userRepository.save(distributor);
        }
    }

    // -------------------- NOTIFICATION --------------------
    private void notifyDistributor(Order order) {
        System.out.println("📢 New order for distributor: " + order.getDistributorId());
    }

    // -------------------- FETCH ORDERS --------------------
    public List<Order> getOrdersByConsumer(String consumerId) {
        return orderRepository.findByConsumerId(consumerId);
    }

    // -------------------- CONSUMER FULL DETAILS --------------------
    public List<OrderDetailsDTO> getOrdersByConsumerFull(String consumerId) {

        return orderRepository.findByConsumerId(consumerId).stream().map(order -> {

            Listing listing = listingRepository.findById(order.getListingId()).orElseThrow();
            Crop crop = cropRepository.findById(listing.getCropId()).orElse(null);
            User farmer = userRepository.findById(listing.getFarmerId()).orElse(null);
            User distributor = userRepository.findById(order.getDistributorId()).orElse(null);

            return buildDTO(order, crop, farmer, distributor);
        }).toList();
    }

    // -------------------- DISTRIBUTOR FULL DETAILS --------------------
    public List<OrderDetailsDTO> getOrdersByDistributorFull(String distributorId) {

        return orderRepository.findByDistributorId(distributorId).stream().map(order -> {

            Listing listing = listingRepository.findById(order.getListingId()).orElseThrow();
            Crop crop = cropRepository.findById(listing.getCropId()).orElse(null);
            User farmer = userRepository.findById(listing.getFarmerId()).orElse(null);
            User distributor = userRepository.findById(distributorId).orElse(null);

            return buildDTO(order, crop, farmer, distributor);
        }).toList();
    }

    // -------------------- DTO BUILDER --------------------
    private OrderDetailsDTO buildDTO(Order order, Crop crop, User farmer, User distributor) {

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

            // 🔥 IMPORTANT LINE
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

}
