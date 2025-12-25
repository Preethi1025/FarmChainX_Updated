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

    // ✅ Marketplace: Only ACTIVE listings approved by distributor
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
            item.put("status", listing.getStatus());
            item.put("farmerId", listing.getFarmerId());
            item.put("batchId", listing.getBatchId());

            if (crop != null) {
                item.put("cropName", crop.getCropName());
                item.put("location", crop.getLocation());
                item.put("qualityGrade", crop.getQualityGrade());
                item.put("cropType", crop.getCropType());

                // ✅ Price & quantity: listing overrides crop if available
                item.put("price", listing.getPrice() != null ? listing.getPrice() :
                        (crop.getPrice() != null ? crop.getPrice() : 0));
                item.put("quantity", listing.getQuantity() != null ? listing.getQuantity() :
                        (crop.getQuantity() != null ? crop.getQuantity() : 0));

                // ✅ Generate full trace URL using batchId
                String traceBase = "http://localhost:5173/trace/";
                String batchId = listing.getBatchId();
                item.put("traceUrl", traceBase + batchId);
            }

            response.add(item);
        }

        return response;
    }

    // ✅ Farmer creates listing (PENDING status)
    @PostMapping("/create")
    public Listing createListing(@RequestBody Listing listing) {
        System.out.println("📥 Incoming Listing Request: " + listing);
        return listingService.createOrActivateListing(listing);
    }

    // ✅ Distributor approves listing (ACTIVE status)
    @PutMapping("/approve/{listingId}")
    public Listing approveListing(@PathVariable Long listingId) {
        return listingService.approveListing(listingId);
    }
}