"use client";

import { CAT_ITEMS, DYSPNEA_SCALE, calculateCATScore, classifySpirometry } from "../lib/copd";

const CXR_OPTIONS = [
  "Hyperinflation",
  "Flattened diaphragm",
  "Bullae",
  "Increased retrosternal airspace",
  "Narrow cardiac silhouette",
  "Bronchial wall thickening",
  "No significant findings",
];

export default function ClinicalAssessment({ assessment, setAssessment, onComplete }) {
  function update(field, value) {
    setAssessment((prev) => ({ ...prev, [field]: value }));
  }

  function updateCat(key, value) {
    setAssessment((prev) => ({ ...prev, cat_responses: { ...prev.cat_responses, [key]: value } }));
  }

  function toggleCxr(item) {
    const current = assessment.cxr_findings || [];
    const next = current.includes(item) ? current.filter((c) => c !== item) : [...current, item];
    update("cxr_findings", next);
  }

  const mMRCScore = assessment.dyspnea_index ?? 0;
  const catScore = calculateCATScore(assessment.cat_responses || {});
  const fev1Predicted = assessment.fev1_predicted ?? 3.0;
  const fev1Actual = assessment.fev1_actual ?? 2.0;
  const fev1Percent = fev1Predicted > 0 ? (fev1Actual / fev1Predicted) * 100 : 0;
  const { stage, severity } = classifySpirometry(fev1Percent);

  function handleComplete() {
    onComplete({
      mMRC_score: mMRCScore,
      CAT_score: catScore,
      exacerbations: assessment.exacerbations ?? 0,
      hospitalization: !!assessment.hospitalization,
      fev1_percent: fev1Predicted > 0 ? fev1Percent : null,
      fev1_fvc: assessment.fev1_fvc ?? 0.65,
      gold_stage: fev1Predicted > 0 ? stage : null,
      eosinophils: assessment.eosinophils ?? 150,
      cxr_findings: assessment.cxr_findings || [],
      cxr_notes: assessment.cxr_notes || "",
      other_labs: assessment.other_labs || "",
    });
  }

  return (
    <section>
      <h2 className="section-header">Clinical Assessment</h2>

      <div className="card">
        <h3>1. Dyspnea Assessment (mMRC Scale)</h3>
        <label>Select the statement that best describes breathlessness:
          <select value={mMRCScore} onChange={(e) => update("dyspnea_index", +e.target.value)}>
            {DYSPNEA_SCALE.map((text, i) => (
              <option value={i} key={text}>{i} — {text}</option>
            ))}
          </select>
        </label>
        <div className="status ok"><span>mMRC Score: <strong>{mMRCScore}</strong></span></div>
      </div>

      <div className="card">
        <h3>2. COPD Assessment Test (CAT)</h3>
        <p>Rate each item from 0 (best) to 5 (worst):</p>
        <div className="grid two">
          {CAT_ITEMS.map((item) => (
            <label key={item.key} title={item.help}>
              {item.label} <b>{(assessment.cat_responses || {})[item.key] ?? 0}</b>
              <input
                type="range"
                min="0"
                max="5"
                value={(assessment.cat_responses || {})[item.key] ?? 0}
                onChange={(e) => updateCat(item.key, +e.target.value)}
              />
            </label>
          ))}
        </div>
        <div className="status ok"><span>CAT Score: <strong>{catScore}</strong> (0-9: Low, 10-20: Medium, 21-30: High, 31-40: Very High)</span></div>
      </div>

      <div className="card">
        <h3>3. Exacerbation History</h3>
        <div className="grid two">
          <label>Number of exacerbations in past year requiring antibiotics/steroids:
            <input type="number" min="0" max="20" value={assessment.exacerbations ?? 0} onChange={(e) => update("exacerbations", +e.target.value)} />
          </label>
          <label className="check">
            <input type="checkbox" checked={!!assessment.hospitalization} onChange={(e) => update("hospitalization", e.target.checked)} />
            Any hospitalization for COPD exacerbation in past year?
          </label>
        </div>
      </div>

      <div className="card">
        <h3>4. Spirometry Results</h3>
        <div className="grid three">
          <label>FEV1 (Liters)
            <input type="number" min="0" max="10" step="0.1" value={fev1Actual} onChange={(e) => update("fev1_actual", +e.target.value)} />
          </label>
          <label>FEV1 Predicted (Liters)
            <input type="number" min="0" max="10" step="0.1" value={fev1Predicted} onChange={(e) => update("fev1_predicted", +e.target.value)} />
          </label>
          <label>FEV1/FVC Ratio
            <input type="number" min="0" max="1" step="0.01" value={assessment.fev1_fvc ?? 0.65} onChange={(e) => update("fev1_fvc", +e.target.value)} />
          </label>
        </div>
        {fev1Predicted > 0 && (
          <div className="status ok"><span>FEV1: <strong>{fev1Percent.toFixed(1)}% predicted | {stage} ({severity})</strong></span></div>
        )}
      </div>

      <div className="card">
        <h3>5. Laboratory Results</h3>
        <div className="grid two">
          <label>Blood Eosinophils (cells/μL)
            <input type="number" min="0" max="2000" value={assessment.eosinophils ?? 150} onChange={(e) => update("eosinophils", +e.target.value)} />
          </label>
          <label>Other Lab Results
            <textarea placeholder="Hemoglobin, Alpha-1 antitrypsin, etc." value={assessment.other_labs || ""} onChange={(e) => update("other_labs", e.target.value)} />
          </label>
        </div>
        <p className="caption">Reference: &lt;100 (low), 100-300 (intermediate), ≥300 (high)</p>
      </div>

      <div className="card">
        <h3>6. Chest X-ray Findings</h3>
        <div className="chip-group">
          {CXR_OPTIONS.map((item) => (
            <label key={item} className="check">
              <input type="checkbox" checked={(assessment.cxr_findings || []).includes(item)} onChange={() => toggleCxr(item)} />
              {item}
            </label>
          ))}
        </div>
        <label>Additional CXR Notes
          <textarea value={assessment.cxr_notes || ""} onChange={(e) => update("cxr_notes", e.target.value)} />
        </label>
      </div>

      <button className="primary" onClick={handleComplete}>Complete Assessment</button>
    </section>
  );
}
