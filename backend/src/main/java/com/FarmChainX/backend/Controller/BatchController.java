package com.FarmChainX.backend.Controller;

import com.FarmChainX.backend.Model.BatchRecord;
import com.FarmChainX.backend.Service.BatchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/batches")
public class BatchController {

    private final BatchService batchService;

    public BatchController(BatchService batchService) {
        this.batchService = batchService;
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

    // -------------------------------------------
    // Distributor: Pending Batches
    // -------------------------------------------
    @GetMapping("/pending")
    public ResponseEntity<List<BatchRecord>> getPendingBatches() {
        return ResponseEntity.ok(batchService.getPendingBatchesForDistributor());
    }

    // -------------------------------------------
    // Distributor: Approved Batches
    // -------------------------------------------
    @GetMapping("/approved/{distributorId}")
    public ResponseEntity<List<BatchRecord>> getApprovedBatches(@PathVariable String distributorId) {
        return ResponseEntity.ok(batchService.getApprovedBatches(distributorId));
    }

    // -------------------------------------------
    // Distributor APPROVE
    // -------------------------------------------
    @PutMapping("/distributor/approve/{batchId}/{distributorId}")
    public ResponseEntity<?> approveBatch(
            @PathVariable String batchId,
            @PathVariable String distributorId) {

        return ResponseEntity.ok(batchService.approveBatch(batchId, distributorId));
    }

    // -------------------------------------------
    // Distributor REJECT (accepts { "reason": "..." } in body)
    // -------------------------------------------
    @PutMapping("/distributor/reject/{batchId}/{distributorId}")
    public ResponseEntity<BatchRecord> rejectBatch(
            @PathVariable String batchId,
            @PathVariable String distributorId,
            @RequestBody(required = false) Map<String, String> body) {

        String reason = body != null ? body.get("reason") : null;
        return ResponseEntity.ok(batchService.rejectBatch(batchId, distributorId, reason));
    }

    @PutMapping("/{batchId}/status")
    public ResponseEntity<?> updateBatchStatus(
            @PathVariable String batchId,
            @RequestBody Map<String, String> body) {

        String status = body.get("status");
        BatchRecord batch = batchService.updateStatus(batchId, status);
        return ResponseEntity.ok(batch);
    }
}
