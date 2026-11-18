export default function KpiCard({ label, value, hint, icon: Icon }) {
  return (
    <article className="kpi-card">
      <div className="kpi-top"><span>{label}</span><span className="kpi-icon"><Icon size={18} /></span></div>
      <strong>{value}</strong>
      <small>{hint}</small>
    </article>
  );
}
