/**
 * ConfigField
 * A single labeled input row used on the Configure page.
 *
 * Props:
 *   label       - display label
 *   description - small helper text below the input
 *   name        - field key (matches config object)
 *   value       - current value
 *   onChange    - (name, value) => void
 *   type        - 'number' | 'toggle'
 *   min / max / step - for number inputs
 *   prefix      - optional prefix symbol (e.g. '₹')
 */
export default function ConfigField({
  label, description, name, value, onChange,
  type = 'number', min, max, step = 'any', prefix
}) {
  if (type === 'toggle') {
    return (
      <div className="flex items-start justify-between gap-4 py-3 border-b border-border/50 last:border-0">
        <div className="flex-1 min-w-0">
          <p className="font-mono text-xs text-text tracking-wide">{label}</p>
          {description && <p className="text-xs text-dim mt-0.5 font-body">{description}</p>}
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={value}
          onClick={() => onChange(name, !value)}
          className={`relative shrink-0 w-10 h-5 rounded-full transition-all duration-200 border ${
            value
              ? 'bg-accentDim border-accent/40'
              : 'bg-muted border-border'
          }`}
        >
          <span className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200 ${
            value ? 'left-5 bg-accent' : 'left-0.5 bg-dim'
          }`} />
        </button>
      </div>
    )
  }

  return (
    <div className="py-3 border-b border-border/50 last:border-0">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-mono text-xs text-text tracking-wide">{label}</p>
          {description && <p className="text-xs text-dim mt-0.5 font-body">{description}</p>}
        </div>
        <div className="relative shrink-0">
          {prefix && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-dim pointer-events-none">
              {prefix}
            </span>
          )}
          <input
            type="number"
            name={name}
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={e => onChange(name, type === 'number' ? parseFloat(e.target.value) : e.target.value)}
            className={`w-44 bg-bg border border-border rounded px-3 py-1.5 font-mono text-xs text-text
              focus:outline-none focus:border-accent focus:shadow-glowSm transition-all
              ${prefix ? 'pl-6' : ''}
            `}
          />
        </div>
      </div>
    </div>
  )
}
