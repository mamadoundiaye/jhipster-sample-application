package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Patient;
import com.mycompany.myapp.repository.PatientRepository;
import com.mycompany.myapp.service.PatientService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Patient}.
 */
@Service
@Transactional
public class PatientServiceImpl implements PatientService {

    private final Logger log = LoggerFactory.getLogger(PatientServiceImpl.class);

    private final PatientRepository patientRepository;

    public PatientServiceImpl(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    @Override
    public Patient save(Patient patient) {
        log.debug("Request to save Patient : {}", patient);
        return patientRepository.save(patient);
    }

    @Override
    public Optional<Patient> partialUpdate(Patient patient) {
        log.debug("Request to partially update Patient : {}", patient);

        return patientRepository
            .findById(patient.getId())
            .map(
                existingPatient -> {
                    if (patient.getNoss() != null) {
                        existingPatient.setNoss(patient.getNoss());
                    }
                    if (patient.getNom() != null) {
                        existingPatient.setNom(patient.getNom());
                    }

                    return existingPatient;
                }
            )
            .map(patientRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Patient> findAll() {
        log.debug("Request to get all Patients");
        return patientRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Patient> findOne(Long id) {
        log.debug("Request to get Patient : {}", id);
        return patientRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Patient : {}", id);
        patientRepository.deleteById(id);
    }
}
