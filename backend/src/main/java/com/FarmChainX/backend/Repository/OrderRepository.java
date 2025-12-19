package com.FarmChainX.backend.Repository;

import com.FarmChainX.backend.Model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByDistributorId(String distributorId);
    List<Order> findByConsumerId(String consumerId);
    //List<Order> findByDistributorId(String distributorId);

        //List<Order> findByConsumerId(String consumerId);


}
