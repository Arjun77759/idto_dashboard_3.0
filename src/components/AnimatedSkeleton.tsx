import { cn } from '@/lib/utils'

type AnimatedSkeletonProps = React.HTMLAttributes<HTMLDivElement>

const AnimatedSkeleton = ({ className, ...props }: AnimatedSkeletonProps) => (
  <div
    className={cn(
      'relative overflow-hidden rounded-xl bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200',
      'animate-pulse',
      className
    )}
    {...props}
  />
)

export default AnimatedSkeleton

