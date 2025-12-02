package com.FarmChainX.backend.Service;

import com.FarmChainX.backend.Model.BatchRecord;
import com.FarmChainX.backend.Model.Crop;
import com.FarmChainX.backend.Repository.BatchRecordRepository;
import com.FarmChainX.backend.Repository.CropRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class BatchService {

    private final BatchRecordRepository batchRecordRepository;
    private final CropRepository cropRepository;

    public BatchService(BatchRecordRepository batchRecordRepository, CropRepository cropRepository) {
        this.batchRecordRepository = batchRecordRepository;
        this.cropRepository = cropRepository;
    }

    public BatchRecord createBatch(BatchRecord batch) {
        if (batch.getBatchId() == null || batch.getBatchId().isEmpty()) {
            batch.setBatchId(generateBatchId(batch.getCropType()));
        }
        if (batch.getCreatedAt() == null) {
            batch.setCreatedAt(java.time.LocalDateTime.now());
        }
        return batchRecordRepository.save(batch);
    }

    public Optional<BatchRecord> getBatch(String batchId) {
        return batchRecordRepository.findById(batchId);
    }

    public List<BatchRecord> getBatchesByFarmer(String farmerId) {
        return batchRecordRepository.findByFarmerId(farmerId);
    }

    // Return crops in a batch
    public List<com.FarmChainX.backend.Model.Crop> getCropsForBatch(String batchId) {
        return cropRepository.findByBatchId(batchId);
    }

    // Bulk update status for a batch (used by controller)
    public List<com.FarmChainX.backend.Model.Crop> bulkUpdateStatus(String batchId, String status) {
        return cropRepository.saveAll(cropRepository.findByBatchId(batchId).stream().peek(c -> {
            c.setStatus(status);
            c.setUpdatedAt(java.time.LocalDateTime.now());
        }).toList());
    }

    // Bulk update quality wrapper
    public List<com.FarmChainX.backend.Model.Crop> bulkUpdateQuality(String batchId, String qualityGrade, Double confidence) {
        return cropRepository.saveAll(cropRepository.findByBatchId(batchId).stream().peek(c -> {
            c.setQualityGrade(qualityGrade);
            if (confidence != null) c.setAiConfidenceScore(confidence);
            c.setUpdatedAt(java.time.LocalDateTime.now());
        }).toList());
    }

    // Split batch: create new batch with half the crops
    public BatchRecord splitBatch(String batchId) {
        List<com.FarmChainX.backend.Model.Crop> crops = cropRepository.findByBatchId(batchId);
        if (crops.size() < 2) return null; // need at least 2 crops to split

        int splitPoint = crops.size() / 2;
        List<com.FarmChainX.backend.Model.Crop> cropsToMove = crops.subList(splitPoint, crops.size());

        // Generate new batch ID
        Optional<BatchRecord> existing = batchRecordRepository.findById(batchId);
        if (existing.isEmpty()) return null;

        BatchRecord oldBatch = existing.get();
        String newBatchId = generateBatchId(oldBatch.getCropType());

        // Move crops to new batch
        cropsToMove.forEach(c -> c.setBatchId(newBatchId));
        cropRepository.saveAll(cropsToMove);

        // Create new batch record
        BatchRecord newBatch = new BatchRecord();
        newBatch.setBatchId(newBatchId);
        newBatch.setFarmerId(oldBatch.getFarmerId());
        newBatch.setCropType(oldBatch.getCropType());
        double newTotal = cropsToMove.stream().mapToDouble(c -> {
            try { return Double.parseDouble(c.getQuantity()); } catch (Exception e) { return 0; }
        }).sum();
        newBatch.setTotalQuantity(newTotal);
        newBatch.setStatus("PLANTED");
        newBatch.setCreatedAt(java.time.LocalDateTime.now());

        // Update old batch quantity
        if (oldBatch.getTotalQuantity() != null) {
            oldBatch.setTotalQuantity(oldBatch.getTotalQuantity() - newTotal);
        }
        batchRecordRepository.save(oldBatch);

        return batchRecordRepository.save(newBatch);
    }

    // Merge batch: move all crops from sourceBatch to targetBatch
    public BatchRecord mergeBatch(String sourceBatchId, String targetBatchId) {
        List<com.FarmChainX.backend.Model.Crop> sourceCrops = cropRepository.findByBatchId(sourceBatchId);
        Optional<BatchRecord> sourceOpt = batchRecordRepository.findById(sourceBatchId);
        Optional<BatchRecord> targetOpt = batchRecordRepository.findById(targetBatchId);

        if (sourceCrops.isEmpty() || sourceOpt.isEmpty() || targetOpt.isEmpty()) return null;

        BatchRecord sourceBatch = sourceOpt.get();
        BatchRecord targetBatch = targetOpt.get();

        // Move crops
        sourceCrops.forEach(c -> c.setBatchId(targetBatchId));
        cropRepository.saveAll(sourceCrops);

        // Update target batch quantity
        if (targetBatch.getTotalQuantity() == null) targetBatch.setTotalQuantity(0.0);
        if (sourceBatch.getTotalQuantity() != null) {
            targetBatch.setTotalQuantity(targetBatch.getTotalQuantity() + sourceBatch.getTotalQuantity());
        }
        batchRecordRepository.save(targetBatch);

        // Delete source batch
        batchRecordRepository.deleteById(sourceBatchId);

        return targetBatch;
    }

    private String generateBatchId(String cropType) {
        String cropCode = (cropType != null && cropType.length() >= 3)
                ? cropType.substring(0, 3).toUpperCase()
                : "CRP";
        String dateCode = LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("yyMMdd"));
        String randomCode = UUID.randomUUID().toString().replaceAll("-", "").substring(0, 6).toUpperCase();
        return String.format("FCX-%s-%s-%s", cropCode, dateCode, randomCode);
    }

    // Example: process today's harvest — gather crops with status READY_FOR_HARVEST and create batch
    public BatchRecord processDailyHarvest(String farmerId) {
        List<Crop> ready = cropRepository.findByFarmerIdAndStatus(farmerId, "READY_FOR_HARVEST");
        if (ready.isEmpty()) return null;
        BatchRecord batch = new BatchRecord();
        batch.setBatchId(generateBatchId(ready.get(0).getCropType()));
        batch.setFarmerId(farmerId);
        batch.setCropType(ready.get(0).getCropType());
        double total = ready.stream().mapToDouble(c -> {
            try { return Double.parseDouble(c.getQuantity()); } catch (Exception e) { return 0; }
        }).sum();
        batch.setTotalQuantity(total);
        batch.setHarvestDate(LocalDate.now());
        batch.setStatus("HARVESTED");
        batch.setCreatedAt(java.time.LocalDateTime.now());

        // Update crops
        ready.forEach(c -> {
            c.setStatus("HARVESTED");
            c.setActualHarvestDate(LocalDate.now().toString());
        });
        cropRepository.saveAll(ready);
        return batchRecordRepository.save(batch);
    }
}
