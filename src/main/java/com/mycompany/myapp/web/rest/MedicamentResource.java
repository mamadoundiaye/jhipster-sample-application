package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Medicament;
import com.mycompany.myapp.repository.MedicamentRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Medicament}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MedicamentResource {

    private final Logger log = LoggerFactory.getLogger(MedicamentResource.class);

    private static final String ENTITY_NAME = "medicament";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MedicamentRepository medicamentRepository;

    public MedicamentResource(MedicamentRepository medicamentRepository) {
        this.medicamentRepository = medicamentRepository;
    }

    /**
     * {@code POST  /medicaments} : Create a new medicament.
     *
     * @param medicament the medicament to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new medicament, or with status {@code 400 (Bad Request)} if the medicament has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/medicaments")
    public ResponseEntity<Medicament> createMedicament(@RequestBody Medicament medicament) throws URISyntaxException {
        log.debug("REST request to save Medicament : {}", medicament);
        if (medicament.getId() != null) {
            throw new BadRequestAlertException("A new medicament cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Medicament result = medicamentRepository.save(medicament);
        return ResponseEntity
            .created(new URI("/api/medicaments/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /medicaments/:id} : Updates an existing medicament.
     *
     * @param id the id of the medicament to save.
     * @param medicament the medicament to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated medicament,
     * or with status {@code 400 (Bad Request)} if the medicament is not valid,
     * or with status {@code 500 (Internal Server Error)} if the medicament couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/medicaments/{id}")
    public ResponseEntity<Medicament> updateMedicament(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Medicament medicament
    ) throws URISyntaxException {
        log.debug("REST request to update Medicament : {}, {}", id, medicament);
        if (medicament.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, medicament.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!medicamentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Medicament result = medicamentRepository.save(medicament);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, medicament.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /medicaments/:id} : Partial updates given fields of an existing medicament, field will ignore if it is null
     *
     * @param id the id of the medicament to save.
     * @param medicament the medicament to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated medicament,
     * or with status {@code 400 (Bad Request)} if the medicament is not valid,
     * or with status {@code 404 (Not Found)} if the medicament is not found,
     * or with status {@code 500 (Internal Server Error)} if the medicament couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/medicaments/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Medicament> partialUpdateMedicament(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Medicament medicament
    ) throws URISyntaxException {
        log.debug("REST request to partial update Medicament partially : {}, {}", id, medicament);
        if (medicament.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, medicament.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!medicamentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Medicament> result = medicamentRepository
            .findById(medicament.getId())
            .map(
                existingMedicament -> {
                    if (medicament.getCode() != null) {
                        existingMedicament.setCode(medicament.getCode());
                    }
                    if (medicament.getLibelle() != null) {
                        existingMedicament.setLibelle(medicament.getLibelle());
                    }

                    return existingMedicament;
                }
            )
            .map(medicamentRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, medicament.getId().toString())
        );
    }

    /**
     * {@code GET  /medicaments} : get all the medicaments.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of medicaments in body.
     */
    @GetMapping("/medicaments")
    public List<Medicament> getAllMedicaments() {
        log.debug("REST request to get all Medicaments");
        return medicamentRepository.findAll();
    }

    /**
     * {@code GET  /medicaments/:id} : get the "id" medicament.
     *
     * @param id the id of the medicament to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the medicament, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/medicaments/{id}")
    public ResponseEntity<Medicament> getMedicament(@PathVariable Long id) {
        log.debug("REST request to get Medicament : {}", id);
        Optional<Medicament> medicament = medicamentRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(medicament);
    }

    /**
     * {@code DELETE  /medicaments/:id} : delete the "id" medicament.
     *
     * @param id the id of the medicament to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/medicaments/{id}")
    public ResponseEntity<Void> deleteMedicament(@PathVariable Long id) {
        log.debug("REST request to delete Medicament : {}", id);
        medicamentRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
