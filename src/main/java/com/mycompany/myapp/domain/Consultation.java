package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Consultation.
 */
@Entity
@Table(name = "consultation")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Consultation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "n_o")
    private Integer nO;

    @Column(name = "date")
    private LocalDate date;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JoinTable(
        name = "rel_consultation__medicament",
        joinColumns = @JoinColumn(name = "consultation_id"),
        inverseJoinColumns = @JoinColumn(name = "medicament_id")
    )
    @JsonIgnoreProperties(value = { "consultations" }, allowSetters = true)
    private Set<Medicament> medicaments = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "consultations" }, allowSetters = true)
    private Medecin medecin;

    @ManyToOne
    @JsonIgnoreProperties(value = { "consultations" }, allowSetters = true)
    private Patient patient;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Consultation id(Long id) {
        this.id = id;
        return this;
    }

    public Integer getnO() {
        return this.nO;
    }

    public Consultation nO(Integer nO) {
        this.nO = nO;
        return this;
    }

    public void setnO(Integer nO) {
        this.nO = nO;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public Consultation date(LocalDate date) {
        this.date = date;
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Set<Medicament> getMedicaments() {
        return this.medicaments;
    }

    public Consultation medicaments(Set<Medicament> medicaments) {
        this.setMedicaments(medicaments);
        return this;
    }

    public Consultation addMedicament(Medicament medicament) {
        this.medicaments.add(medicament);
        medicament.getConsultations().add(this);
        return this;
    }

    public Consultation removeMedicament(Medicament medicament) {
        this.medicaments.remove(medicament);
        medicament.getConsultations().remove(this);
        return this;
    }

    public void setMedicaments(Set<Medicament> medicaments) {
        this.medicaments = medicaments;
    }

    public Medecin getMedecin() {
        return this.medecin;
    }

    public Consultation medecin(Medecin medecin) {
        this.setMedecin(medecin);
        return this;
    }

    public void setMedecin(Medecin medecin) {
        this.medecin = medecin;
    }

    public Patient getPatient() {
        return this.patient;
    }

    public Consultation patient(Patient patient) {
        this.setPatient(patient);
        return this;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Consultation)) {
            return false;
        }
        return id != null && id.equals(((Consultation) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Consultation{" +
            "id=" + getId() +
            ", nO=" + getnO() +
            ", date='" + getDate() + "'" +
            "}";
    }
}
