function StatCard({ title, value, description }) {
  return (
    <article className="stats-card">
      <span className="pill">{title}</span>
      <strong>{value}</strong>
      <p className="muted-text">{description}</p>
    </article>
  )
}

export default StatCard
