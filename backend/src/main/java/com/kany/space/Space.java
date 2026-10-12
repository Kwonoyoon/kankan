package com.kany.space;

import java.util.LinkedHashSet;
import java.util.Set;

import com.kany.branch.Branch;
import com.kany.concept.ConceptTag;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "spaces")
public class Space {

	@Id
	@Column(length = 40)
	private String id;

	// 목록을 그릴 때마다 지점 이름이 필요하므로 쿼리에서 join fetch로 한 번에 가져온다.
	// 기본 EAGER로 두면 어디서 조회하든 따라와서 불필요한 쿼리가 생긴다.
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "branch_id")
	private Branch branch;

	@Column(nullable = false, length = 100)
	private String name;

	private String description;

	@Column(nullable = false)
	private int capacity;

	/** 1시간 이용 가격(원) */
	@Column(nullable = false)
	private int price;

	/** 사진 경로를 쉼표(,)로 이어 붙인 문자열. 사진이 여러 장일 때를 대비해 TEXT 한 칸에 담는다. */
	private String images;

	@Column(name = "is_active", nullable = false)
	private boolean active;

	// 컬렉션은 List가 아니라 Set으로 둔다. List 두 개를 한 쿼리에서 join fetch하면 Hibernate가 예외를 던진다.
	@ManyToMany
	@JoinTable(name = "space_tags", joinColumns = @JoinColumn(name = "space_id"),
			inverseJoinColumns = @JoinColumn(name = "tag_id"))
	private Set<ConceptTag> tags = new LinkedHashSet<>();

	@ManyToMany
	@JoinTable(name = "space_amenities", joinColumns = @JoinColumn(name = "space_id"),
			inverseJoinColumns = @JoinColumn(name = "amenity_id"))
	private Set<Amenity> amenities = new LinkedHashSet<>();

	protected Space() {
	}

	public String getId() {
		return id;
	}

	public Branch getBranch() {
		return branch;
	}

	public String getName() {
		return name;
	}

	public String getDescription() {
		return description;
	}

	public int getCapacity() {
		return capacity;
	}

	public int getPrice() {
		return price;
	}

	public String getImages() {
		return images;
	}

	public boolean isActive() {
		return active;
	}

	public Set<ConceptTag> getTags() {
		return tags;
	}

	public Set<Amenity> getAmenities() {
		return amenities;
	}
}
