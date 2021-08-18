package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Consultation;
import com.mycompany.myapp.repository.ConsultationRepository;
import com.mycompany.myapp.service.ConsultationService;
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
public class ConsultationServiceImpl implements ConsultationService {

    private final Logger log = LoggerFactory.getLogger(ConsultationServiceImpl.class);

    private final ConsultationRepository consultationRepository;

    public ConsultationServiceImpl(ConsultationRepository consultationRepository) {
        this.consultationRepository = consultationRepository;
    }

    @Override
    public Consultation save(Consultation consultation) {
        log.debug("Request to save Consultation : {}", consultation);
        return consultationRepository.save(consultation);
    }

    @Override
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

    @Override
    @Transactional(readOnly = true)
    public List<Consultation> findAll() {
        log.debug("Request to get all Consultations");
        return consultationRepository.findAllWithEagerRelationships();
    }

    public Page<Consultation> findAllWithEagerRelationships(Pageable pageable) {
        return consultationRepository.findAllWithEagerRelationships(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Consultation> findOne(Long id) {
        log.debug("Request to get Consultation : {}", id);
        return consultationRepository.findOneWithEagerRelationships(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Consultation : {}", id);
        consultationRepository.deleteById(id);
    }
}
