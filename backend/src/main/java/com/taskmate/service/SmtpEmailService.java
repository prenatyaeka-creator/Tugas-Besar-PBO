package com.taskmate.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SmtpEmailService implements EmailService {

  private final JavaMailSender mailSender;

  @Value("${app.mail.from:no-reply@taskmate.local}")
  private String from;

  @Override
  public void send(String to, String subject, String body) {
    if (mailSender == null) {
      throw new IllegalStateException("JavaMailSender belum terkonfigurasi. Set konfigurasi SMTP di environment.");
    }

    SimpleMailMessage msg = new SimpleMailMessage();
    msg.setFrom(from);
    msg.setTo(to);
    msg.setSubject(subject);
    msg.setText(body);
    mailSender.send(msg);
  }
}
