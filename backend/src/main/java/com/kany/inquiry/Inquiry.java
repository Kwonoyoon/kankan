package com.kany.inquiry;

import java.time.LocalDateTime;
import java.util.UUID;

import com.kany.space.Space;
import com.kany.user.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "inquiries")
public class Inquiry {

	@Id
	@Column(length = 40)
	private String id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id")
	private User user;

	/** 특정 공간에 대한 문의일 때만 값이 있다. 일반 문의는 null */
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "space_id")
	private Space space;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private InquiryCategory category;

	@Column(nullable = false, length = 100)
	private String title;

	@Column(nullable = false)
	private String content;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private InquiryStatus status;

	private String answer;

	@Column(name = "answered_at")
	private LocalDateTime answeredAt;

	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt;

	protected Inquiry() {
	}

	public static Inquiry create(User user, Space space, InquiryCategory category, String title, String content) {
		Inquiry i = new Inquiry();
		i.id = UUID.randomUUID().toString();
		i.user = user;
		i.space = space;
		i.category = category;
		i.title = title;
		i.content = content;
		i.status = InquiryStatus.OPEN;
		i.createdAt = LocalDateTime.now();
		return i;
	}

	/** 답변을 달거나 고친다. 고칠 때도 시각을 갱신해서 "최신 답변 시점"을 보여준다. */
	public void answer(String answer) {
		this.answer = answer;
		this.status = InquiryStatus.ANSWERED;
		this.answeredAt = LocalDateTime.now();
	}

	public String getId() {
		return id;
	}

	public User getUser() {
		return user;
	}

	public Space getSpace() {
		return space;
	}

	public InquiryCategory getCategory() {
		return category;
	}

	public String getTitle() {
		return title;
	}

	public String getContent() {
		return content;
	}

	public InquiryStatus getStatus() {
		return status;
	}

	public String getAnswer() {
		return answer;
	}

	public LocalDateTime getAnsweredAt() {
		return answeredAt;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
}
