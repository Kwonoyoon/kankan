package com.kany.space;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AmenityRepository extends JpaRepository<Amenity, String> {

	List<Amenity> findByNameIn(Collection<String> names);
}
