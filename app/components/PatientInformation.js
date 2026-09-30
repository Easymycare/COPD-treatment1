"use client";

const COMORBIDITY_OPTIONS = [
  "Cardiovascular Disease",
  "Diabetes",
  "Asthma",
  "Hypertension",
  "Gastroesophageal Reflux",
  "Osteoporosis",
];

export default function PatientInformation({ patientData, setPatientData }) {
  function update(field, value) {
    setPatientData((prev) => ({ ...prev, [field]: value }));
  }

  function toggleComorbidity(item) {
    const current = patientData.comorbidities || [];
    const next = current.includes(item)
      ? current.filter((c) => c !== item)
      : [...current, item];
    update("comorbidities", next);
  }

  return (
    <section>
      <h2 className="section-header">Patient Information</h2>
      <div className="grid two">
        <div className="card">
          <label>Patient ID/MRN
            <input type="text" value={patientData.patient_id || ""} onChange={(e) => update("patient_id", e.target.value)} />
          </label>
          <label>Age
            <input type="number" min="18" max="120" value={patientData.age ?? 60} onChange={(e) => update("age", +e.target.value)} />
          </label>
          <label>Gender
            <select value={patientData.gender || "Male"} onChange={(e) => update("gender", e.target.value)}>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </label>
        </div>
        <div className="card">
          <label>Smoking Status
            <select value={patientData.smoking_status || "Current Smoker"} onChange={(e) => update("smoking_status", e.target.value)}>
              <option>Current Smoker</option>
              <option>Former Smoker</option>
              <option>Never Smoked</option>
            </select>
          </label>
          <label>Pack Years (if applicable)
            <input type="number" min="0" max="200" value={patientData.pack_years ?? 0} onChange={(e) => update("pack_years", +e.target.value)} />
          </label>
          <label>BMI
            <input type="number" step="0.1" min="10" max="50" value={patientData.bmi ?? 25} onChange={(e) => update("bmi", +e.target.value)} />
          </label>
        </div>
      </div>

      <h3>Medical History</h3>
      <div className="card">
        <label>Comorbidities</label>
        <div className="chip-group">
          {COMORBIDITY_OPTIONS.map((item) => (
            <label key={item} className="check">
              <input
                type="checkbox"
                checked={(patientData.comorbidities || []).includes(item)}
                onChange={() => toggleComorbidity(item)}
              />
              {item}
            </label>
          ))}
        </div>
        <label>Current Medications
          <textarea
            placeholder="List current medications..."
            value={patientData.current_medications || ""}
            onChange={(e) => update("current_medications", e.target.value)}
          />
        </label>
      </div>
      <div className="status ok"><span>Patient information is saved automatically as you type.</span></div>
    </section>
  );
}
