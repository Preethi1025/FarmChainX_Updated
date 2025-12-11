package com.FarmChainX.backend.Controller;

import com.FarmChainX.backend.Model.BatchRecord;
import com.FarmChainX.backend.Model.BatchTrace;
import com.FarmChainX.backend.Repository.BatchTraceRepository;
import com.FarmChainX.backend.Service.BatchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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

    @PostMapping
    public ResponseEntity<BatchRecord> createBatch(@RequestBody BatchRecord batch) {
        return ResponseEntity.ok(batchService.createBatch(batch));
    }

    @GetMapping("/{batchId}")
    public ResponseEntity<?> getBatch(@PathVariable String batchId) {
        return batchService.getBatch(batchId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<List<BatchRecord>> getBatchesByFarmer(@PathVariable String farmerId) {
        return ResponseEntity.ok(batchService.getBatchesByFarmer(farmerId));
    }

    @GetMapping("/{batchId}/crops")
    public ResponseEntity<?> getCropsForBatch(@PathVariable String batchId) {
        return ResponseEntity.ok(batchService.getCropsForBatch(batchId));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Map<String, Object>>> getPendingBatches() {
        return ResponseEntity.ok(batchService.getPendingBatchesForDistributor());
    }

    @GetMapping("/approved/{distributorId}")
    public ResponseEntity<List<Map<String, Object>>> getApprovedBatches(@PathVariable String distributorId) {
        return ResponseEntity.ok(batchService.getApprovedBatches(distributorId));
    }

    @PutMapping("/distributor/approve/{batchId}/{distributorId}")
    public ResponseEntity<?> approveBatch(
            @PathVariable String batchId,
            @PathVariable String distributorId) {
        return ResponseEntity.ok(batchService.approveBatch(batchId, distributorId));
    }

    @PutMapping("/distributor/reject/{batchId}/{distributorId}")
    public ResponseEntity<BatchRecord> rejectBatch(
            @PathVariable String batchId,
            @PathVariable String distributorId) {
        return ResponseEntity.ok(batchService.rejectBatch(batchId, distributorId));
    }

    // ------------------- UPDATE STATUS -------------------
    @PutMapping("/{batchId}/status")
    public ResponseEntity<BatchRecord> updateBatchStatus(
            @PathVariable String batchId,
            @RequestBody Map<String, String> body) {

        String status = body.get("status");
        String userId = body.get("userId"); // get from body
        BatchRecord batch = batchService.updateStatus(batchId, status, userId);
        return ResponseEntity.ok(batch);
    }


    // ------------------- GET TRACE -------------------
    @GetMapping("/{batchId}/trace")

    public ResponseEntity<Map<String, Object>> getBatchTrace(@PathVariable String batchId) {

        List<BatchTrace> traces = batchTraceRepository.findByBatchIdOrderByTimestampAsc(batchId);
        BatchRecord batch = batchService.getBatch(batchId)
                .orElseThrow(() -> new RuntimeException("Batch not found"));

        Map<String, Object> response = new HashMap<>();
        response.put("farmerId", batch.getFarmerId());
        response.put("cropType", batch.getCropType());     // <-- safer naming
        response.put("distributorId", batch.getDistributorId());
        response.put("traces", traces);

        return ResponseEntity.ok(response);
    }


}
