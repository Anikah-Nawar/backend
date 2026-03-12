package com.example.Dashboard;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    public FirebaseToken verifyToken(String idToken) throws FirebaseAuthException {
        // idToken comes from the client app (your frontend)
        return FirebaseAuth.getInstance().verifyIdToken(idToken);
    }

    // Example of using it in a protected endpoint
    public String getProtectedData(String idToken) {
        try {
            FirebaseToken decodedToken = verifyToken(idToken);
            String uid = decodedToken.getUid(); // User's unique ID
            // User is authenticated, proceed to provide protected data
            return "Hello, authenticated user " + uid + "! Here is your dashboard data.";
        } catch (FirebaseAuthException e) {
            // Token is invalid or expired
            throw new RuntimeException("Unauthorized: Invalid or expired token", e);
        }
    }
}