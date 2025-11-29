package com.FarmChainX.backend.Repository;

import com.FarmChainX.backend.Model.Listing;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ListingRepository extends JpaRepository<Listing, String> {

    List<Listing> findByFarmerId(String farmerId);

    List<Listing> findByCropId(String cropId);
}
