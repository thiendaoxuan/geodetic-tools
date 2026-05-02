export default function LocationButton({ onClick, loading }) {
  return (
    <button
      className="btn-locate"
      onClick={onClick}
      disabled={loading}
    >
      {loading ? 'Locating...' : 'Get My Location'}
    </button>
  )
}
