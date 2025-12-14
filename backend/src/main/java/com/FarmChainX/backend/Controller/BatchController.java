package com.FarmChainX.backend.Controller;

import com.FarmChainX.backend.Model.BatchRecord;
import com.FarmChainX.backend.Model.BatchTrace;
import com.FarmChainX.backend.Service.BatchService;
import com.FarmChainX.backend.Repository.BatchTraceRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/batches")
public class BatchController {

    private final BatchService batchService;
    private final BatchTraceRepository batchTraceRepository;

    public BatchController(BatchService batchService, BatchTraceRepository batchTraceRepository) {
        this.batchService = batchService;
        this.batchTraceRepository = batchTraceRepository;
    }

    // ------------------- CREATE BATCH -------------------
    @PostMapping
    public ResponseEntity<BatchRecord> createBatch(@RequestBody BatchRecord batch) {
        return ResponseEntity.ok(batchService.createBatch(batch));
    }

    // ------------------- GET BATCH -------------------
    @GetMapping("/{batchId}")
    public ResponseEntity<?> getBatch(@PathVariable String batchId) {
        return batchService.getBatch(batchId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ------------------- LIST BY FARMER -------------------
    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<List<BatchRecord>> getBatchesByFarmer(@PathVariable String farmerId) {
        return ResponseEntity.ok(batchService.getBatchesByFarmer(farmerId));
    }

    // ------------------- CROPS FOR BATCH -------------------
    @GetMapping("/{batchId}/crops")
    public ResponseEntity<?> getCropsForBatch(@PathVariable String batchId) {
        return ResponseEntity.ok(batchService.getCropsForBatch(batchId));
    }

    // ------------------- PENDING FOR DISTRIBUTOR -------------------
    @GetMapping("/pending")
    public ResponseEntity<List<Map<String, Object>>> getPendingBatches() {
        return ResponseEntity.ok(batchService.getPendingBatchesForDistributor());
    }

    // ------------------- APPROVED BATCHES -------------------
    @GetMapping("/approved/{distributorId}")
    public ResponseEntity<List<Map<String, Object>>> getApprovedBatches(@PathVariable String distributorId) {
        return ResponseEntity.ok(batchService.getApprovedBatches(distributorId));
    }

    // ------------------- APPROVE -------------------
    @PutMapping("/distributor/approve/{batchId}/{distributorId}")
    public ResponseEntity<?> approveBatch(@PathVariable String batchId, @PathVariable String distributorId) {
        return ResponseEntity.ok(batchService.approveBatch(batchId, distributorId));
    }

    // ------------------- REJECT -------------------
//    @PutMapping("/distributor/reject/{batchId}/{distributorId}")
//    public ResponseEntity<BatchRecord> rejectBatch(@PathVariable String batchId, @PathVariable String distributorId) {
//        return ResponseEntity.ok(batchService.rejectBatch(batchId, distributorId));
//    }

    // ------------------- UPDATE STATUS (handles QUALITY_UPDATED payload as well) -------------------
    @PutMapping("/{batchId}/status")
    public ResponseEntity<BatchRecord> updateBatchStatus(
            @PathVariable String batchId,
            @RequestBody Map<String, Object> body) {

        /*
         Expecting:
         {
           "status": "QUALITY_UPDATED" | "HARVESTED" | ...,
           "userId": "123",
           // optional for quality:
           "qualityGrade": "A",
           "confidence": 87
         }
        */

        String status = (String) body.get("status");
        String userId = body.get("userId") != null ? body.get("userId").toString() : null;

        if ("QUALITY_UPDATED".equalsIgnoreCase(status)) {
            String grade = body.get("qualityGrade") != null ? body.get("qualityGrade").toString() : null;
            Integer confidence = null;
            if (body.get("confidence") != null) {
                try {
                    confidence = Integer.valueOf(String.valueOf(body.get("confidence")));
                } catch (NumberFormatException ignored) { }
            }
            return ResponseEntity.ok(batchService.updateQualityGrade(batchId, grade, confidence, userId));
        } else {
            return ResponseEntity.ok(batchService.updateStatus(batchId, status, userId));
        }
    }

    // ------------------- SPLIT BATCH -------------------
    @PostMapping("/{batchId}/split")
    public ResponseEntity<BatchRecord> splitBatch(
            @PathVariable String batchId,
            @RequestBody Map<String, Object> body) {

        double splitQty = Double.parseDouble(body.get("quantity").toString());
        String userId = body.get("userId").toString();

        return ResponseEntity.ok(batchService.splitBatch(batchId, splitQty, userId));
    }

    // ------------------- MERGE BATCHES -------------------
    @PostMapping("/merge/{targetBatchId}")
    public ResponseEntity<List<BatchRecord>> mergeBatch(
            @PathVariable String targetBatchId,
            @RequestBody Map<String, Object> body) {

        @SuppressWarnings("unchecked")
        List<String> sources = (List<String>) body.get("sourceBatchIds");
        String userId = body.get("userId").toString();

        List<BatchRecord> updatedBatches = batchService.mergeBatches(targetBatchId, sources, userId);

        return ResponseEntity.ok(updatedBatches);
    }


    // ------------------- TRACE -------------------
    @GetMapping("/{batchId}/trace")
    public ResponseEntity<Map<String, Object>> getBatchTrace(@PathVariable String batchId) {

        List<BatchTrace> traces = batchTraceRepository.findByBatchIdOrderByTimestampAsc(batchId);
        BatchRecord batch = batchService.getBatch(batchId)
                .orElseThrow(() -> new RuntimeException("Batch not found"));

        Map<String, Object> response = new HashMap<>();
        response.put("farmerId", batch.getFarmerId());
        response.put("cropType", batch.getCropType());
        response.put("distributorId", batch.getDistributorId());
        response.put("traces", traces);

        return ResponseEntity.ok(response);
    }
    @PutMapping("/distributor/reject/{batchId}/{distributorId}")
    public ResponseEntity<?> rejectBatch(
            @PathVariable String batchId,
            @PathVariable String distributorId,
            @RequestBody Map<String, String> body
    ) {
        String reason = body.get("reason");
        return ResponseEntity.ok(
                batchService.rejectBatch(batchId, distributorId, reason)
        );
    }

}
