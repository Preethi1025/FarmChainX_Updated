package com.FarmChainX.backend.Controller;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;   // ✅ ADD THIS
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;


@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class CropAIController {
    
    @Value("${groq.api.key:your_groq_api_key}")
    private String apiKey;
    
    private final String GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
    
    @PostMapping("/crop-info")
    public Map<String, Object> getCropInfo(@RequestBody Map<String, String> request) {
        String cropName = request.get("cropName").toLowerCase().trim();
        
        String prompt = createPrompt(cropName);
        
        return callGroqAPI(prompt, cropName);
    }
    
    private String createPrompt(String cropName) {
        return "You are an agricultural expert. Provide detailed information about: " + cropName + "\n\n" +
               "Format your response EXACTLY like this:\n" +
               "TYPE: [Fruit/Vegetable/Grain/Legume/Nut/Herb/Spice]\n" +
               "SCIENTIFIC_NAME: [Scientific name]\n" +
               "CALORIES: [Calories per 100g]\n" +
               "NUTRITION: [Key nutrients]\n" +
               "SEASON: [Growing season]\n" +
               "USES: [Common uses]\n" +
               "HEALTH_BENEFITS: [Health benefits]\n" +
               "STORAGE: [Storage tips]\n" +
               "FUN_FACT: [Interesting fact]\n\n" +
               "Keep each section concise (1-2 sentences max).";
    }
    
    private Map<String, Object> callGroqAPI(String prompt, String cropName) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "llama-3.1-8b-instant"); // Free fast model
            requestBody.put("messages", new Object[]{
                Map.of("role", "user", "content", prompt)
            });
            requestBody.put("temperature", 0.7);
            requestBody.put("max_tokens", 500);
            
            // Headers
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.set("Authorization", "Bearer " + apiKey);
            headers.set("Content-Type", "application/json");
            
            org.springframework.http.HttpEntity<Map<String, Object>> entity = 
                new org.springframework.http.HttpEntity<>(requestBody, headers);
            
            Map<String, Object> response = restTemplate.postForObject(GROQ_URL, entity, Map.class);
            
            return parseResponse(response, cropName);
            
        } catch (Exception e) {
            return createFallbackResponse(cropName);
        }
    }
    
    private Map<String, Object> parseResponse(Map<String, Object> response, String cropName) {
        Map<String, Object> result = new HashMap<>();
        result.put("cropName", cropName);
        result.put("timestamp", new Date());
        
        try {
            if (response != null && response.containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                    String content = (String) message.get("content");
                    
                    // Parse the structured response
                    Map<String, String> parsedData = parseStructuredResponse(content);
                    result.put("data", parsedData);
                    result.put("raw", content);
                    result.put("success", true);
                    return result;
                }
            }
        } catch (Exception e) {
            // Continue to fallback
        }
        
        // Fallback
        return createFallbackResponse(cropName);
    }
    
    private Map<String, String> parseStructuredResponse(String content) {
        Map<String, String> data = new HashMap<>();
        String[] lines = content.split("\n");
        
        for (String line : lines) {
            if (line.contains(":")) {
                String[] parts = line.split(":", 2);
                if (parts.length == 2) {
                    String key = parts[0].trim().toUpperCase();
                    String value = parts[1].trim();
                    data.put(key, value);
                }
            }
        }
        
        return data;
    }
    
    private Map<String, Object> createFallbackResponse(String cropName) {
        Map<String, Object> result = new HashMap<>();
        Map<String, String> fallbackData = new HashMap<>();
        
        fallbackData.put("TYPE", "Information not available");
        fallbackData.put("CALORIES", "Data loading...");
        fallbackData.put("NUTRITION", "Try another crop or check back later");
        fallbackData.put("USES", "Common agricultural crop");
        
        result.put("cropName", cropName);
        result.put("data", fallbackData);
        result.put("success", false);
        result.put("message", "Using fallback data. Check your API key or try again.");
        
        return result;
    }
}