import CopyButton from './CopyButton'

export default function CoordinateRow({ label, standard, note, fields, compact }) {
  return (
    <div className="coord-row">
      <div className="coord-header">
        <span className="coord-label">{label}</span>
        {!compact && <span className="coord-standard">{standard}</span>}
      </div>
      <div className="coord-fields">
        {fields.map((field, i) => (
          <div className="coord-field" key={i}>
            <span className="field-label">{field.label}</span>
            <code className="field-value">{field.value}</code>
            <CopyButton value={field.value} />
          </div>
        ))}
      </div>
      {!compact && <span className="coord-note">{note}</span>}
    </div>
  )
}
