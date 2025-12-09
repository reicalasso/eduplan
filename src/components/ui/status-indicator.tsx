import { cn } from '@/lib/utils';

type Status = 'online' | 'offline' | 'busy' | 'away' | 'success' | 'warning' | 'error' | 'info';

interface StatusIndicatorProps {
  status: Status;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  className?: string;
}

const statusColors: Record<Status, string> = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  busy: 'bg-red-500',
  away: 'bg-yellow-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
};

const statusLabels: Record<Status, string> = {
  online: 'Çevrimiçi',
  offline: 'Çevrimdışı',
  busy: 'Meşgul',
  away: 'Uzakta',
  success: 'Başarılı',
  warning: 'Uyarı',
  error: 'Hata',
  info: 'Bilgi',
};

const sizeClasses = {
  sm: 'h-2 w-2',
  md: 'h-3 w-3',
  lg: 'h-4 w-4',
};

export function StatusIndicator({
  status,
  label,
  size = 'md',
  pulse = false,
  className,
}: StatusIndicatorProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="relative flex">
        <span
          className={cn(
            'rounded-full',
            statusColors[status],
            sizeClasses[size]
          )}
        />
        {pulse && (
          <span
            className={cn(
              'absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping',
              statusColors[status]
            )}
          />
        )}
      </span>
      {label !== undefined && (
        <span className="text-sm">{label || statusLabels[status]}</span>
      )}
    </div>
  );
}

interface StatusBadgeProps {
  status: Status;
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const bgColors: Record<Status, string> = {
    online: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    offline: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    busy: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    away: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
        bgColors[status],
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', statusColors[status])} />
      {label || statusLabels[status]}
    </span>
  );
}
