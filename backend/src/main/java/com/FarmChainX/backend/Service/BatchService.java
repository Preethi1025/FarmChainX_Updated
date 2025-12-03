package com.FarmChainX.backend.Service;

import com.FarmChainX.backend.Model.BatchRecord;
import com.FarmChainX.backend.Model.Crop;
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

    public BatchService(BatchRecordRepository batchRecordRepository, CropRepository cropRepository) {
        this.batchRecordRepository = batchRecordRepository;
        this.cropRepository = cropRepository;
    }

    public BatchRecord createBatch(BatchRecord batch) {
        if (batch.getBatchId() == null || batch.getBatchId().isEmpty()) {
            batch.setBatchId(generateBatchId(batch.getCropType()));
        }
        if (batch.getCreatedAt() == null) {
            batch.setCreatedAt(LocalDateTime.now());
        }

        if (batch.getQrCodeUrl() == null || batch.getQrCodeUrl().isEmpty()) {
            String frontendBase = System.getProperty("farmchainx.frontend.url");
            if (frontendBase == null || frontendBase.isEmpty()) {
                frontendBase = "http://localhost:5173";
            }
            batch.setQrCodeUrl(frontendBase + "/trace/" + batch.getBatchId());
        }

        return batchRecordRepository.save(batch);
    }

    public Optional<BatchRecord> getBatch(String batchId) {
        return batchRecordRepository.findById(batchId);
    }

    public List<BatchRecord> getBatchesByFarmer(String farmerId) {
        return batchRecordRepository.findByFarmerId(farmerId);
    }

    public List<Crop> getCropsForBatch(String batchId) {
        return cropRepository.findByBatchId(batchId);
    }

    public List<Crop> bulkUpdateStatus(String batchId, String status) {
        List<Crop> crops = cropRepository.findByBatchId(batchId);
        if (crops.isEmpty()) {
            return List.of();
        }

        LocalDateTime now = LocalDateTime.now();

        for (Crop c : crops) {
            c.setStatus(status);
            c.setUpdatedAt(now);

            if ("HARVESTED".equalsIgnoreCase(status) && (c.getActualHarvestDate() == null || c.getActualHarvestDate().isEmpty())) {
                c.setActualHarvestDate(LocalDate.now().toString());
            }
        }

        List<Crop> saved = cropRepository.saveAll(crops);

        batchRecordRepository.findById(batchId).ifPresent(br -> {
            br.setStatus(status);
            br.setUpdatedAt(now);

            if ("HARVESTED".equalsIgnoreCase(status) && br.getHarvestDate() == null) {
                br.setHarvestDate(LocalDate.now());
            }

            double total = saved.stream().mapToDouble(c -> {
                try { return Double.parseDouble(c.getQuantity()); } catch (Exception e) { return 0; }
            }).sum();
            br.setTotalQuantity(total);

            batchRecordRepository.save(br);
        });

        return saved;
    }

    public List<Crop> bulkUpdateQuality(String batchId, String qualityGrade, Double confidence) {
        List<Crop> crops = cropRepository.findByBatchId(batchId);
        if (crops.isEmpty()) {
            return List.of();
        }

        LocalDateTime now = LocalDateTime.now();

        for (Crop c : crops) {
            c.setQualityGrade(qualityGrade);
            if (confidence != null) {
                c.setAiConfidenceScore(confidence);
            }
            c.setUpdatedAt(now);
        }

        List<Crop> saved = cropRepository.saveAll(crops);

        batchRecordRepository.findById(batchId).ifPresent(br -> {
            br.setAvgQualityScore(confidence);
            br.setUpdatedAt(now);
            batchRecordRepository.save(br);
        });

        return saved;
    }
    public BatchRecord splitBatch(String batchId) {
        List<Crop> crops = cropRepository.findByBatchId(batchId);
        if (crops.size() < 2) return null;

        int splitPoint = crops.size() / 2;
        List<Crop> cropsToMove = crops.subList(splitPoint, crops.size());

        Optional<BatchRecord> existing = batchRecordRepository.findById(batchId);
        if (existing.isEmpty()) return null;

        BatchRecord oldBatch = existing.get();
        String newBatchId = generateBatchId(oldBatch.getCropType());

        cropsToMove.forEach(c -> c.setBatchId(newBatchId));
        cropRepository.saveAll(cropsToMove);

        BatchRecord newBatch = new BatchRecord();
        newBatch.setBatchId(newBatchId);
        newBatch.setFarmerId(oldBatch.getFarmerId());
        newBatch.setCropType(oldBatch.getCropType());

        double newTotal = cropsToMove.stream().mapToDouble(c -> {
            try { return Double.parseDouble(c.getQuantity()); } catch (Exception e) { return 0; }
        }).sum();
        newBatch.setTotalQuantity(newTotal);
        newBatch.setStatus("PLANTED");
        newBatch.setCreatedAt(LocalDateTime.now());

        String frontendBase = System.getProperty("farmchainx.frontend.url");
        if (frontendBase == null || frontendBase.isEmpty()) {
            frontendBase = "http://localhost:5173";
        }
        newBatch.setQrCodeUrl(frontendBase + "/trace/" + newBatchId);

        if (oldBatch.getTotalQuantity() != null) {
            oldBatch.setTotalQuantity(oldBatch.getTotalQuantity() - newTotal);
        }
        batchRecordRepository.save(oldBatch);

        return batchRecordRepository.save(newBatch);
    }

    public BatchRecord mergeBatch(String sourceBatchId, String targetBatchId) {
        List<Crop> sourceCrops = cropRepository.findByBatchId(sourceBatchId);
        Optional<BatchRecord> sourceOpt = batchRecordRepository.findById(sourceBatchId);
        Optional<BatchRecord> targetOpt = batchRecordRepository.findById(targetBatchId);

        if (sourceCrops.isEmpty() || sourceOpt.isEmpty() || targetOpt.isEmpty()) return null;

        BatchRecord sourceBatch = sourceOpt.get();
        BatchRecord targetBatch = targetOpt.get();

        sourceCrops.forEach(c -> c.setBatchId(targetBatchId));
        cropRepository.saveAll(sourceCrops);

        if (targetBatch.getTotalQuantity() == null) targetBatch.setTotalQuantity(0.0);
        if (sourceBatch.getTotalQuantity() != null) {
            targetBatch.setTotalQuantity(targetBatch.getTotalQuantity() + sourceBatch.getTotalQuantity());
        }
        targetBatch.setUpdatedAt(LocalDateTime.now());
        batchRecordRepository.save(targetBatch);

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

    public BatchRecord processDailyHarvest(String farmerId) {
        List<Crop> ready = cropRepository.findByFarmerIdAndStatus(farmerId, "READY_FOR_HARVEST");
        if (ready.isEmpty()) return null;

        BatchRecord batch = new BatchRecord();
        String batchId = generateBatchId(ready.get(0).getCropType());
        batch.setBatchId(batchId);
        batch.setFarmerId(farmerId);
        batch.setCropType(ready.get(0).getCropType());

        double total = ready.stream().mapToDouble(c -> {
            try { return Double.parseDouble(c.getQuantity()); } catch (Exception e) { return 0; }
        }).sum();
        batch.setTotalQuantity(total);
        batch.setHarvestDate(LocalDate.now());
        batch.setStatus("HARVESTED");
        batch.setCreatedAt(LocalDateTime.now());

        // QR for batch
        String frontendBase = System.getProperty("farmchainx.frontend.url");
        if (frontendBase == null || frontendBase.isEmpty()) {
            frontendBase = "http://localhost:5173";
        }
        batch.setQrCodeUrl(frontendBase + "/trace/" + batchId);

        ready.forEach(c -> {
            c.setStatus("HARVESTED");
            c.setActualHarvestDate(LocalDate.now().toString());
            c.setBatchId(batchId);
            c.setUpdatedAt(LocalDateTime.now());
        });
        cropRepository.saveAll(ready);

        return batchRecordRepository.save(batch);
    }
}
