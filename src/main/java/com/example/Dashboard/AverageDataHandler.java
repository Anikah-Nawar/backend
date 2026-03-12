package com.example.Dashboard;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.*;

@Component
public class AverageDataHandler extends TextWebSocketHandler {

    private final Set<WebSocketSession> sessions = new HashSet<>();
    private final AverageDataService avgService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AverageDataHandler(AverageDataService avgService) {
        this.avgService = avgService;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);

        // ✅ Send initial 24-hour average data immediately on new connection
        Map<String, List<Map<String, Object>>> data = avgService.getAveragesLast24h();
        String json = objectMapper.writeValueAsString(data);
        session.sendMessage(new TextMessage(json));
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.remove(session);
    }

    // ✅ Send updated averages every minute to all connected clients
    @Scheduled(fixedRate = 60000)
    public void broadcastAverages() throws Exception {
        Map<String, List<Map<String, Object>>> data = avgService.getAveragesLast24h();
        String json = objectMapper.writeValueAsString(data);

        for (WebSocketSession session : sessions) {
            if (session.isOpen()) {
                session.sendMessage(new TextMessage(json));
            }
        }
    }
}
