package com.kany.user;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// 클래스 이름이 User인 이유: 테이블은 users지만 엔티티는 한 행 = 한 명이라 단수형으로 쓴다.
@Entity
@Table(name = "users")
public class User {

	@Id
	@Column(length = 40)
	private String id;

	@Column(nullable = false)
	private String email;

	/** BCrypt 해시. 평문 비밀번호는 어디에도 저장하거나 로그로 남기지 않는다. */
	@Column(name = "password_hash", nullable = false, length = 100)
	private String passwordHash;

	@Column(nullable = false, length = 100)
	private String nickname;

	// 이름(USER/ADMIN)으로 저장한다. 기본값인 순서(0,1)로 저장하면 enum에 값을 끼워 넣는 순간 기존 데이터의 뜻이 바뀐다.
	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private UserRole role;

	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt;

	protected User() {
	}

	private User(String email, String passwordHash, String nickname, UserRole role) {
		this.id = UUID.randomUUID().toString();
		this.email = email;
		this.passwordHash = passwordHash;
		this.nickname = nickname;
		this.role = role;
		this.createdAt = LocalDateTime.now();
	}

	public static User create(String email, String passwordHash, String nickname, UserRole role) {
		return new User(email, passwordHash, nickname, role);
	}

	public String getId() {
		return id;
	}

	public String getEmail() {
		return email;
	}

	public String getPasswordHash() {
		return passwordHash;
	}

	public String getNickname() {
		return nickname;
	}

	public UserRole getRole() {
		return role;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
}
