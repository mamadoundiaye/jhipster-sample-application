package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Consultation;
import com.mycompany.myapp.repository.ConsultationRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Consultation}.
 */
@Service
@Transactional
public class ConsultationService {

    private final Logger log = LoggerFactory.getLogger(ConsultationService.class);

    private final ConsultationRepository consultationRepository;

    public ConsultationService(ConsultationRepository consultationRepository) {
        this.consultationRepository = consultationRepository;
    }

    /**
     * Save a consultation.
     *
     * @param consultation the entity to save.
     * @return the persisted entity.
     */
    public Consultation save(Consultation consultation) {
        log.debug("Request to save Consultation : {}", consultation);
        return consultationRepository.save(consultation);
    }

    /**
     * Partially update a consultation.
     *
     * @param consultation the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Consultation> partialUpdate(Consultation consultation) {
        log.debug("Request to partially update Consultation : {}", consultation);

        return consultationRepository
            .findById(consultation.getId())
            .map(
                existingConsultation -> {
                    if (consultation.getnO() != null) {
                        existingConsultation.setnO(consultation.getnO());
                    }
                    if (consultation.getDate() != null) {
                        existingConsultation.setDate(consultation.getDate());
                    }

                    return existingConsultation;
                }
            )
            .map(consultationRepository::save);
    }

    /**
     * Get all the consultations.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Consultation> findAll() {
        log.debug("Request to get all Consultations");
        return consultationRepository.findAllWithEagerRelationships();
    }

    /**
     * Get all the consultations with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<Consultation> findAllWithEagerRelationships(Pageable pageable) {
        return consultationRepository.findAllWithEagerRelationships(pageable);
    }

    /**
     * Get one consultation by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Consultation> findOne(Long id) {
        log.debug("Request to get Consultation : {}", id);
        return consultationRepository.findOneWithEagerRelationships(id);
    }

    /**
     * Delete the consultation by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Consultation : {}", id);
        consultationRepository.deleteById(id);
    }
}
