package com.FarmChainX.backend.Service;

import com.FarmChainX.backend.Model.Crop;
import com.FarmChainX.backend.Model.Listing;
import com.FarmChainX.backend.Repository.ListingRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ListingService {

    private final ListingRepository listingRepository;

    public ListingService(ListingRepository listingRepository) {
        this.listingRepository = listingRepository;
    }

    // 🔒 FARMER: Create or update listing → ALWAYS PENDING
    @Transactional
    public Listing createOrActivateListing(Listing incoming) {

        Listing existing = listingRepository
                .findByBatchIdAndCropId(incoming.getBatchId(), incoming.getCropId());

        if (existing != null) {
            existing.setQuantity(incoming.getQuantity());
            existing.setPrice(incoming.getPrice());
            existing.setStatus("PENDING"); // ✅ FIX
            existing.setUpdatedAt(LocalDateTime.now());
            return listingRepository.save(existing);
        }

        incoming.setStatus("PENDING"); // ✅ FIX
        incoming.setCreatedAt(LocalDateTime.now());
        incoming.setUpdatedAt(LocalDateTime.now());

        return listingRepository.save(incoming);
    }

    // 🏪 Marketplace → ONLY ACTIVE listings
    public List<Listing> getActiveListings() {
        return listingRepository.findByStatus("ACTIVE");
    }

    public List<Listing> getAllListings() {
        return listingRepository.findAll();
    }

    public Listing getListingById(Long id) {
        return listingRepository.findById(id).orElse(null);
    }

    // 🔍 Get listing by batch
    public Listing getListingByBatchId(String batchId) {
        return listingRepository.findFirstByBatchId(batchId).orElse(null);
    }

    // 🚚 DISTRIBUTOR APPROVAL (ONLY PLACE distributor_id IS SET)
    @Transactional
    public Listing approveListingByBatch(String batchId, String distributorId) {

        Listing listing = listingRepository
                .findFirstByBatchId(batchId)
                .orElseThrow(() -> new RuntimeException("Listing not found for batch"));

        listing.setDistributorId(distributorId); // ✅ STORED
        listing.setStatus("ACTIVE");              // ✅ ACTIVATED
        listing.setUpdatedAt(LocalDateTime.now());

        return listingRepository.save(listing);
    }

    public boolean existsByCropId(Long cropId) {
        return listingRepository.existsByCropId(cropId);
    }
}
