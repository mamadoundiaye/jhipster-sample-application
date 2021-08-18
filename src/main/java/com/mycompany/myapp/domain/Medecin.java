package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Medecin.
 */
@Entity
@Table(name = "medecin")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Medecin implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "matricule")
    private String matricule;

    @Column(name = "nom")
    private String nom;

    @OneToMany(mappedBy = "medecin")
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

    public Medecin id(Long id) {
        this.id = id;
        return this;
    }

    public String getMatricule() {
        return this.matricule;
    }

    public Medecin matricule(String matricule) {
        this.matricule = matricule;
        return this;
    }

    public void setMatricule(String matricule) {
        this.matricule = matricule;
    }

    public String getNom() {
        return this.nom;
    }

    public Medecin nom(String nom) {
        this.nom = nom;
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public Set<Consultation> getConsultations() {
        return this.consultations;
    }

    public Medecin consultations(Set<Consultation> consultations) {
        this.setConsultations(consultations);
        return this;
    }

    public Medecin addConsultation(Consultation consultation) {
        this.consultations.add(consultation);
        consultation.setMedecin(this);
        return this;
    }

    public Medecin removeConsultation(Consultation consultation) {
        this.consultations.remove(consultation);
        consultation.setMedecin(null);
        return this;
    }

    public void setConsultations(Set<Consultation> consultations) {
        if (this.consultations != null) {
            this.consultations.forEach(i -> i.setMedecin(null));
        }
        if (consultations != null) {
            consultations.forEach(i -> i.setMedecin(this));
        }
        this.consultations = consultations;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Medecin)) {
            return false;
        }
        return id != null && id.equals(((Medecin) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Medecin{" +
            "id=" + getId() +
            ", matricule='" + getMatricule() + "'" +
            ", nom='" + getNom() + "'" +
            "}";
    }
}
