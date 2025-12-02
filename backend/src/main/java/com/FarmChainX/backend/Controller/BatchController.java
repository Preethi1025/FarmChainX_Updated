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
        BatchRecord saved = batchService.createBatch(batch);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{batchId}")
    public ResponseEntity<?> getBatch(@PathVariable String batchId) {
        return batchService.getBatch(batchId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<List<BatchRecord>> getBatchesByFarmer(@PathVariable String farmerId) {
        return ResponseEntity.ok(batchService.getBatchesByFarmer(farmerId));
    }

    @PostMapping("/process-daily-harvest/{farmerId}")
    public ResponseEntity<?> processDailyHarvest(@PathVariable String farmerId) {
        BatchRecord batch = batchService.processDailyHarvest(farmerId);
        if (batch == null) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(batch);
    }

    // Get crops for a batch
    @GetMapping("/{batchId}/crops")
    public ResponseEntity<?> getCropsForBatch(@PathVariable String batchId) {
        try {
            return ResponseEntity.ok(batchService.getCropsForBatch(batchId));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // Bulk update status for a batch
    @PutMapping("/{batchId}/status")
    public ResponseEntity<?> updateBatchStatus(@PathVariable String batchId, @RequestBody Map<String, Object> body) {
        try {
            String status = (String) body.get("status");
            if (status == null || status.isEmpty()) return ResponseEntity.badRequest().body(Map.of("error", "status required"));
            return ResponseEntity.ok(batchService.bulkUpdateStatus(batchId, status));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // Bulk update quality for a batch
    @PutMapping("/{batchId}/quality")
    public ResponseEntity<?> updateBatchQuality(@PathVariable String batchId, @RequestBody Map<String, Object> body) {
        try {
            String grade = (String) body.get("qualityGrade");
            Double score = null;
            if (body.get("confidence") != null) {
                Object v = body.get("confidence");
                if (v instanceof Number) score = ((Number) v).doubleValue(); else score = Double.parseDouble(v.toString());
            }
            if (grade == null) return ResponseEntity.badRequest().body(Map.of("error", "qualityGrade required"));
            return ResponseEntity.ok(batchService.bulkUpdateQuality(batchId, grade, score));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // Split batch: divide into two batches
    @PostMapping("/{batchId}/split")
    public ResponseEntity<?> splitBatch(@PathVariable String batchId) {
        try {
            BatchRecord newBatch = batchService.splitBatch(batchId);
            if (newBatch == null) return ResponseEntity.badRequest().body(Map.of("error", "Cannot split batch (insufficient crops)"));
            return ResponseEntity.ok(newBatch);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // Merge batches: move all crops from source to target
    @PostMapping("/{sourceBatchId}/merge-into/{targetBatchId}")
    public ResponseEntity<?> mergeBatch(@PathVariable String sourceBatchId, @PathVariable String targetBatchId) {
        try {
            BatchRecord result = batchService.mergeBatch(sourceBatchId, targetBatchId);
            if (result == null) return ResponseEntity.badRequest().body(Map.of("error", "Cannot merge batches"));
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
