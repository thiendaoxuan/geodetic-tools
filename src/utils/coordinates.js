function toFixedPrecision(value, decimals) {
  return Number(value).toFixed(decimals)
}

function formatDMS(value, isLat) {
  const abs = Math.abs(value)
  const deg = Math.floor(abs)
  const minFloat = (abs - deg) * 60
  const min = Math.floor(minFloat)
  const sec = ((minFloat - min) * 60).toFixed(1)

  let hemi
  if (isLat) {
    hemi = value >= 0 ? 'N' : 'S'
  } else {
    hemi = value >= 0 ? 'E' : 'W'
  }

  return `${deg}°${String(min).padStart(2, '0')}′${String(sec).padStart(4, '0')}″${hemi}`
}

export function toDD(lat, lon) {
  return {
    lat: toFixedPrecision(lat, 5),
    lon: toFixedPrecision(lon, 5),
  }
}

export function toISODMS(lat, lon) {
  return {
    lat: formatDMS(lat, true),
    lon: formatDMS(lon, false),
  }
}

function daysSinceJ2000(date) {
  const JD = date.getTime() / 86400000 + 2440587.5
  return JD - 2451545.0
}

function gmstHours(date) {
  const D = daysSinceJ2000(date)
  let gmst = (18.697374558 + 24.06570982441908 * D) % 24
  if (gmst < 0) gmst += 24
  return gmst
}

function formatRA(raHours) {
  const h = Math.floor(raHours)
  const mFloat = (raHours - h) * 60
  const m = Math.floor(mFloat)
  const s = ((mFloat - m) * 60).toFixed(1)
  return `${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(4, '0')}s`
}

export function toICRS(lat, lon, date) {
  const gmst = gmstHours(date)
  const ra = ((gmst + lon / 15) % 24 + 24) % 24
  const decSign = lat >= 0 ? '+' : '−'
  const dec = formatDMS(lat, true).replace(/[NS]$/, '')
  return {
    ra: formatRA(ra),
    dec: `${decSign}${dec}`,
  }
}
