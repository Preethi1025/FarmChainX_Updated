package com.FarmChainX.backend.Repository;

import com.FarmChainX.backend.Model.Listing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ListingRepository extends JpaRepository<Listing, Long> {

    boolean existsByCropId(Long cropId);

    List<Listing> findByBatchId(String batchId);
}
