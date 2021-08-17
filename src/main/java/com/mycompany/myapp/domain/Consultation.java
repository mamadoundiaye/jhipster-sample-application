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

    @OneToMany(mappedBy = "consultation")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "consultation" }, allowSetters = true)
    private Set<Medecin> medecins = new HashSet<>();

    @OneToMany(mappedBy = "consultation")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "consultation" }, allowSetters = true)
    private Set<Patient> patients = new HashSet<>();

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JoinTable(
        name = "rel_consultation__medicament",
        joinColumns = @JoinColumn(name = "consultation_id"),
        inverseJoinColumns = @JoinColumn(name = "medicament_id")
    )
    @JsonIgnoreProperties(value = { "consultations" }, allowSetters = true)
    private Set<Medicament> medicaments = new HashSet<>();

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

    public Set<Medecin> getMedecins() {
        return this.medecins;
    }

    public Consultation medecins(Set<Medecin> medecins) {
        this.setMedecins(medecins);
        return this;
    }

    public Consultation addMedecin(Medecin medecin) {
        this.medecins.add(medecin);
        medecin.setConsultation(this);
        return this;
    }

    public Consultation removeMedecin(Medecin medecin) {
        this.medecins.remove(medecin);
        medecin.setConsultation(null);
        return this;
    }

    public void setMedecins(Set<Medecin> medecins) {
        if (this.medecins != null) {
            this.medecins.forEach(i -> i.setConsultation(null));
        }
        if (medecins != null) {
            medecins.forEach(i -> i.setConsultation(this));
        }
        this.medecins = medecins;
    }

    public Set<Patient> getPatients() {
        return this.patients;
    }

    public Consultation patients(Set<Patient> patients) {
        this.setPatients(patients);
        return this;
    }

    public Consultation addPatient(Patient patient) {
        this.patients.add(patient);
        patient.setConsultation(this);
        return this;
    }

    public Consultation removePatient(Patient patient) {
        this.patients.remove(patient);
        patient.setConsultation(null);
        return this;
    }

    public void setPatients(Set<Patient> patients) {
        if (this.patients != null) {
            this.patients.forEach(i -> i.setConsultation(null));
        }
        if (patients != null) {
            patients.forEach(i -> i.setConsultation(this));
        }
        this.patients = patients;
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
