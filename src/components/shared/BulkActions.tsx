import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Trash2, ToggleLeft, ToggleRight, Star, StarOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BulkAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'destructive';
}

interface BulkActionsProps {
  selectedCount: number;
  actions: BulkAction[];
  className?: string;
}

export function BulkActions({ selectedCount, actions, className }: BulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className={cn("flex items-center gap-4 p-4 bg-primary/5 rounded-lg border border-primary/20", className)}>
      <span className="text-sm font-medium text-foreground">
        {selectedCount} {selectedCount === 1 ? 'elemento seleccionado' : 'elementos seleccionados'}
      </span>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            Acciones masivas
            <ChevronDown size={16} className="ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48 bg-popover">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actions.map((action, index) => (
            <DropdownMenuItem
              key={index}
              onClick={action.onClick}
              className={cn(
                "cursor-pointer",
                action.variant === 'destructive' && "text-destructive focus:text-destructive"
              )}
            >
              {action.icon}
              <span className="ml-2">{action.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// Pre-built bulk action icons for convenience
export const bulkActionIcons = {
  activate: <ToggleRight size={16} />,
  deactivate: <ToggleLeft size={16} />,
  delete: <Trash2 size={16} />,
  feature: <Star size={16} />,
  unfeature: <StarOff size={16} />,
};
