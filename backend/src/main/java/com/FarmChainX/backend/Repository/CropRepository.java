package com.FarmChainX.backend.Repository;

import com.FarmChainX.backend.Model.Crop;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CropRepository extends JpaRepository<Crop, Long> {
   List<Crop> findByFarmerId(String farmerId);
   List<Crop> findByFarmerIdAndStatus(String farmerId, String status);
   List<Crop> findByBatchId(String batchId);
}
