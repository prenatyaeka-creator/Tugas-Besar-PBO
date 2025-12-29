package com.taskmate.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {

  private final SecretKey key;
  private final long expirationMinutes;

  public JwtService(
      @Value("${taskmate.jwt.secret}") String secret,
      @Value("${taskmate.jwt.expiration-minutes}") long expirationMinutes
  ) {
    this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    this.expirationMinutes = expirationMinutes;
  }

  public String generateToken(String subjectEmail, Map<String, Object> extraClaims) {
    Instant now = Instant.now();
    Instant exp = now.plus(expirationMinutes, ChronoUnit.MINUTES);
    return Jwts.builder()
        .subject(subjectEmail)
        .issuedAt(Date.from(now))
        .expiration(Date.from(exp))
        .claims(extraClaims)
        .signWith(key)
        .compact();
  }

  public String extractSubject(String token) {
    return Jwts.parser()
        .verifyWith(key)
        .build()
        .parseSignedClaims(token)
        .getPayload()
        .getSubject();
  }

  public boolean isTokenValid(String token) {
    try {
      var payload = Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
      return payload.getExpiration() != null && payload.getExpiration().after(new Date());
    } catch (Exception e) {
      return false;
    }
  }
}
