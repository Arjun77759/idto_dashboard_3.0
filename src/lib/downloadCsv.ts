type CsvValue = string | number | boolean | null | undefined

const escapeValue = (value: CsvValue) => {
  if (value === null || value === undefined) return ''
  const stringValue = String(value).replace(/"/g, '""')
  return /[",\n]/.test(stringValue) ? `"${stringValue}"` : stringValue
}

interface DownloadCsvOptions {
  headers: string[]
  rows: CsvValue[][]
  filename?: string
}

export const downloadCsv = ({ headers, rows, filename = 'resp' }: DownloadCsvOptions) => {
  const csvContent = [headers, ...rows]
    .map((row) => row.map(escapeValue).join(','))
    .join('\r\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `${filename}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}


