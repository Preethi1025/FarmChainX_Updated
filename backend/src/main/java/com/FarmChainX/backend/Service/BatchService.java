package com.FarmChainX.backend.Service;

import com.FarmChainX.backend.Model.BatchRecord;
import com.FarmChainX.backend.Model.BatchTrace;
import com.FarmChainX.backend.Model.Crop;
import com.FarmChainX.backend.Model.Listing;
import com.FarmChainX.backend.Repository.BatchRecordRepository;
import com.FarmChainX.backend.Repository.BatchTraceRepository;
import com.FarmChainX.backend.Repository.CropRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class BatchService {

    private final BatchRecordRepository batchRecordRepository;
    private final CropRepository cropRepository;
    private final ListingService listingService;
    private final BatchTraceRepository batchTraceRepository;

    public BatchService(BatchRecordRepository batchRecordRepository,
                        CropRepository cropRepository,
                        ListingService listingService,
                        BatchTraceRepository batchTraceRepository) {
        this.batchRecordRepository = batchRecordRepository;
        this.cropRepository = cropRepository;
        this.listingService = listingService;
        this.batchTraceRepository = batchTraceRepository;
    }

    // ------------------- CREATE NEW BATCH -------------------
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

        if ("HARVESTED".equalsIgnoreCase(batch.getStatus()) && batch.getHarvestDate() == null) {
            batch.setHarvestDate(LocalDate.now());
        }

        return batchRecordRepository.save(batch);
    }

    // ------------------- GET SINGLE BATCH -------------------
    public Optional<BatchRecord> getBatch(String batchId) {
        return batchRecordRepository.findById(batchId);
    }

    // ------------------- GET BATCHES BY FARMER -------------------
    public List<BatchRecord> getBatchesByFarmer(String farmerId) {
        return batchRecordRepository.findByFarmerId(farmerId);
    }

    // ------------------- GET CROPS FOR BATCH -------------------
    public List<Crop> getCropsForBatch(String batchId) {
        return cropRepository.findByBatchId(batchId);
    }

    // ------------------- DISTRIBUTOR PENDING BATCHES -------------------
    public List<Map<String, Object>> getPendingBatchesForDistributor() {
        List<BatchRecord> pending = batchRecordRepository.findByStatus("HARVESTED");
        List<Map<String, Object>> response = new ArrayList<>();
        for (BatchRecord b : pending) {
            response.add(toBatchResponse(b));
        }
        return response;
    }

    // ------------------- DISTRIBUTOR APPROVED BATCHES -------------------
    public List<Map<String, Object>> getApprovedBatches(String distributorId) {
        List<BatchRecord> approved = batchRecordRepository.findByDistributorIdAndStatus(distributorId, "APPROVED");
        List<Map<String, Object>> response = new ArrayList<>();
        for (BatchRecord b : approved) {
            response.add(toBatchResponse(b));
        }
        return response;
    }

    // ------------------- APPROVE BATCH -------------------
    public BatchRecord approveBatch(String batchId, String distributorId) {
        BatchRecord batch = batchRecordRepository.findById(batchId)
                .orElseThrow(() -> new RuntimeException("Batch not found"));

        batch.setStatus("APPROVED");
        batch.setDistributorId(distributorId);
        batch.setUpdatedAt(LocalDateTime.now());

        if ("HARVESTED".equalsIgnoreCase(batch.getStatus()) && batch.getHarvestDate() == null) {
            batch.setHarvestDate(LocalDate.now());
        }

        // create listings
        List<Crop> crops = cropRepository.findByBatchId(batch.getBatchId());
        for (Crop crop : crops) {
            Listing listing = new Listing();
            listing.setBatchId(batch.getBatchId());
            listing.setFarmerId(batch.getFarmerId());
            listing.setCropId(crop.getCropId());
            try {
                listing.setQuantity(Double.parseDouble(crop.getQuantity()));
            } catch (NumberFormatException e) {
                listing.setQuantity(0.0);
            }
            listing.setPrice(0.0);
            listing.setStatus("ACTIVE");
            listingService.createListing(listing);
        }

        return batchRecordRepository.save(batch);
    }

    // ------------------- REJECT BATCH -------------------
    public BatchRecord rejectBatch(String batchId, String distributorId) {
        BatchRecord batch = batchRecordRepository.findById(batchId)
                .orElseThrow(() -> new RuntimeException("Batch not found"));

        batch.setStatus("REJECTED");
        batch.setRejectedBy(distributorId);
        batch.setBlocked(true);
        batch.setUpdatedAt(LocalDateTime.now());

        return batchRecordRepository.save(batch);
    }

    // ------------------- UPDATE STATUS -------------------
    @Transactional
    public BatchRecord updateStatus(String batchId, String status, String userId) {
        BatchRecord batch = batchRecordRepository.findById(batchId)
                .orElseThrow(() -> new RuntimeException("Batch not found"));

        batch.setStatus(status);
        batch.setUpdatedAt(LocalDateTime.now());

        batchRecordRepository.save(batch);

        // save trace
        BatchTrace trace = new BatchTrace();
        trace.setBatchId(batchId);
        trace.setFarmerId(batch.getFarmerId()); // <-- add this
        trace.setStatus(status);
        trace.setChangedBy(userId);
        trace.setTimestamp(LocalDateTime.now());
        batchTraceRepository.save(trace);


        return batch;
    }

    // ------------------- GET TRACES -------------------
    public List<BatchTrace> getBatchTrace(String batchId) {
        return batchTraceRepository.findByBatchIdOrderByTimestampAsc(batchId);
    }

    // ------------------- HELPER: Convert BatchRecord to JSON -------------------
    private Map<String, Object> toBatchResponse(BatchRecord batch) {
        Map<String, Object> data = new HashMap<>();
        data.put("batchId", batch.getBatchId());
        data.put("farmerId", batch.getFarmerId());
        data.put("cropType", batch.getCropType());
        data.put("totalQuantity", batch.getTotalQuantity());
        data.put("harvestDate", batch.getHarvestDate());
        data.put("status", batch.getStatus());
        data.put("distributorId", batch.getDistributorId());

        List<Crop> crops = cropRepository.findByBatchId(batch.getBatchId());
        data.put("crops", crops);

        if (!crops.isEmpty()) {
            Crop c = crops.get(0);
            data.put("location", c.getLocation());
            data.put("expectedHarvestDate", c.getExpectedHarvestDate());
            data.put("cropName", c.getCropName());
            data.put("qualityGrade", c.getQualityGrade());
        } else {
            data.put("location", "N/A");
            data.put("expectedHarvestDate", "N/A");
            data.put("cropName", "N/A");
            data.put("qualityGrade", "N/A");
        }

        return data;
    }

    private String generateBatchId(String cropType) {
        String prefix = cropType != null && cropType.length() >= 3
                ? cropType.substring(0, 3).toUpperCase()
                : "CRP";
        String date = LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("yyMMdd"));
        String random = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        return "FCX-" + prefix + "-" + date + "-" + random;
    }
}
