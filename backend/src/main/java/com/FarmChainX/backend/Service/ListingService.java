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

        // Prevent duplicate listing for same crop
        if (listing.getCropId() != null && listingRepository.existsByCropId(listing.getCropId())) {
            throw new RuntimeException("This crop is already listed!");
        }

        // Set timestamps
        if (listing.getCreatedAt() == null) {
            listing.setCreatedAt(LocalDateTime.now());
        }
        listing.setUpdatedAt(LocalDateTime.now());

        // Set default status
        if (listing.getStatus() == null || listing.getStatus().isEmpty()) {
            listing.setStatus("PENDING");
        }

        return listingRepository.save(listing);
    }

    // Get all listings
    public List<Listing> getAllListings() {
        return listingRepository.findAll();
    }

    // Find listing by ID
    public Listing getListingById(Long id) {
        return listingRepository.findById(id).orElse(null);
    }

    // Update listing
    public Listing updateListing(Listing listing) {
        listing.setUpdatedAt(LocalDateTime.now());
        return listingRepository.save(listing);
    }

    // Distributor approves listing → status becomes ACTIVE
    public Listing approveListing(Long listingId) {
        Listing listing = getListingById(listingId);

        if (listing == null) {
            throw new RuntimeException("Listing not found");
        }

        listing.setStatus("ACTIVE");
        listing.setUpdatedAt(LocalDateTime.now());

        return listingRepository.save(listing);
    }
    public boolean existsByCropId(Long cropId) {
    return listingRepository.existsByCropId(cropId);
}

}
