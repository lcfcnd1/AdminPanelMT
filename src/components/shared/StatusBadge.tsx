import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled' | 'processing';
  className?: string;
}

const statusConfig = {
  active: {
    label: 'Activo',
    className: 'bg-success/10 text-success border-success/20',
  },
  inactive: {
    label: 'Inactivo',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
  pending: {
    label: 'Pendiente',
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  completed: {
    label: 'Completado',
    className: 'bg-success/10 text-success border-success/20',
  },
  cancelled: {
    label: 'Cancelado',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
  processing: {
    label: 'Procesando',
    className: 'bg-primary/10 text-primary border-primary/20',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
