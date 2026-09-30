"use client";
import {useMemo,useState} from "react";

const dyspnea=[
"No breathlessness except with strenuous exercise",
"Breathless when hurrying or walking up a slight hill",
"Walks slower than people of same age due to breathlessness or has to stop for breath when walking at own pace",
"Stops for breath after walking about 100 meters or after a few minutes",
"Too breathless to leave house or breathless when dressing"
];
const therapy={
A:{title:"Group A — Less symptomatic, low exacerbation risk",text:"A bronchodilator; a long-acting bronchodilator is preferred except with very occasional breathlessness."},
B:{title:"Group B — More symptomatic, low exacerbation risk",text:"Initial LABA + LAMA combination therapy is generally preferred."},
E:{title:"Group E — Exacerbation-prone",text:"Initial LABA + LAMA is generally preferred. Consider LABA + LAMA + ICS when blood eosinophils are high (for example ≥300 cells/µL) and after individual clinical assessment."}
};
export default function Home(){
 const [cat,setCat]=useState(10),[mmrc,setMmrc]=useState(1),[exac,setExac]=useState(0),[hosp,setHosp]=useState(false),[fev,setFev]=useState(70),[ratio,setRatio]=useState(0.65);
 const group=exac>=2||hosp?"E":(mmrc>=2||cat>=10?"B":"A");
 const grade=fev>=80?"GOLD 1":fev>=50?"GOLD 2":fev>=30?"GOLD 3":"GOLD 4";
 const confirmed=ratio<0.7;
 return <main>
  <header><div className="eyebrow">Clinical decision support</div><h1>COPD Assessment & Treatment</h1><p>Structured COPD assessment using symptoms, exacerbation history and post-bronchodilator spirometry.</p></header>
  <div className="grid">
   <section className="card"><h2>Patient assessment</h2>
    <label>CAT score <b>{cat}</b><input type="range" min="0" max="40" value={cat} onChange={e=>setCat(+e.target.value)}/></label>
    <label>mMRC dyspnea grade<select value={mmrc} onChange={e=>setMmrc(+e.target.value)}>{dyspnea.map((x,i)=><option value={i} key={x}>{i} — {x}</option>)}</select></label>
    <label>Moderate exacerbations in previous year<input type="number" min="0" max="20" value={exac} onChange={e=>setExac(+e.target.value)}/></label>
    <label className="check"><input type="checkbox" checked={hosp} onChange={e=>setHosp(e.target.checked)}/> ≥1 exacerbation requiring hospitalization</label>
    <label>Post-bronchodilator FEV1/FVC<input type="number" step=".01" min="0" max="1.5" value={ratio} onChange={e=>setRatio(+e.target.value)}/></label>
    <label>FEV1 % predicted<input type="number" min="1" max="150" value={fev} onChange={e=>setFev(+e.target.value)}/></label>
   </section>
   <section>
    <div className={"status "+(confirmed?"ok":"warn")}><span>{confirmed?"Airflow obstruction present":"COPD not confirmed by this value"}</span><strong>{confirmed?"Post-BD FEV1/FVC < 0.70":"Post-BD FEV1/FVC ≥ 0.70"}</strong></div>
    <div className="card result"><div className="pill">{group}</div><h2>{therapy[group].title}</h2><p>{therapy[group].text}</p><hr/><h3>Airflow limitation: {grade}</h3><p>FEV1 {fev}% predicted. GOLD spirometric grade should be interpreted after COPD is confirmed and alongside the full clinical picture.</p></div>
    <div className="card"><h3>Before final treatment</h3><p>Confirm diagnosis and phenotype, smoking/exposure status, inhaler technique and adherence, vaccination, pulmonary rehabilitation/activity, oxygen indication where relevant, comorbidities and exacerbation triggers. Treatment should be individualized by a clinician.</p></div>
   </section>
  </div>
  <footer>Clinical support tool • Not a substitute for clinician judgment • Do not enter identifiable patient information unless an appropriate secure backend is configured.</footer>
 </main>
}