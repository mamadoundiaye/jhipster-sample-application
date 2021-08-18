package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Consultation;
import com.mycompany.myapp.repository.ConsultationRepository;
import com.mycompany.myapp.service.ConsultationService;
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
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Consultation}.
 */
@RestController
@RequestMapping("/api")
public class ConsultationResource {

    private final Logger log = LoggerFactory.getLogger(ConsultationResource.class);

    private static final String ENTITY_NAME = "consultation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ConsultationService consultationService;

    private final ConsultationRepository consultationRepository;

    public ConsultationResource(ConsultationService consultationService, ConsultationRepository consultationRepository) {
        this.consultationService = consultationService;
        this.consultationRepository = consultationRepository;
    }

    /**
     * {@code POST  /consultations} : Create a new consultation.
     *
     * @param consultation the consultation to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new consultation, or with status {@code 400 (Bad Request)} if the consultation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/consultations")
    public ResponseEntity<Consultation> createConsultation(@RequestBody Consultation consultation) throws URISyntaxException {
        log.debug("REST request to save Consultation : {}", consultation);
        if (consultation.getId() != null) {
            throw new BadRequestAlertException("A new consultation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Consultation result = consultationService.save(consultation);
        return ResponseEntity
            .created(new URI("/api/consultations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /consultations/:id} : Updates an existing consultation.
     *
     * @param id the id of the consultation to save.
     * @param consultation the consultation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated consultation,
     * or with status {@code 400 (Bad Request)} if the consultation is not valid,
     * or with status {@code 500 (Internal Server Error)} if the consultation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/consultations/{id}")
    public ResponseEntity<Consultation> updateConsultation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Consultation consultation
    ) throws URISyntaxException {
        log.debug("REST request to update Consultation : {}, {}", id, consultation);
        if (consultation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, consultation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!consultationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Consultation result = consultationService.save(consultation);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, consultation.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /consultations/:id} : Partial updates given fields of an existing consultation, field will ignore if it is null
     *
     * @param id the id of the consultation to save.
     * @param consultation the consultation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated consultation,
     * or with status {@code 400 (Bad Request)} if the consultation is not valid,
     * or with status {@code 404 (Not Found)} if the consultation is not found,
     * or with status {@code 500 (Internal Server Error)} if the consultation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/consultations/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Consultation> partialUpdateConsultation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Consultation consultation
    ) throws URISyntaxException {
        log.debug("REST request to partial update Consultation partially : {}, {}", id, consultation);
        if (consultation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, consultation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!consultationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Consultation> result = consultationService.partialUpdate(consultation);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, consultation.getId().toString())
        );
    }

    /**
     * {@code GET  /consultations} : get all the consultations.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of consultations in body.
     */
    @GetMapping("/consultations")
    public List<Consultation> getAllConsultations(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Consultations");
        return consultationService.findAll();
    }

    /**
     * {@code GET  /consultations/:id} : get the "id" consultation.
     *
     * @param id the id of the consultation to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the consultation, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/consultations/{id}")
    public ResponseEntity<Consultation> getConsultation(@PathVariable Long id) {
        log.debug("REST request to get Consultation : {}", id);
        Optional<Consultation> consultation = consultationService.findOne(id);
        return ResponseUtil.wrapOrNotFound(consultation);
    }

    /**
     * {@code DELETE  /consultations/:id} : delete the "id" consultation.
     *
     * @param id the id of the consultation to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/consultations/{id}")
    public ResponseEntity<Void> deleteConsultation(@PathVariable Long id) {
        log.debug("REST request to delete Consultation : {}", id);
        consultationService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
