function StatCard({ title, value, description, Icon }) {
  return (
    <article className="stats-card">
      <div className="stats-card-top">
        <span className="pill pill-soft">{title}</span>
        {Icon ? (
          <div className="icon-chip">
            <Icon size={18} />
          </div>
        ) : null}
      </div>
      <strong>{value}</strong>
      {description ? <p className="muted-text">{description}</p> : null}
    </article>
  )
}

export default StatCard
