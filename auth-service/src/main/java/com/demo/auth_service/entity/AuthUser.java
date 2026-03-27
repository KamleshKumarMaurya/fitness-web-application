package com.demo.auth_service.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "auth-users")
public class AuthUser extends AbstractPersistable {

    @Column(unique = true)
    private String email;
    private String userId;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private RoleEnum role = RoleEnum.USER;

}
