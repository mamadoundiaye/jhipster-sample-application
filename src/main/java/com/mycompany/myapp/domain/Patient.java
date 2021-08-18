package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Patient.
 */
@Entity
@Table(name = "patient")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Patient implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "noss")
    private String noss;

    @Column(name = "nom")
    private String nom;

    @OneToMany(mappedBy = "patient")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "medicaments", "medecin", "patient" }, allowSetters = true)
    private Set<Consultation> consultations = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Patient id(Long id) {
        this.id = id;
        return this;
    }

    public String getNoss() {
        return this.noss;
    }

    public Patient noss(String noss) {
        this.noss = noss;
        return this;
    }

    public void setNoss(String noss) {
        this.noss = noss;
    }

    public String getNom() {
        return this.nom;
    }

    public Patient nom(String nom) {
        this.nom = nom;
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public Set<Consultation> getConsultations() {
        return this.consultations;
    }

    public Patient consultations(Set<Consultation> consultations) {
        this.setConsultations(consultations);
        return this;
    }

    public Patient addConsultation(Consultation consultation) {
        this.consultations.add(consultation);
        consultation.setPatient(this);
        return this;
    }

    public Patient removeConsultation(Consultation consultation) {
        this.consultations.remove(consultation);
        consultation.setPatient(null);
        return this;
    }

    public void setConsultations(Set<Consultation> consultations) {
        if (this.consultations != null) {
            this.consultations.forEach(i -> i.setPatient(null));
        }
        if (consultations != null) {
            consultations.forEach(i -> i.setPatient(this));
        }
        this.consultations = consultations;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Patient)) {
            return false;
        }
        return id != null && id.equals(((Patient) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Patient{" +
            "id=" + getId() +
            ", noss='" + getNoss() + "'" +
            ", nom='" + getNom() + "'" +
            "}";
    }
}
