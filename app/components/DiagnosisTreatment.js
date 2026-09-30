"use client";

import { GROUPS_SUMMARY, RESCUE_THERAPY, buildConsiderations, determineGOLDGroup } from "../lib/copd";

export default function DiagnosisTreatment({ patientData, assessmentComplete, onSaveReport }) {
  if (!assessmentComplete) {
    return (
      <section>
        <h2 className="section-header">Diagnosis & Treatment Recommendations</h2>
        <div className="status warn"><span>⚠️ Please complete the Clinical Assessment first.</span></div>
      </section>
    );
  }

  const data = patientData;
  const goldGroup = determineGOLDGroup(
    data.mMRC_score || 0,
    data.CAT_score || 0,
    data.exacerbations || 0,
    !!data.hospitalization
  );
  const groupInfo = GROUPS_SUMMARY[goldGroup];
  const considerations = buildConsiderations(goldGroup, data);

  return (
    <section>
      <h2 className="section-header">Diagnosis & Treatment Recommendations</h2>

      <h3>Diagnosis Summary</h3>
      <div className="grid three">
        <div className="card metric">
          <div className="pill">{goldGroup}</div>
          <p className="caption">{groupInfo.name}</p>
        </div>
        <div className="card metric">
          <strong>{data.gold_stage || "N/A"}</strong>
          <p className="caption">FEV1: {(data.fev1_percent ?? 0).toFixed ? data.fev1_percent.toFixed(1) : data.fev1_percent}%</p>
        </div>
        <div className="card metric">
          <strong>{(data.CAT_score || 0) >= 10 ? "High" : "Low"}</strong>
          <p className="caption">CAT: {data.CAT_score || 0}, mMRC: {data.mMRC_score || 0}</p>
        </div>
      </div>

      <h3>Treatment Recommendations</h3>
      <div className="success-box">
        <strong>Primary Treatment Strategy:</strong> {groupInfo.treatment}
      </div>

      <h4>Recommended Medications</h4>
      <ol>
        {groupInfo.medications.map((med) => <li key={med}>{med}</li>)}
      </ol>

      {considerations.length > 0 && (
        <>
          <h4>Special Considerations</h4>
          <ul className="considerations">
            {considerations.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </>
      )}

      <h4>Rescue Therapy (All Patients)</h4>
      <div className="info-box">
        <p><strong>All patients should have a short-acting bronchodilator for symptom relief:</strong></p>
        <ul>
          {RESCUE_THERAPY.map((r) => <li key={r}>{r}</li>)}
        </ul>
      </div>

      <h3>Non-Pharmacologic Management</h3>
      <div className="grid two">
        <div className="card">
          <h4>Essential Interventions</h4>
          <p>✅ Smoking cessation (if applicable)</p>
          <p>✅ Pulmonary rehabilitation</p>
          <p>✅ Influenza vaccination (annual)</p>
          <p>✅ Pneumococcal vaccination</p>
          <p>✅ COVID-19 vaccination</p>
        </div>
        <div className="card">
          <h4>Additional Recommendations</h4>
          <p>• Regular exercise as tolerated</p>
          <p>• Nutritional optimization</p>
          <p>• Oxygen therapy if hypoxemic</p>
          <p>• Education on inhaler technique</p>
          <p>• Self-management education</p>
        </div>
      </div>

      <h3>Follow-up Plan</h3>
      <div className="warning-box">
        <p><strong>Recommended Follow-up:</strong></p>
        <p>- Initial follow-up: 2-4 weeks after starting new therapy</p>
        <p>- Routine follow-up: Every 3-6 months for stable patients</p>
        <p>- Monitor for: Symptom control, exacerbation frequency, side effects</p>
        <p>- Adjust therapy based on response (see GOLD guidelines)</p>
      </div>

      <button
        className="primary"
        onClick={() => onSaveReport({ goldGroup, groupInfo, considerations })}
      >
        💾 Save Assessment Report
      </button>
    </section>
  );
}
