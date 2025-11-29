package com.FarmChainX.backend.Controller;

import com.FarmChainX.backend.Model.Crop;
import com.FarmChainX.backend.Service.CropService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/crops")
@CrossOrigin(origins = "*")
public class CropController {

    private final CropService cropService;

    public CropController(CropService cropService) {
        this.cropService = cropService;
    }

    // ADD CROP
    @PostMapping("/add")
    public Crop addCrop(@RequestBody Crop crop) {
        return cropService.addCrop(crop); // No manual setting ID
    }

    // FETCH ALL CROPS OF A FARMER
    @GetMapping("/farmer/{farmerId}")
    public List<Crop> getCrops(@PathVariable Long farmerId) {
        return cropService.getCropsByFarmer(farmerId);
    }

    // UPDATE CROP
    @PutMapping("/update/{id}")
    public Crop updateCrop(@PathVariable Long id, @RequestBody Crop crop) {
        return cropService.updateCrop(id, crop);
    }

    // DELETE CROP
    @DeleteMapping("/delete/{id}")
    public String deleteCrop(@PathVariable Long id) {
        boolean deleted = cropService.deleteCrop(id);
        return deleted ? "Crop deleted" : "Crop not found";
    }
}
