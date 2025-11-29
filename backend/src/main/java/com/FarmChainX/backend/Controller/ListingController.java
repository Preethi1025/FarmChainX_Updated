package com.FarmChainX.backend.Controller;

import com.FarmChainX.backend.Model.Listing;
import com.FarmChainX.backend.Service.ListingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/listing")
@CrossOrigin("*")
public class ListingController {

    @Autowired
    private ListingService listingService;

    // CREATE LISTING
    @PostMapping("/create")
    public Listing createListing(@RequestBody Listing listing) {
        return listingService.createListing(listing);
    }

    // GET ALL LISTINGS
    @GetMapping("/all")
    public List<Listing> getAllListings() {
        return listingService.getAllListings();
    }

    // GET LISTINGS BY FARMER ID
    @GetMapping("/farmer/{farmerId}")
    public List<Listing> getFarmerListings(@PathVariable String farmerId) {
        return listingService.getListingsByFarmer(farmerId);
    }

    // UPDATE LISTING
    @PutMapping("/update/{listingId}")
    public Listing updateListing(@PathVariable String listingId, @RequestBody Listing updated) {
        return listingService.updateListing(listingId, updated);
    }

    // DELETE LISTING
    @DeleteMapping("/delete/{listingId}")
    public String deleteListing(@PathVariable String listingId) {
        boolean deleted = listingService.deleteListing(listingId);
        return deleted ? "Deleted Successfully" : "Listing Not Found";
    }
}
