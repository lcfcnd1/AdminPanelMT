import { useState, useEffect } from 'react';
import { Coupon } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface CouponFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupon?: Coupon | null;
  onSave: (coupon: Partial<Coupon>) => void;
}

export function CouponForm({ open, onOpenChange, coupon, onSave }: CouponFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountPercentage: 0,
    expirationDate: '',
    isActive: true,
  });

  useEffect(() => {
    if (coupon) {
      setFormData({
        code: coupon.code,
        discountPercentage: coupon.discountPercentage,
        expirationDate: coupon.expirationDate,
        isActive: coupon.isActive,
      });
    } else {
      setFormData({
        code: '',
        discountPercentage: 0,
        expirationDate: '',
        isActive: true,
      });
    }
  }, [coupon, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    onSave(formData);
    setIsLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card">
        <DialogHeader>
          <DialogTitle>{coupon ? 'Editar Cupón' : 'Nuevo Cupón'}</DialogTitle>
          <DialogDescription>
            {coupon ? 'Modifica los datos del cupón' : 'Completa los datos para crear un nuevo cupón'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Código *</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="CODIGO10"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount">Porcentaje de Descuento *</Label>
            <Input
              id="discount"
              type="number"
              min="1"
              max="100"
              value={formData.discountPercentage}
              onChange={(e) => setFormData({ ...formData, discountPercentage: parseInt(e.target.value) || 0 })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiration">Fecha de Expiración *</Label>
            <Input
              id="expiration"
              type="date"
              value={formData.expirationDate}
              onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
              required
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="active">Cupón Activo</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : coupon ? (
                'Guardar Cambios'
              ) : (
                'Crear Cupón'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
