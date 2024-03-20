package musinco.webapp.java_backend.models;

import jakarta.persistence.*;

@Entity
@Table(name = "user_settings")
public class UserSetting {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @Id
    private Users user;

    @Column(name = "notification_enabled")
    private Boolean notificationEnabled;

    @Column(name = "language", length = 50)
    private String language;

    @Column(name = "timezone", length = 50)
    private String timezone;

    @Column(name = "email_notifications")
    private Boolean emailNotifications;

    public Boolean getEmailNotifications() {
        return emailNotifications;
    }

    public void setEmailNotifications(Boolean emailNotifications) {
        this.emailNotifications = emailNotifications;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public Boolean getNotificationEnabled() {
        return notificationEnabled;
    }

    public void setNotificationEnabled(Boolean notificationEnabled) {
        this.notificationEnabled = notificationEnabled;
    }

    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
    }

}