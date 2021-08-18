package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Medecin;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Medecin}.
 */
public interface MedecinService {
    /**
     * Save a medecin.
     *
     * @param medecin the entity to save.
     * @return the persisted entity.
     */
    Medecin save(Medecin medecin);

    /**
     * Partially updates a medecin.
     *
     * @param medecin the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Medecin> partialUpdate(Medecin medecin);

    /**
     * Get all the medecins.
     *
     * @return the list of entities.
     */
    List<Medecin> findAll();

    /**
     * Get the "id" medecin.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Medecin> findOne(Long id);

    /**
     * Delete the "id" medecin.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
