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
import java.util.stream.Collectors;

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

        if (batch.getStatus() == null) batch.setStatus("PLANTED");
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
        for (BatchRecord b : pending) response.add(toBatchResponse(b));
        return response;
    }

    // ------------------- DISTRIBUTOR APPROVED BATCHES -------------------
    public List<Map<String, Object>> getApprovedBatches(String distributorId) {
        List<BatchRecord> approved = batchRecordRepository.findByDistributorIdAndStatus(distributorId, "APPROVED");
        List<Map<String, Object>> response = new ArrayList<>();
        for (BatchRecord b : approved) response.add(toBatchResponse(b));
        return response;
    }

    // ------------------- APPROVE BATCH -------------------
    public BatchRecord approveBatch(String batchId, String distributorId) {
        BatchRecord batch = batchRecordRepository.findById(batchId)
                .orElseThrow(() -> new RuntimeException("Batch not found"));

        batch.setStatus("APPROVED");
        batch.setDistributorId(distributorId);
        batch.setUpdatedAt(LocalDateTime.now());

        // create listings for each crop
        List<Crop> crops = cropRepository.findByBatchId(batch.getBatchId());
        for (Crop crop : crops) {
            Listing listing = new Listing();
            listing.setBatchId(batch.getBatchId());
            listing.setFarmerId(batch.getFarmerId());
            listing.setCropId(crop.getCropId());
            try { listing.setQuantity(Double.parseDouble(crop.getQuantity())); } catch (Exception e) { listing.setQuantity(0.0); }
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

        saveTrace(batch, status, userId);
        return batch;
    }

    // ------------------- UPDATE QUALITY GRADE -------------------
    @Transactional
    public BatchRecord updateQualityGrade(String batchId, String grade, Integer confidence, String userId) {
        BatchRecord batch = batchRecordRepository.findById(batchId)
                .orElseThrow(() -> new RuntimeException("Batch not found"));

        List<Crop> crops = cropRepository.findByBatchId(batchId);
        if (crops.isEmpty()) throw new RuntimeException("No crops found for batch");

        for (Crop c : crops) c.setQualityGrade(grade);
        cropRepository.saveAll(crops);

        batch.setUpdatedAt(LocalDateTime.now());
        batchRecordRepository.save(batch);

        saveTrace(batch, "QUALITY_UPDATED", userId);
        return batch;
    }

    // ------------------- SPLIT BATCH -------------------
    @Transactional
    public BatchRecord splitBatch(String parentBatchId, double splitQuantity, String userId) {
        BatchRecord parent = batchRecordRepository.findById(parentBatchId)
                .orElseThrow(() -> new RuntimeException("Parent batch not found"));

        double parentTotal = parent.getTotalQuantity() != null ? parent.getTotalQuantity() : 0.0;
        if (splitQuantity <= 0 || splitQuantity > parentTotal)
            throw new RuntimeException("Invalid split quantity");

        List<Crop> parentCrops = cropRepository.findByBatchId(parentBatchId);
        if (parentCrops.isEmpty()) throw new RuntimeException("No crops to split from parent batch");

        double ratio = splitQuantity / parentTotal;

        BatchRecord child = new BatchRecord();
        child.setFarmerId(parent.getFarmerId());
        child.setCropType(parent.getCropType());
        child.setStatus(parent.getStatus());
        child.setCreatedAt(LocalDateTime.now());
        child.setBatchId(parent.getBatchId() + "-S" + UUID.randomUUID().toString().substring(0, 2).toUpperCase());
        child.setTotalQuantity(roundToTwoDecimals(splitQuantity));
        batchRecordRepository.save(child);

        List<Crop> childCrops = new ArrayList<>();
        for (Crop pc : parentCrops) {
            double pcQty = parseQuantity(pc.getQuantity());
            double childQty = roundToTwoDecimals(pcQty * ratio);
            double parentNewQty = roundToTwoDecimals(pcQty - childQty);

            pc.setQuantity(String.valueOf(parentNewQty));

            if (childQty > 0) {
                Crop newCrop = new Crop();
                newCrop.setBatchId(child.getBatchId());
                newCrop.setFarmerId(parent.getFarmerId());
                newCrop.setCropName(pc.getCropName());
                newCrop.setQuantity(String.valueOf(childQty));
                newCrop.setLocation(pc.getLocation());
                newCrop.setExpectedHarvestDate(pc.getExpectedHarvestDate());
                newCrop.setQualityGrade(pc.getQualityGrade());
                childCrops.add(newCrop);
            }
        }

        cropRepository.saveAll(parentCrops);
        cropRepository.saveAll(childCrops);

        parent.setTotalQuantity(roundToTwoDecimals(parentTotal - splitQuantity));
        parent.setUpdatedAt(LocalDateTime.now());
        batchRecordRepository.save(parent);

        saveTrace(parent, "SPLIT", userId);
        saveTrace(child, "CREATED_BY_SPLIT", userId);

        return child;
    }

    // ------------------- MERGE BATCHES -------------------
    @Transactional
    public BatchRecord mergeBatches(String targetBatchId, List<String> sourceBatchIds, String userId) {
        if (sourceBatchIds == null || sourceBatchIds.isEmpty()) throw new RuntimeException("No source batches provided");

        BatchRecord target = batchRecordRepository.findById(targetBatchId)
                .orElseThrow(() -> new RuntimeException("Target batch not found"));

        List<BatchRecord> sources = sourceBatchIds.stream()
                .filter(id -> !id.equals(targetBatchId))
                .map(id -> batchRecordRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Source batch not found: " + id)))
                .collect(Collectors.toList());

        double totalAdded = 0.0;
        List<Crop> cropsToSave = new ArrayList<>();
        char suffix = 'A';

        for (BatchRecord s : sources) {
            if (!Objects.equals(s.getCropType(), target.getCropType()))
                throw new RuntimeException("Cannot merge batches of different crop types");

            List<Crop> scrops = cropRepository.findByBatchId(s.getBatchId());
            for (Crop c : scrops) {
                c.setBatchId(target.getBatchId()); // Keep target batch ID
                c.setCropName(c.getCropName() + "-" + suffix++); // suffix to avoid duplicates
                cropsToSave.add(c);
                totalAdded += parseQuantity(c.getQuantity());
            }

            s.setBlocked(true);
            s.setStatus("MERGED");
            s.setUpdatedAt(LocalDateTime.now());
            batchRecordRepository.save(s);

            saveTrace(s, "MERGED_INTO", userId);
        }

        cropRepository.saveAll(cropsToSave);

        target.setTotalQuantity(roundToTwoDecimals((target.getTotalQuantity() != null ? target.getTotalQuantity() : 0.0) + totalAdded));
        target.setUpdatedAt(LocalDateTime.now());
        batchRecordRepository.save(target);

        saveTrace(target, "MERGED_FROM", userId);

        return target;
    }

    // ------------------- HELPERS -------------------
    private double parseQuantity(String q) {
        if (q == null || q.isEmpty()) return 0.0;
        try { return Double.parseDouble(q); } catch (NumberFormatException e) { return 0.0; }
    }

    private double roundToTwoDecimals(double v) {
        return Math.round(v * 100.0) / 100.0;
    }

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

    private void saveTrace(BatchRecord batch, String status, String userId) {
        BatchTrace trace = new BatchTrace();
        trace.setBatchId(batch.getBatchId());
        trace.setFarmerId(batch.getFarmerId());
        trace.setStatus(status);
        trace.setChangedBy(userId);
        trace.setTimestamp(LocalDateTime.now());
        batchTraceRepository.save(trace);
    }
}
