package com.FarmChainX.backend.Service;

import com.FarmChainX.backend.Model.Listing;
import com.FarmChainX.backend.Repository.ListingRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ListingService {

    private final ListingRepository listingRepository;

    public ListingService(ListingRepository listingRepository) {
        this.listingRepository = listingRepository;
    }

    // Create listing - farmer cannot directly make it ACTIVE
    public Listing createListing(Listing listing) {

        if (listing.getCropId() != null && listingRepository.existsByCropId(listing.getCropId())) {
            throw new RuntimeException("This crop is already listed!");
        }

        if (listing.getCreatedAt() == null) {
            listing.setCreatedAt(LocalDateTime.now());
<<<<<<< HEAD
=======
        }
        if (listing.getUpdatedAt() == null) {
            listing.setUpdatedAt(LocalDateTime.now());
>>>>>>> 33ebfebde6af206b77118014d27637b9ee404f76
        }
        listing.setUpdatedAt(LocalDateTime.now());

        // ✅ Initially PENDING
        if (listing.getStatus() == null || listing.getStatus().isEmpty()) {
            listing.setStatus("PENDING");
        }

<<<<<<< HEAD
        Listing saved = listingRepository.save(listing);
        return saved;
=======
        return listingRepository.save(listing);
>>>>>>> 33ebfebde6af206b77118014d27637b9ee404f76
    }

    public List<Listing> getAllListings() {
        return listingRepository.findAll();
    }

<<<<<<< HEAD
    /**
     * Disable listings for a given batch (called when distributor rejects a batch).
     * This sets listing.status to "REMOVED" so marketplace ignores it.
     */
    public void disableListingsForBatch(String batchId) {
        if (batchId == null) return;
        List<Listing> listings = listingRepository.findByBatchId(batchId);
        for (Listing l : listings) {
            l.setStatus("REMOVED");
            l.setUpdatedAt(LocalDateTime.now());
            listingRepository.save(l);
        }
=======
    public Listing getListingById(Long id) {
        return listingRepository.findById(id).orElse(null);
    }

    public Listing updateListing(Listing listing) {
        listing.setUpdatedAt(LocalDateTime.now());
        return listingRepository.save(listing);
    }

    // Distributor approves listing
    public Listing approveListing(Long listingId) {
        Listing listing = getListingById(listingId);
        if (listing == null) {
            throw new RuntimeException("Listing not found");
        }
        listing.setStatus("ACTIVE");
        listing.setUpdatedAt(LocalDateTime.now());
        return updateListing(listing);
>>>>>>> 33ebfebde6af206b77118014d27637b9ee404f76
    }
}
