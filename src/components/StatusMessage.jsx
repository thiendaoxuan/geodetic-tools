export default function StatusMessage({ type, text, onRetry }) {
  return (
    <div className={type === 'error' ? 'status status-error' : 'status status-loading'}>
      <p>{text}</p>
      {type === 'error' && onRetry && (
        <button className="btn-retry" onClick={onRetry}>Retry</button>
      )}
    </div>
  )
}
