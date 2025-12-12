package com.FarmChainX.backend.Repository;

import com.FarmChainX.backend.Model.BatchRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BatchRecordRepository extends JpaRepository<BatchRecord, String> {

    List<BatchRecord> findByFarmerId(String farmerId);

    List<BatchRecord> findByStatus(String status);

    List<BatchRecord> findByDistributorIdAndStatus(String distributorId, String status);

}