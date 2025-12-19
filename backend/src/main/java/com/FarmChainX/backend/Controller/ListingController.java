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

    // 🏪 Marketplace
    @GetMapping("/")
    public List<Map<String, Object>> getMarketplaceListings() {

        List<Listing> listings = listingService.getActiveListings();
        List<Map<String, Object>> response = new ArrayList<>();

        for (Listing listing : listings) {

            Crop crop = cropService.getCropById(listing.getCropId());

            Map<String, Object> item = new HashMap<>();
            item.put("listingId", listing.getListingId());
            item.put("cropId", listing.getCropId());
            item.put("farmerId", listing.getFarmerId());
            item.put("batchId", listing.getBatchId());
            item.put("distributorId", listing.getDistributorId()); // ✅ NOW VISIBLE
            item.put("status", listing.getStatus());

            if (crop != null) {
                item.put("cropName", crop.getCropName());
                item.put("location", crop.getLocation());
                item.put("qualityGrade", crop.getQualityGrade());
                item.put("cropType", crop.getCropType());
                item.put("price", listing.getPrice());
                item.put("quantity", listing.getQuantity());
                item.put("traceUrl", "http://localhost:5173/trace/" + listing.getBatchId());
            }

            response.add(item);
        }

        return response;
    }

    // 🌾 Farmer creates listing
    @PostMapping("/create")
    public Listing createListing(@RequestBody Listing listing) {
        return listingService.createOrActivateListing(listing);
    }

    // 🚚 Distributor approves
    @PutMapping("/approve/batch/{batchId}/{distributorId}")
    public Listing approveListingByBatch(
            @PathVariable String batchId,
            @PathVariable String distributorId
    ) {
        return listingService.approveListingByBatch(batchId, distributorId);
    }

}
