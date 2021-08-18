package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Consultation;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Consultation entity.
 */
@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
    @Query(
        value = "select distinct consultation from Consultation consultation left join fetch consultation.medicaments",
        countQuery = "select count(distinct consultation) from Consultation consultation"
    )
    Page<Consultation> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct consultation from Consultation consultation left join fetch consultation.medicaments")
    List<Consultation> findAllWithEagerRelationships();

    @Query("select consultation from Consultation consultation left join fetch consultation.medicaments where consultation.id =:id")
    Optional<Consultation> findOneWithEagerRelationships(@Param("id") Long id);
}
