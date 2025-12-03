package com.FarmChainX.backend.Model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "batch_records")
public class BatchRecord {

    @Id
    @Column(name = "batch_id", nullable = false, unique = true)
    private String batchId;

    @Column(name = "farmer_id")
    private String farmerId;

    @Column(name = "distributor_id")
    private String distributorId; // <-- Added distributor

    @Column(name = "crop_type")
    private String cropType;

    @Column(name = "total_quantity")
    private Double totalQuantity;

    @Column(name = "avg_quality_score")
    private Double avgQualityScore;

    @Column(name = "harvest_date")
    private LocalDate harvestDate;

    @Column(name = "status", nullable = false)
    private String status="PLANTED";

    @Column(name = "reject_reason")
    private String rejectReason; // <-- Added rejection reason

    @Column(name = "qr_code_url")
    private String qrCodeUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /** AUTO SET CREATED & UPDATED TIMESTAMPS */
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }


    // ---------------- GETTERS & SETTERS ----------------

    public String getBatchId() { return batchId; }
    public void setBatchId(String batchId) { this.batchId = batchId; }

    public String getFarmerId() { return farmerId; }
    public void setFarmerId(String farmerId) { this.farmerId = farmerId; }

    public String getDistributorId() { return distributorId; }
    public void setDistributorId(String distributorId) { this.distributorId = distributorId; }

    public String getCropType() { return cropType; }
    public void setCropType(String cropType) { this.cropType = cropType; }

    public Double getTotalQuantity() { return totalQuantity; }
    public void setTotalQuantity(Double totalQuantity) { this.totalQuantity = totalQuantity; }

    public Double getAvgQualityScore() { return avgQualityScore; }
    public void setAvgQualityScore(Double avgQualityScore) { this.avgQualityScore = avgQualityScore; }

    public LocalDate getHarvestDate() { return harvestDate; }
    public void setHarvestDate(LocalDate harvestDate) { this.harvestDate = harvestDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRejectReason() { return rejectReason; }
    public void setRejectReason(String rejectReason) { this.rejectReason = rejectReason; }

    public String getQrCodeUrl() { return qrCodeUrl; }
    public void setQrCodeUrl(String qrCodeUrl) { this.qrCodeUrl = qrCodeUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
