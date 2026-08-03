package com.hostelsync.ai.controller;

import com.hostelsync.shared.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Tag(name = "AI Hostel Assistant", description = "AI Assistant Chat Service")
public class AiAssistantController {

    @Data
    public static class AiChatRequest {
        private String prompt;
    }

    @Data
    public static class AiChatResponse {
        private String answer;
    }

    @PostMapping("/chat")
    @Operation(summary = "Ask AI Hostel Virtual Assistant")
    public ResponseEntity<ApiResponse<AiChatResponse>> chat(@RequestBody AiChatRequest request, Authentication authentication) {
        String prompt = request.getPrompt().toLowerCase();
        String answer;

        if (prompt.contains("room")) {
            answer = "You can view your allocated room number, floor, block, and roommates under the 'Room Details' section in your dashboard.";
        } else if (prompt.contains("laundry")) {
            answer = "Laundry requests go through 5 stages: Pending -> Accepted -> In Progress -> Ready -> Collected. Check your Laundry Module for real-time status.";
        } else if (prompt.contains("parcel")) {
            answer = "When a parcel arrives, a notification with a QR pickup verification code is sent to your dashboard. Present the QR code at the Warden office to collect your parcel.";
        } else if (prompt.contains("gate pass")) {
            answer = "Gate pass applications require Warden approval. Once approved, you can download an official PDF receipt featuring an encrypted QR code and digital signature to show at the hostel gate.";
        } else if (prompt.contains("complaint")) {
            answer = "To raise a complaint, navigate to Complaints -> 'File New Complaint'. Select a category (Electricity, Water, Internet, Cleaning, etc.), priority, and upload an optional image. You can rate the resolution quality after it is resolved.";
        } else if (prompt.contains("rules") || prompt.contains("timing")) {
            answer = "Hostel Rules: Gate closing time is 10:00 PM. Quiet hours start from 10:30 PM. Visitors are allowed between 4:00 PM and 7:00 PM in the reception area.";
        } else if (prompt.contains("emergency") || prompt.contains("doctor") || prompt.contains("ambulance")) {
            answer = "Emergency Contacts:\n- Hostel Medical Room: +1-800-HOSTEL-MED\n- Chief Warden Emergency: +1-987-654-3211\n- Ambulance SOS: 108 / 911";
        } else {
            answer = "I am HostelSync AI Assistant. You can ask me about your room allocation, gate pass status, laundry updates, parcel arrivals, complaint tracking, or emergency contacts!";
        }

        AiChatResponse response = new AiChatResponse();
        response.setAnswer(answer);

        return ResponseEntity.ok(ApiResponse.success("AI response generated", response));
    }
}
