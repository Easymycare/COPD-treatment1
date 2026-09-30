"use client";

import { useState } from "react";
import PatientInformation from "./components/PatientInformation";
import ClinicalAssessment from "./components/ClinicalAssessment";
import DiagnosisTreatment from "./components/DiagnosisTreatment";
import KnowledgeBase from "./components/KnowledgeBase";

const SECTIONS = ["Patient Information", "Clinical Assessment", "Diagnosis & Treatment", "Knowledge Base"];

export default function Home() {
  const [section, setSection] = useState(SECTIONS[0]);
  const [patientInfo, setPatientInfo] = useState({});
  const [assessment, setAssessment] = useState({});
  const [patientData, setPatientData] = useState({});
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [reportUrl, setReportUrl] = useState(null);

  function handleAssessmentComplete(results) {
    setPatientData((prev) => ({ ...prev, ...patientInfo, ...results }));
    setAssessmentComplete(true);
    setSection("Diagnosis & Treatment");
  }

  function handleSaveReport({ goldGroup, groupInfo, considerations }) {
    const report = {
      assessment_date: new Date().toISOString(),
      patient_data: patientData,
      diagnosis: {
        GOLD_group: goldGroup,
        group_description: groupInfo.name,
        treatment_strategy: groupInfo.treatment,
      },
      recommendations: {
        medications: groupInfo.medications,
        special_considerations: considerations,
      },
    };
    const blob = new Blob([JSON.stringify(report, null, 4)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    setReportUrl(url);
    const a = document.createElement("a");
    a.href = url;
    a.download = `COPD_Assessment_${patientData.patient_id || "unknown"}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <main>
      <header>
        <div className="eyebrow">Clinical decision support</div>
        <h1>🫁 COPD Assessment &amp; Treatment System</h1>
        <p>Structured COPD assessment using symptoms, exacerbation history and post-bronchodilator spirometry, based on GOLD 2026 guidelines.</p>
      </header>

      <nav className="nav">
        {SECTIONS.map((s) => (
          <button
            key={s}
            className={"nav-item" + (section === s ? " active" : "")}
            onClick={() => setSection(s)}
          >
            {s}
          </button>
        ))}
      </nav>

      <div className="content">
        {section === "Patient Information" && (
          <PatientInformation patientData={patientInfo} setPatientData={setPatientInfo} />
        )}
        {section === "Clinical Assessment" && (
          <ClinicalAssessment
            assessment={assessment}
            setAssessment={setAssessment}
            onComplete={handleAssessmentComplete}
          />
        )}
        {section === "Diagnosis & Treatment" && (
          <DiagnosisTreatment
            patientData={patientData}
            assessmentComplete={assessmentComplete}
            onSaveReport={handleSaveReport}
          />
        )}
        {section === "Knowledge Base" && <KnowledgeBase />}
      </div>

      <footer>Clinical support tool • Not a substitute for clinician judgment • Do not enter identifiable patient information unless an appropriate secure backend is configured.</footer>
    </main>
  );
}
