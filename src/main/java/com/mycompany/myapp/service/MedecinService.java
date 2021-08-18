package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Medecin;
import com.mycompany.myapp.repository.MedecinRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Medecin}.
 */
@Service
@Transactional
public class MedecinService {

    private final Logger log = LoggerFactory.getLogger(MedecinService.class);

    private final MedecinRepository medecinRepository;

    public MedecinService(MedecinRepository medecinRepository) {
        this.medecinRepository = medecinRepository;
    }

    /**
     * Save a medecin.
     *
     * @param medecin the entity to save.
     * @return the persisted entity.
     */
    public Medecin save(Medecin medecin) {
        log.debug("Request to save Medecin : {}", medecin);
        return medecinRepository.save(medecin);
    }

    /**
     * Partially update a medecin.
     *
     * @param medecin the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Medecin> partialUpdate(Medecin medecin) {
        log.debug("Request to partially update Medecin : {}", medecin);

        return medecinRepository
            .findById(medecin.getId())
            .map(
                existingMedecin -> {
                    if (medecin.getMatricule() != null) {
                        existingMedecin.setMatricule(medecin.getMatricule());
                    }
                    if (medecin.getNom() != null) {
                        existingMedecin.setNom(medecin.getNom());
                    }

                    return existingMedecin;
                }
            )
            .map(medecinRepository::save);
    }

    /**
     * Get all the medecins.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Medecin> findAll() {
        log.debug("Request to get all Medecins");
        return medecinRepository.findAll();
    }

    /**
     * Get one medecin by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Medecin> findOne(Long id) {
        log.debug("Request to get Medecin : {}", id);
        return medecinRepository.findById(id);
    }

    /**
     * Delete the medecin by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Medecin : {}", id);
        medecinRepository.deleteById(id);
    }
}
