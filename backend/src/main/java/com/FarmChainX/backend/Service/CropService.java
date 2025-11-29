package com.FarmChainX.backend.Service;

import com.FarmChainX.backend.Model.Crop;
import com.FarmChainX.backend.Repository.CropRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CropService {

    private final CropRepository cropRepository;

    public CropService(CropRepository cropRepository) {
        this.cropRepository = cropRepository;
    }

    // ADD NEW CROP
    public Crop addCrop(Crop crop) {
        return cropRepository.save(crop);  // cropId auto-generated
    }

    // GET ALL CROPS OF A FARMER
    public List<Crop> getCropsByFarmer(Long farmerId) {
        return cropRepository.findByFarmerId(farmerId);
    }

    // UPDATE CROP
    public Crop updateCrop(Long cropId, Crop updatedCrop) {
        Optional<Crop> existing = cropRepository.findById(cropId);

        if (existing.isEmpty()) return null;

        Crop crop = existing.get();
        crop.setCropName(updatedCrop.getCropName());
        crop.setPrice(updatedCrop.getPrice());
        crop.setQuantity(updatedCrop.getQuantity());
        crop.setDescription(updatedCrop.getDescription());

        return cropRepository.save(crop);
    }

    // DELETE CROP
    public boolean deleteCrop(Long cropId) {
        if (!cropRepository.existsById(cropId)) return false;
        cropRepository.deleteById(cropId);
        return true;
    }
}
