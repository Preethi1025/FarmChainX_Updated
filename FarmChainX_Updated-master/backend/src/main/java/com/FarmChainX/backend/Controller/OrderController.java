package com.FarmChainX.backend.Controller;

import com.FarmChainX.backend.Model.Order;
import com.FarmChainX.backend.Service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin("*")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // Buyer Dashboard
    @GetMapping("/buyer/dashboard/{buyerId}")
    public Map<String, Object> buyerDashboard(
            @PathVariable String buyerId
    ) {
        return orderService.getBuyerDashboard(buyerId);
    }

    // Add to cart
    @PostMapping("/cart")
    public Order addToCart(@RequestBody Order order) {
        return orderService.addToCart(order);
    }

    // Buy now / place order
    @PostMapping("/place")
    public Order placeOrder(@RequestBody Order order) {
        return orderService.placeOrder(order);
    }
}
