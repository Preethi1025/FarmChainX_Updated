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

    public Listing createListing(Listing listing) {

        if (listing.getCropId() != null && listingRepository.existsByCropId(listing.getCropId())) {
            throw new RuntimeException("This crop is already listed!");
        }

        if (listing.getCreatedAt() == null) {
            listing.setCreatedAt(LocalDateTime.now());
        }
        listing.setUpdatedAt(LocalDateTime.now());

        if (listing.getStatus() == null || listing.getStatus().isEmpty()) {
            listing.setStatus("ACTIVE");
        }

        Listing saved = listingRepository.save(listing);
        return saved;
    }

    public List<Listing> getAllListings() {
        return listingRepository.findAll();
    }

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
    }
}
