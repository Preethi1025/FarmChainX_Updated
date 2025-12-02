package com.FarmChainX.backend.Controller;

import com.FarmChainX.backend.Model.Crop;
import com.FarmChainX.backend.Model.Listing;
import com.FarmChainX.backend.Service.CropService;
import com.FarmChainX.backend.Service.ListingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/listings")
@CrossOrigin("*")
public class ListingController {

    @Autowired
    private ListingService listingService;

    @Autowired
    private CropService cropService;

    @GetMapping("/")
    public List<Map<String, Object>> getMarketplaceListings() {
        List<Listing> listings = listingService.getAllListings();
        List<Map<String, Object>> response = new ArrayList<>();

        for (Listing listing : listings) {
            if (!"ACTIVE".equalsIgnoreCase(listing.getStatus())) continue;

            Crop crop = cropService.getCropById(listing.getCropId());

            Map<String, Object> item = new HashMap<>();
            item.put("listingId", listing.getListingId());
            item.put("cropId", listing.getCropId());
            item.put("price", listing.getPrice());
            item.put("quantity", listing.getQuantity());
            item.put("status", listing.getStatus());

            if (crop != null) {
                item.put("cropName", crop.getCropName());
                item.put("location", crop.getLocation());
                item.put("qualityGrade", crop.getQualityGrade());
                item.put("cropType", crop.getCropType());
            }
            // Use farmerId from listing, not from crop
            item.put("farmerId", listing.getFarmerId());

            response.add(item);
        }

        return response;
    }

    @PostMapping("/create")
    public Listing createListing(@RequestBody Listing listing) {
        System.out.println("📥 Incoming Listing Request: " + listing);
        System.out.println("   - cropId: " + listing.getCropId());
        System.out.println("   - farmerId: " + listing.getFarmerId());
        System.out.println("   - batchId: " + listing.getBatchId());
        System.out.println("   - price: " + listing.getPrice());
        System.out.println("   - quantity: " + listing.getQuantity());
        return listingService.createListing(listing);
    }

}
