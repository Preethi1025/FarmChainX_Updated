package com.FarmChainX.backend.Service;

import com.FarmChainX.backend.Model.Crop;
import com.FarmChainX.backend.Model.Order;
import com.FarmChainX.backend.Repository.CropRepository;
import com.FarmChainX.backend.Repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OrderService {

    private final OrderRepository orderRepo;
    @Autowired
    private CropRepository cropRepo;


    public OrderService(OrderRepository orderRepo) {
        this.orderRepo = orderRepo;
    }

    public Map<String, Object> getBuyerDashboard(String buyerId) {

        Map<String, Object> data = new HashMap<>();

        data.put("totalOrders",
                orderRepo.countByBuyerId(buyerId));

        data.put("pendingOrders",
                orderRepo.countByBuyerIdAndStatus(buyerId, "PENDING"));

        data.put("totalSpent",
                orderRepo.totalSpent(buyerId));

        return data;
    }

    @Transactional
    public Order addToCart(Order order) {

        Order existing =
                orderRepo.findByBuyerIdAndBatchIdAndStatus(
                        order.getBuyerId(),
                        order.getBatchId(),
                        "CART"
                );

        if (existing != null) {
            existing.setQuantity(
                    existing.getQuantity() + order.getQuantity()
            );
            existing.setTotalPrice(
                    existing.getTotalPrice() + order.getTotalPrice()
            );
            return orderRepo.save(existing);
        }

        order.setStatus("CART");
        return orderRepo.save(order);
    }

    @Transactional
    public Order placeOrder(Order order) {

        // 1️⃣ Crop / Batch fetch
//        Crop crop = cropRepo.findByBatchId(order.getBatchId())
//                .orElseThrow(() ->
//                        new RuntimeException("Crop batch not found"));
        List<Crop> crops = cropRepo.findByBatchId(order.getBatchId());

        if (crops.isEmpty()) {
            throw new RuntimeException("Crop batch not found");
        }

        Crop crop = crops.get(0);


        // 2️⃣ Stock check
        if (crop.getQuantity() < order.getQuantity()) {
            throw new RuntimeException("Insufficient crop quantity");
        }

        // 3️⃣ Reduce quantity
        crop.setQuantity(
                crop.getQuantity() - order.getQuantity()
        );
        cropRepo.save(crop);

        // 4️⃣ Place order
        order.setStatus("PLACED");
        return orderRepo.save(order);
    }

}
