package com.FarmChainX.backend.Repository;

import com.FarmChainX.backend.Model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OrderRepository extends JpaRepository<Order, String> {

    long countByBuyerId(String buyerId);

    long countByBuyerIdAndStatus(String buyerId, String status);

    Order findByBuyerIdAndBatchIdAndStatus(
            String buyerId,
            String batchId,
            String status
    );

    @Query("""
        SELECT COALESCE(SUM(o.totalPrice), 0)
        FROM Order o
        WHERE o.buyerId = :buyerId
          AND o.status = 'DELIVERED'
    """)
    double totalSpent(String buyerId);
}
