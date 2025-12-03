package com.FarmChainX.backend.Service;

import com.FarmChainX.backend.Model.BatchRecord;
import com.FarmChainX.backend.Model.Crop;
import com.FarmChainX.backend.Model.Listing;
import com.FarmChainX.backend.Repository.BatchRecordRepository;
import com.FarmChainX.backend.Repository.CropRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class BatchService {

    private final BatchRecordRepository batchRecordRepository;
    private final CropRepository cropRepository;
    private final ListingService listingService;

    public BatchService(BatchRecordRepository batchRecordRepository, CropRepository cropRepository, ListingService listingService) {
        this.batchRecordRepository = batchRecordRepository;
        this.cropRepository = cropRepository;
        this.listingService = listingService;
    }

    // ---------------------------------------------------------------------
    // CREATE NEW BATCH (FARMER INITIATED OR MANUAL)
    // ---------------------------------------------------------------------
    public BatchRecord createBatch(BatchRecord batch) {

        if (batch.getFarmerId() == null || batch.getFarmerId().isEmpty()) {
            throw new RuntimeException("Farmer ID is required");
        }

        if (batch.getCropType() == null || batch.getCropType().isEmpty()) {
            throw new RuntimeException("Crop type is required");
        }

        if (batch.getBatchId() == null || batch.getBatchId().isEmpty()) {
            batch.setBatchId(generateBatchId(batch.getCropType()));
        }

        batch.setCreatedAt(LocalDateTime.now());

        if (batch.getStatus() == null) {
            batch.setStatus("PLANTED");
        }

        return batchRecordRepository.save(batch);
    }

    // ---------------------------------------------------------------------
    // GET SINGLE BATCH
    // ---------------------------------------------------------------------
    public Optional<BatchRecord> getBatch(String batchId) {
        return batchRecordRepository.findById(batchId);
    }

    // ---------------------------------------------------------------------
    // GET BATCHES BY FARMER
    // ---------------------------------------------------------------------
    public List<BatchRecord> getBatchesByFarmer(String farmerId) {
        return batchRecordRepository.findByFarmerId(farmerId);
    }

    // ---------------------------------------------------------------------
    // GET CROPS FOR A BATCH
    // ---------------------------------------------------------------------
    public List<Crop> getCropsForBatch(String batchId) {
        return cropRepository.findByBatchId(batchId);
    }

    // ---------------------------------------------------------------------
    // PENDING BATCHES FOR DISTRIBUTOR
    // ---------------------------------------------------------------------
    public List<BatchRecord> getPendingBatchesForDistributor() {
        return batchRecordRepository.findByStatus("HARVESTED");
    }

    // ---------------------------------------------------------------------
    // APPROVED BATCHES FOR DISTRIBUTOR
    // ---------------------------------------------------------------------
    public List<BatchRecord> getApprovedBatches(String distributorId) {
        return batchRecordRepository.findByDistributorIdAndStatus(distributorId, "APPROVED");
    }

    // ---------------------------------------------------------------------
    // APPROVE BATCH
    // ---------------------------------------------------------------------
//    public BatchRecord approveBatch(String batchId, String distributorId) {
//
//        BatchRecord batch = batchRecordRepository.findById(batchId)
//                .orElseThrow(() -> new RuntimeException("Batch not found"));
//
//        batch.setStatus("APPROVED");
//        batch.setDistributorId(distributorId);
//        batch.setUpdatedAt(LocalDateTime.now());
//
//        return batchRecordRepository.save(batch);
//    }

    // ---------------------------------------------------------------------
    // REJECT BATCH
    // ---------------------------------------------------------------------
    public BatchRecord rejectBatch(String batchId, String distributorId, String reason) {

        BatchRecord batch = batchRecordRepository.findById(batchId)
                .orElseThrow(() -> new RuntimeException("Batch not found"));

        batch.setStatus("REJECTED");
        batch.setDistributorId(distributorId);
        batch.setRejectReason(reason);
        batch.setUpdatedAt(LocalDateTime.now());

        return batchRecordRepository.save(batch);
    }

    // ---------------------------------------------------------------------
    // PROCESS DAILY HARVEST (MARK CROPS READY_FOR_HARVEST -> HARVESTED BATCH)
    // ---------------------------------------------------------------------
    public BatchRecord processDailyHarvest(String farmerId) {

        // 1️⃣ Find all crops ready for harvest
        List<Crop> readyCrops = cropRepository.findByFarmerIdAndStatus(farmerId, "READY_FOR_HARVEST");
        if (readyCrops.isEmpty()) return null;

        // 2️⃣ Create a new batch
        String cropType = readyCrops.get(0).getCropType();
        String batchId = generateBatchId(cropType);

        BatchRecord batch = new BatchRecord();
        batch.setBatchId(batchId);
        batch.setFarmerId(farmerId);
        batch.setCropType(cropType);
        batch.setStatus("HARVESTED");
        batch.setCreatedAt(LocalDateTime.now());
        batch.setHarvestDate(LocalDate.now());

        // 3️⃣ Sum quantities
        double totalQty = readyCrops.stream()
                .mapToDouble(c -> Double.parseDouble(c.getQuantity()))
                .sum();
        batch.setTotalQuantity(totalQty);

        // 4️⃣ Update crops with batchId and new status
        for (Crop c : readyCrops) {
            c.setBatchId(batchId);
            c.setStatus("HARVESTED");
            c.setActualHarvestDate(LocalDate.now().toString());
        }

        cropRepository.saveAll(readyCrops);

        // 5️⃣ Save batch
        return batchRecordRepository.save(batch);
    }

    // ---------------------------------------------------------------------
    // HELPER: GENERATE BATCH ID
    // ---------------------------------------------------------------------
    private String generateBatchId(String cropType) {
        String prefix = cropType != null && cropType.length() >= 3
                ? cropType.substring(0, 3).toUpperCase()
                : "CRP";

        String date = LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("yyMMdd"));
        String random = UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        return "FCX-" + prefix + "-" + date + "-" + random;
    }
    public BatchRecord updateStatus(String batchId, String status) {
        BatchRecord batch = batchRecordRepository.findById(batchId)
                .orElseThrow(() -> new RuntimeException("Batch not found"));
        batch.setStatus(status);
        return batchRecordRepository.save(batch);
    }
    public BatchRecord approveBatch(String batchId, String distributorId) {

        BatchRecord batch = batchRecordRepository.findById(batchId)
                .orElseThrow(() -> new RuntimeException("Batch not found"));

        batch.setStatus("APPROVED");
        batch.setDistributorId(distributorId);
        batch.setUpdatedAt(LocalDateTime.now());

        // Create listings for each crop in the batch
        List<Crop> crops = cropRepository.findByBatchId(batch.getBatchId());
        for (Crop crop : crops) {
            Listing listing = new Listing();
            listing.setBatchId(batch.getBatchId());
            listing.setFarmerId(batch.getFarmerId());
            listing.setCropId(crop.getCropId());

            // Safe parsing of quantity
            try {
                listing.setQuantity(Double.parseDouble(crop.getQuantity()));
            } catch (NumberFormatException e) {
                listing.setQuantity(0.0);
            }

            // Set price (placeholder, can be calculated)
            listing.setPrice(0.0);
            listing.setStatus("ACTIVE");

            listingService.createListing(listing);
        }

        return batchRecordRepository.save(batch);
    }

}
