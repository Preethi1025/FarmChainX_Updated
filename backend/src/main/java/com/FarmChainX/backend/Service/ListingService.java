package com.FarmChainX.backend.Service;

import com.FarmChainX.backend.Model.BatchRecord;
import com.FarmChainX.backend.Model.Crop;
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

        if (listingRepository.existsByCropId(listing.getCropId())) {
            throw new RuntimeException("This crop is already listed!");
        }

        System.out.println(" Saving Listing: " + listing);

        if (listing.getCreatedAt() == null) {
            listing.setCreatedAt(java.time.LocalDateTime.now());
        }
        if (listing.getUpdatedAt() == null) {
            listing.setUpdatedAt(java.time.LocalDateTime.now());
        }

        if (listing.getStatus() == null || listing.getStatus().isEmpty()) {
            listing.setStatus("ACTIVE");
        }

        Listing saved = listingRepository.save(listing);
        System.out.println(" After Save - Listing ID: " + saved.getListingId());

        return saved;
    }

    public List<Listing> getAllListings() {
        return listingRepository.findAll();
    }

}
