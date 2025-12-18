package com.FarmChainX.backend.Repository;

import com.FarmChainX.backend.Model.Crop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CropRepository extends JpaRepository<Crop, Long> {

   // Used for split / merge logic
   List<Crop> findByBatchId(String batchId);
    @Query("SELECT COALESCE(SUM(c.quantity), 0) FROM Crop c WHERE c.batchId = :batchId")
    Double getAvailableQuantityByBatch(@Param("batchId") String batchId);
   // Used for farmer crop listing
   List<Crop> findByFarmerId(String farmerId);
}
