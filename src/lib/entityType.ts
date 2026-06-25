const ENTITY_TYPE_ALIASES: Record<string, string> = {
  'private limited': 'private_limited',
  'private limited company': 'private_limited',
  'public limited': 'public_limited',
  'public limited company': 'public_limited',
  llp: 'llp',
  'limited liability partnership': 'llp',
  partnership: 'partnership',
  'partnership firm': 'partnership',
  'sole proprietor': 'proprietorship',
  'sole proprietorship': 'proprietorship',
  proprietorship: 'proprietorship',
  'one person company (opc)': 'opc',
  'one person company': 'opc',
  opc: 'opc',
  trust: 'trust',
  society: 'society',
  ngo: 'ngo',
  'section 8 company': 'section_8',
  'government entity': 'government',
  other: 'other',
}

export const normalizeEntityType = (value?: string | null) => {
  const normalized = value?.trim().toLowerCase()
  if (!normalized) return ''
  return ENTITY_TYPE_ALIASES[normalized] || normalized.replace(/[\s-]+/g, '_')
}

export const formatEntityType = (value?: string | null) => {
  const normalized = normalizeEntityType(value)
  if (!normalized) return ''

  const labels: Record<string, string> = {
    private_limited: 'Private Limited Company',
    public_limited: 'Public Limited Company',
    llp: 'Limited Liability Partnership (LLP)',
    partnership: 'Partnership Firm',
    proprietorship: 'Sole Proprietorship',
    opc: 'One Person Company (OPC)',
    trust: 'Trust',
    society: 'Society',
    ngo: 'NGO',
    section_8: 'Section 8 Company',
    government: 'Government Entity',
    other: 'Other',
  }

  return labels[normalized] || value || ''
}
