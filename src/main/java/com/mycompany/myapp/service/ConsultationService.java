package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Consultation;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Consultation}.
 */
public interface ConsultationService {
    /**
     * Save a consultation.
     *
     * @param consultation the entity to save.
     * @return the persisted entity.
     */
    Consultation save(Consultation consultation);

    /**
     * Partially updates a consultation.
     *
     * @param consultation the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Consultation> partialUpdate(Consultation consultation);

    /**
     * Get all the consultations.
     *
     * @return the list of entities.
     */
    List<Consultation> findAll();

    /**
     * Get all the consultations with eager load of many-to-many relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Consultation> findAllWithEagerRelationships(Pageable pageable);

    /**
     * Get the "id" consultation.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Consultation> findOne(Long id);

    /**
     * Delete the "id" consultation.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
