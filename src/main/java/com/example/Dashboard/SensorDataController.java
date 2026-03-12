package com.example.Dashboard;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;


import java.io.IOException;
import java.util.concurrent.CopyOnWriteArraySet;

@Controller
@RequestMapping("/api/dashboard")
public class SensorDataController extends TextWebSocketHandler {
    private AuthService authService; // Inject your AuthService

    // Constructor Injection (Spring Boot preferred way to inject dependencies)
    public void DashboardController(AuthService authService) {
        this.authService = authService;
    }

    // This is your protected endpoint
    @GetMapping("/data")
    public ResponseEntity<String> getProtectedDashboardData(
            @RequestHeader(name = "Authorization") String authorizationHeader) { // Expect Authorization header

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return new ResponseEntity<>("Unauthorized: Missing or invalid Authorization header", HttpStatus.UNAUTHORIZED);
        }

        // Extract the actual ID token from the "Bearer " prefix
        String idToken = authorizationHeader.substring("Bearer ".length());

        try {
            FirebaseToken decodedToken = authService.verifyToken(idToken);
            String uid = decodedToken.getUid(); // User's unique ID from Firebase
            String email = decodedToken.getEmail(); // User's email

            // If we reach here, the token is valid.
            // You can now use 'uid' or 'email' to identify the user
            // and retrieve user-specific data from your InfluxDB or other sources.

            return new ResponseEntity<>("Hello, authenticated user " + email + " (UID: " + uid + ")! Here is your protected dashboard data.", HttpStatus.OK);

        } catch (FirebaseAuthException e) {
            // This catches cases where the token is invalid, expired, or other Firebase Auth issues
            return new ResponseEntity<>("Unauthorized: Invalid or expired token. " + e.getMessage(), HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            // Catch any other unexpected errors
            return new ResponseEntity<>("Internal Server Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    private final CopyOnWriteArraySet<WebSocketSession> sessions = new CopyOnWriteArraySet<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, org.springframework.web.socket.CloseStatus status) {
        sessions.remove(session);
    }

    public void broadcast(String message) {
        sessions.forEach(session -> {
            try {
                session.sendMessage(new TextMessage(message));
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
    }
}