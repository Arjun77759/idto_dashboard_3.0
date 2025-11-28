import clsx from 'clsx'

const STATUS_STYLES: Record<
  string,
  {
    bg: string
    text: string
  }
> = {
  paid: { bg: '#E8FBEA', text: '#167A1E' },
  success: { bg: '#E8FBEA', text: '#167A1E' },
  pending: { bg: '#FFF6E6', text: '#A35E00' },
  error: { bg: '#FEECEC', text: '#B42318' },
  failed: { bg: '#FEECEC', text: '#B42318' },
  unpaid: { bg: '#FEECEC', text: '#B42318' }
}

interface StatusBadgeProps {
  status?: string
  className?: string
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const normalized = status?.toLowerCase() ?? ''
  const styles = STATUS_STYLES[normalized] ?? { bg: '#F2F4F7', text: '#344054' }

  return (
    <span
      className={clsx(
        'inline-flex min-w-[88px] items-center justify-center rounded-full px-2 py-1 text-[12px] font-medium capitalize',
        className
      )}
      style={{
        backgroundColor: styles.bg,
        color: styles.text
      }}
    >
      {status ?? '-'}
    </span>
  )
}


