package com.FarmChainX.backend.Service;

import com.FarmChainX.backend.Model.Listing;
import com.FarmChainX.backend.Repository.ListingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ListingService {

    @Autowired
    private ListingRepository listingRepository;

    // CREATE LISTING
    public Listing createListing(Listing listing) {
        listing.setListingId(UUID.randomUUID().toString());
        listing.setStatus("ACTIVE");
        return listingRepository.save(listing);
    }

    // GET ALL LISTINGS
    public List<Listing> getAllListings() {
        return listingRepository.findAll();
    }

    // GET LISTINGS OF A SPECIFIC FARMER
    public List<Listing> getListingsByFarmer(String farmerId) {
        return listingRepository.findByFarmerId(farmerId);
    }

    // UPDATE LISTING
    public Listing updateListing(String listingId, Listing updated) {
        return listingRepository.findById(listingId).map(existing -> {
            existing.setPrice(updated.getPrice());
            existing.setQuantity(updated.getQuantity());
            existing.setStatus(updated.getStatus());
            return listingRepository.save(existing);
        }).orElse(null);
    }

    // DELETE LISTING
    public boolean deleteListing(String listingId) {
        if (listingRepository.existsById(listingId)) {
            listingRepository.deleteById(listingId);
            return true;
        }
        return false;
    }
}
