package com.FarmChainX.backend.Service;

import com.FarmChainX.backend.Model.Crop;
import com.FarmChainX.backend.Model.User;
import com.FarmChainX.backend.Repository.CropRepository;
import com.FarmChainX.backend.Repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final CropRepository cropRepository;

    public AdminService(UserRepository userRepository, CropRepository cropRepository) {
        this.userRepository = userRepository;
        this.cropRepository = cropRepository;
    }

    public Map<String, Object> getStats() {

        Map<String, Object> stats = new HashMap<>();

        stats.put("farmers", userRepository.countByRole("FARMER"));
        stats.put("distributors", userRepository.countByRole("DISTRIBUTOR"));
        stats.put("consumers", userRepository.countByRole("BUYER"));
        stats.put("crops", cropRepository.count());

        return stats;
    }

    public List<User> getUsersByRole(String role) {
        return userRepository.findByRole(role);
    }

    public List<Crop> getAllCrops() {
        return cropRepository.findAll();
    }
}
