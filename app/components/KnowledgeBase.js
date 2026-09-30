"use client";

import { useState } from "react";
import guidelines from "../data/guidelines.json";
import medications from "../data/medications.json";

const TABS = ["GOLD Groups", "Medications", "Spirometry", "Guidelines"];

function MedicationTable({ title, items, columns }) {
  return (
    <div className="card">
      <h4>{title}</h4>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>{columns.map((c) => <th key={c.key}>{c.label}</th>)}</tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={item.name || i}>
                {columns.map((c) => <td key={c.key}>{c.render ? c.render(item) : item[c.key]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function KnowledgeBase() {
  const [tab, setTab] = useState(TABS[0]);
  const groups = guidelines.classification_system.groups;

  return (
    <section>
      <h2 className="section-header">COPD Knowledge Base ({guidelines.version})</h2>

      <div className="tabs">
        {TABS.map((t) => (
          <button key={t} className={"tab" + (tab === t ? " active" : "")} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      {tab === "GOLD Groups" && (
        <div>
          <h3>GOLD ABE Classification System</h3>
          <p className="caption">{guidelines.classification_system.description}</p>
          {Object.entries(groups).map(([key, group]) => (
            <details className="card" key={key} open>
              <summary><strong>Group {key}: {group.name}</strong></summary>
              <p><strong>Treatment strategy:</strong> {group.treatment_strategy}</p>
              {group.first_line?.map((line) => (
                <div key={line.class}>
                  <p><strong>{line.class}</strong> — {line.rationale}</p>
                  <ul>{line.options.map((o) => <li key={o}>{o}</li>)}</ul>
                </div>
              ))}
              {group.alternative && (
                <>
                  <p><strong>Alternative:</strong></p>
                  <ul>{group.alternative.map((o) => <li key={o}>{o}</li>)}</ul>
                </>
              )}
              {group.eosinophil_guided_therapy && (
                <>
                  <p><strong>Eosinophil-guided therapy:</strong></p>
                  <ul>
                    {Object.entries(group.eosinophil_guided_therapy).map(([k, v]) => (
                      <li key={k}><strong>{v.threshold}:</strong> {v.recommendation} ({v.rationale})</li>
                    ))}
                  </ul>
                </>
              )}
              {group.special_considerations && (
                <>
                  <p><strong>Special considerations:</strong></p>
                  <ul>
                    {group.special_considerations.map((sc) => (
                      <li key={sc.condition}><strong>{sc.condition}:</strong> {sc.recommendation}</li>
                    ))}
                  </ul>
                </>
              )}
            </details>
          ))}
        </div>
      )}

      {tab === "Medications" && (
        <div>
          <h3>Medication Classes</h3>
          <MedicationTable
            title="Long-Acting Beta-Agonists (LABA)"
            items={medications.medication_classes.LABA.medications}
            columns={[
              { key: "name", label: "Medication" },
              { key: "dose", label: "Dosing" },
              { key: "onset", label: "Onset" },
              { key: "duration", label: "Duration" },
            ]}
          />
          <MedicationTable
            title="Long-Acting Muscarinic Antagonists (LAMA)"
            items={medications.medication_classes.LAMA.medications}
            columns={[
              { key: "name", label: "Medication" },
              { key: "dose", label: "Dosing" },
              { key: "device", label: "Device" },
              { key: "special_notes", label: "Notes" },
            ]}
          />
          <MedicationTable
            title="LAMA-LABA Combinations"
            items={medications.medication_classes.LAMA_LABA_combinations.medications}
            columns={[
              { key: "name", label: "Medication" },
              { key: "components", label: "Components" },
              { key: "frequency", label: "Frequency" },
              { key: "device", label: "Device" },
            ]}
          />
          <MedicationTable
            title="Triple Therapy (LAMA-LABA-ICS)"
            items={medications.medication_classes.triple_therapy.medications}
            columns={[
              { key: "name", label: "Medication" },
              { key: "components", label: "Components" },
              { key: "frequency", label: "Frequency" },
              { key: "device", label: "Device" },
            ]}
          />
          <MedicationTable
            title="Rescue Therapy (SABA / SAMA)"
            items={[
              ...medications.medication_classes.SABA.medications,
              ...medications.medication_classes.SAMA.medications,
              ...medications.medication_classes.SABA_SAMA_combinations.medications,
            ]}
            columns={[
              { key: "name", label: "Medication" },
              { key: "dose", label: "Dose" },
              { key: "frequency", label: "Frequency" },
              { key: "device", label: "Device" },
            ]}
          />
        </div>
      )}

      {tab === "Spirometry" && (
        <div className="card">
          <h3>Spirometry Classification</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>GOLD Stage</th><th>Severity</th><th>FEV1 % Predicted</th><th>Notes</th></tr></thead>
              <tbody>
                {Object.entries(guidelines.spirometry_classification).map(([stage, info]) => (
                  <tr key={stage}>
                    <td>{stage.replace("_", " ")}</td>
                    <td>{info.severity}</td>
                    <td>{info.FEV1_percent_predicted}</td>
                    <td>{info.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="status ok"><span>FEV1/FVC &lt; 0.70 confirms airflow obstruction (COPD diagnosis)</span></div>
        </div>
      )}

      {tab === "Guidelines" && (
        <div>
          <div className="card">
            <h4>Assessment Tools</h4>
            <p>• <strong>mMRC Dyspnea Scale:</strong> 0-4 (≥2 indicates more symptomatic)</p>
            <p>• <strong>CAT Score:</strong> 0-40 (&lt;10 low impact, ≥10 high impact)</p>
            <p>• <strong>Exacerbation History:</strong> ≥1 in past year indicates high risk</p>
          </div>

          <div className="card">
            <h4>Treatment Principles</h4>
            <ol>
              <li>All patients receive rescue bronchodilator (SABA ± SAMA)</li>
              <li>Regular therapy based on GOLD group (A, B, or E)</li>
              <li>Consider eosinophils for ICS decisions in Group E</li>
              <li>Prefer single-inhaler combinations for adherence</li>
              <li>Always combine with non-pharmacologic management</li>
            </ol>
          </div>

          <div className="card">
            <h4>Eosinophil-Guided Therapy</h4>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Eosinophil Count</th><th>ICS Benefit</th><th>Risk</th></tr></thead>
                <tbody>
                  <tr><td>&lt;100 cells/μL</td><td>Minimal</td><td>Higher pneumonia risk</td></tr>
                  <tr><td>100-300 cells/μL</td><td>Moderate</td><td>Intermediate</td></tr>
                  <tr><td>≥300 cells/μL</td><td>High</td><td>Consider triple therapy</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h4>Non-Pharmacologic Management</h4>
            {guidelines.non_pharmacologic_management.essential_interventions.map((item) => (
              <p key={item.intervention}>
                <strong>{item.intervention}</strong> ({item.priority}) — {item.notes || (item.vaccines || []).join(", ")}
              </p>
            ))}
          </div>

          <div className="warning-box">
            <p><strong>Refer for specialist evaluation if:</strong></p>
            <ul>
              {guidelines.referral_criteria.pulmonology.map((r) => <li key={r}>{r}</li>)}
            </ul>
          </div>

          <div className="card">
            <h4>References</h4>
            <p>- Global Initiative for Chronic Obstructive Lung Disease (GOLD) 2026 Report</p>
            <p>- UpToDate: Stable COPD - Initial Pharmacologic Management</p>
            <p>- Last updated: {guidelines.last_updated}</p>
          </div>
        </div>
      )}
    </section>
  );
}
