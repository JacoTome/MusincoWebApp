package musinco.webapp.java_backend.services;

import musinco.webapp.java_backend.models.UserRole;
import musinco.webapp.java_backend.models.Users;
import org.jetbrains.annotations.NotNull;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Set;
import java.util.logging.Logger;
import java.util.stream.Collectors;

public class UserInfoDetails implements UserDetails {

    private static final Logger log = Logger.getLogger(UserInfoDetails.class.getName());
    private final String username;
    private final String email;

    public String getEmail() {
        return email;
    }

    private final Collection<? extends GrantedAuthority> authorities;
    private final String password;


    public UserInfoDetails(@NotNull Users user) {
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.password = user.getPassword();
        Set<UserRole> roles = user.getUserRoles();
        this.authorities = roles.stream()
                .map(role -> new SimpleGrantedAuthority(role.getRoles().getName().name().toUpperCase()))
                .collect(Collectors.toList());
    }
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
