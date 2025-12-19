package com.FarmChainX.backend.Controller;

import com.FarmChainX.backend.Model.Order;
import com.FarmChainX.backend.Model.OrderDetailsDTO;
import com.FarmChainX.backend.Service.OrderService;
import com.FarmChainX.backend.enums.OrderStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // -------------------- PLACE ORDER --------------------
    @PostMapping("/place")
    public Order placeOrder(
            @RequestParam Long listingId,
            @RequestParam String consumerId,
            @RequestParam Double quantity,
            @RequestParam String deliveryAddress,
            @RequestParam String contactNumber
    ) {
        return orderService.placeOrder(
                listingId,
                consumerId,
                quantity,
                deliveryAddress,
                contactNumber
        );
    }


    // -------------------- UPDATE ORDER STATUS --------------------
    @PutMapping("/{orderId}/status")
    public Order updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status,
            @RequestParam String distributorId
    ) {
        return orderService.updateOrderStatus(orderId, status, distributorId);
    }

    // -------------------- SET EXPECTED DELIVERY --------------------
    @PutMapping("/{orderId}/expected-delivery")
    public Order setExpectedDelivery(
            @PathVariable Long orderId,
            @RequestParam String distributorId,
            @RequestParam String expectedDelivery
    ) {
        return orderService.setExpectedDelivery(
                orderId,
                distributorId,
                LocalDateTime.parse(expectedDelivery)
        );
    }

    // -------------------- CONSUMER ORDERS --------------------
    @GetMapping("/consumer/{consumerId}")
    public List<Order> getOrdersByConsumer(@PathVariable String consumerId) {
        return orderService.getOrdersByConsumer(consumerId);
    }

    // -------------------- CONSUMER ORDERS (FULL DETAILS) --------------------
    @GetMapping("/consumer/{consumerId}/full")
    public List<OrderDetailsDTO> getOrdersByConsumerFull(@PathVariable String consumerId) {
        return orderService.getOrdersByConsumerFull(consumerId);
    }

    // -------------------- DISTRIBUTOR ORDERS (FULL DETAILS) --------------------
    @GetMapping("/distributor/{distributorId}")
    public List<OrderDetailsDTO> getOrdersByDistributorFull(@PathVariable String distributorId) {
        return orderService.getOrdersByDistributorFull(distributorId);
    }
}
