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

        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        if (listing.getQuantity() < requestedQty) {
            throw new RuntimeException("Insufficient quantity available");
        }

        // Reduce stock
        listing.setQuantity(listing.getQuantity() - requestedQty);
        listingRepository.save(listing);

        double basePrice = listing.getPrice();
        double farmerProfit = basePrice * 0.10 * requestedQty;
        double distributorProfit = basePrice * 0.10 * requestedQty;
        double totalAmount = (basePrice * requestedQty)
                + farmerProfit
                + distributorProfit;

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

        // ✅ STORE DELIVERY DETAILS
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

        // On delivery → profit settlement
        if (status == OrderStatus.DELIVERED) {
            settlePayment(order);
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

    // -------------------- PAYMENT SPLIT --------------------
    private void settlePayment(Order order) {
        // Placeholder for wallet / payment gateway
        System.out.println("💰 Payment settled");
        System.out.println("Farmer profit: " + order.getFarmerProfit());
        System.out.println("Distributor profit: " + order.getDistributorProfit());
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
        dto.setExpectedDelivery(order.getExpectedDelivery());
        dto.setCreatedAt(order.getCreatedAt());

        if (crop != null) {
            dto.setCropName(crop.getCropName());
            dto.setCropType(crop.getCropType());
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
