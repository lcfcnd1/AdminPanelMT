import { useState } from 'react';
import { useDataStore } from '@/store/dataStore';
import { Coupon } from '@/types';
import { DataTable } from '@/components/shared/DataTable';
import { BulkActions, bulkActionIcons } from '@/components/shared/BulkActions';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { CouponForm } from '@/components/coupons/CouponForm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Coupons() {
  const { toast } = useToast();
  const { coupons, addCoupon, updateCoupon, deleteCoupon, deleteCoupons, bulkUpdateCoupons } = useDataStore();
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<string | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  const columns = [
    {
      key: 'code',
      label: 'Código',
      render: (coupon: Coupon) => (
        <Badge variant="outline" className="font-mono text-sm">
          {coupon.code}
        </Badge>
      ),
    },
    {
      key: 'discountPercentage',
      label: 'Descuento',
      render: (coupon: Coupon) => (
        <span className="font-semibold text-success">{coupon.discountPercentage}%</span>
      ),
    },
    {
      key: 'expirationDate',
      label: 'Expira',
      render: (coupon: Coupon) => {
        const isExpired = new Date(coupon.expirationDate) < new Date();
        return (
          <span className={isExpired ? 'text-destructive' : 'text-muted-foreground'}>
            {coupon.expirationDate}
          </span>
        );
      },
    },
    {
      key: 'isActive',
      label: 'Estado',
      render: (coupon: Coupon) => (
        <StatusBadge status={coupon.isActive ? 'active' : 'inactive'} />
      ),
    },
    {
      key: 'actions',
      label: '',
      className: 'w-24',
      render: (coupon: Coupon) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setEditingCoupon(coupon);
              setIsFormOpen(true);
            }}
          >
            <Pencil size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setCouponToDelete(coupon.id);
              setDeleteDialogOpen(true);
            }}
          >
            <Trash2 size={16} className="text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  const handleSaveCoupon = (couponData: Partial<Coupon>) => {
    if (editingCoupon) {
      updateCoupon(editingCoupon.id, couponData);
      toast({ title: 'Cupón actualizado', description: 'Los cambios se guardaron correctamente.' });
    } else {
      const newCoupon: Coupon = {
        id: Date.now().toString(),
        code: couponData.code || '',
        discountPercentage: couponData.discountPercentage || 0,
        expirationDate: couponData.expirationDate || '',
        isActive: couponData.isActive ?? true,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      addCoupon(newCoupon);
      toast({ title: 'Cupón creado', description: 'El cupón se creó correctamente.' });
    }
    setEditingCoupon(null);
  };

  const handleDelete = () => {
    if (couponToDelete) {
      deleteCoupon(couponToDelete);
      toast({ title: 'Cupón eliminado', description: 'El cupón se eliminó correctamente.' });
      setCouponToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleBulkDelete = () => {
    deleteCoupons(selectedIds);
    toast({ title: 'Cupones eliminados', description: `${selectedIds.length} cupones eliminados.` });
    setSelectedIds([]);
    setBulkDeleteDialogOpen(false);
  };

  const bulkActions = [
    {
      label: 'Activar',
      icon: bulkActionIcons.activate,
      onClick: () => {
        bulkUpdateCoupons(selectedIds, { isActive: true });
        toast({ title: 'Cupones activados' });
        setSelectedIds([]);
      },
    },
    {
      label: 'Desactivar',
      icon: bulkActionIcons.deactivate,
      onClick: () => {
        bulkUpdateCoupons(selectedIds, { isActive: false });
        toast({ title: 'Cupones desactivados' });
        setSelectedIds([]);
      },
    },
    {
      label: 'Eliminar',
      icon: bulkActionIcons.delete,
      onClick: () => setBulkDeleteDialogOpen(true),
      variant: 'destructive' as const,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Cupones</h2>
          <p className="text-muted-foreground">Gestiona los cupones de descuento</p>
        </div>
        <Button onClick={() => { setEditingCoupon(null); setIsFormOpen(true); }}>
          <Plus size={18} className="mr-2" />
          Nuevo Cupón
        </Button>
      </div>

      <BulkActions selectedCount={selectedIds.length} actions={bulkActions} />

      <DataTable
        data={coupons}
        columns={columns}
        searchPlaceholder="Buscar cupones..."
        searchKeys={['code']}
        onSelectionChange={setSelectedIds}
        selectedIds={selectedIds}
        emptyMessage="No hay cupones. Crea el primero."
      />

      <CouponForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        coupon={editingCoupon}
        onSave={handleSaveCoupon}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Eliminar Cupón"
        description="¿Estás seguro de que deseas eliminar este cupón?"
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        variant="destructive"
      />

      <ConfirmDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        title="Eliminar Cupones"
        description={`¿Estás seguro de que deseas eliminar ${selectedIds.length} cupones?`}
        confirmLabel="Eliminar todos"
        onConfirm={handleBulkDelete}
        variant="destructive"
      />
    </div>
  );
}
