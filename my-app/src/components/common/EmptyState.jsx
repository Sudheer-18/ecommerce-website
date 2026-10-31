export function EmptyState({ title, message, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{message}</p>
      {onAction && actionLabel ? (
        <button type="button" className="primary-btn" onClick={onAction}>{actionLabel}</button>
      ) : null}
    </div>
  )
}
