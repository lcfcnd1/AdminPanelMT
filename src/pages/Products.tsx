import { useState } from 'react';
import { useDataStore } from '@/store/dataStore';
import { Product } from '@/types';
import { DataTable } from '@/components/shared/DataTable';
import { BulkActions, bulkActionIcons } from '@/components/shared/BulkActions';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { ProductForm } from '@/components/products/ProductForm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Pencil, Trash2, Star, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Products() {
  const { toast } = useToast();
  const { products, categories, addProduct, updateProduct, deleteProduct, deleteProducts, bulkUpdateProducts } = useDataStore();
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  
  // Bulk actions dialogs
  const [bulkCategoryOpen, setBulkCategoryOpen] = useState(false);
  const [bulkPriceOpen, setBulkPriceOpen] = useState(false);
  const [bulkDiscountOpen, setBulkDiscountOpen] = useState(false);
  const [bulkCategory, setBulkCategory] = useState('');
  const [bulkPrice, setBulkPrice] = useState(0);
  const [bulkDiscount, setBulkDiscount] = useState(0);

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || 'Sin categoría';
  };

  const columns = [
    {
      key: 'imageUrl',
      label: '',
      className: 'w-12',
      render: (product: Product) => (
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
          ) : (
            <Image size={16} className="text-muted-foreground" />
          )}
        </div>
      ),
    },
    {
      key: 'title',
      label: 'Producto',
      render: (product: Product) => (
        <div>
          <p className="font-medium text-foreground">{product.title}</p>
          <p className="text-xs text-muted-foreground">{getCategoryName(product.categoryId)}</p>
        </div>
      ),
    },
    {
      key: 'price',
      label: 'Precio',
      render: (product: Product) => (
        <div>
          <p className="font-medium">${product.price.toFixed(2)}</p>
          {product.discountPercentage > 0 && (
            <Badge variant="secondary" className="text-xs">-{product.discountPercentage}%</Badge>
          )}
        </div>
      ),
    },
    {
      key: 'powerLevel',
      label: 'Nivel',
      render: (product: Product) => (
        <Badge variant="outline">{product.powerLevel}</Badge>
      ),
    },
    {
      key: 'isFeatured',
      label: 'Destacado',
      render: (product: Product) => (
        product.isFeatured ? (
          <Star size={18} className="text-warning fill-warning" />
        ) : (
          <Star size={18} className="text-muted-foreground" />
        )
      ),
    },
    {
      key: 'isActive',
      label: 'Estado',
      render: (product: Product) => (
        <StatusBadge status={product.isActive ? 'active' : 'inactive'} />
      ),
    },
    {
      key: 'actions',
      label: '',
      className: 'w-24',
      render: (product: Product) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setEditingProduct(product);
              setIsFormOpen(true);
            }}
          >
            <Pencil size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setProductToDelete(product.id);
              setDeleteDialogOpen(true);
            }}
          >
            <Trash2 size={16} className="text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  const handleSaveProduct = (productData: Partial<Product>) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      toast({ title: 'Producto actualizado', description: 'Los cambios se guardaron correctamente.' });
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        title: productData.title || '',
        description: productData.description || '',
        price: productData.price || 0,
        categoryId: productData.categoryId || '',
        powerLevel: productData.powerLevel || 'Básico',
        isFeatured: productData.isFeatured || false,
        discountPercentage: productData.discountPercentage || 0,
        imageUrl: productData.imageUrl,
        ritualBenefits: productData.ritualBenefits || [],
        isActive: productData.isActive ?? true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addProduct(newProduct);
      toast({ title: 'Producto creado', description: 'El producto se creó correctamente.' });
    }
    setEditingProduct(null);
  };

  const handleDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete);
      toast({ title: 'Producto eliminado', description: 'El producto se eliminó correctamente.' });
      setProductToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleBulkDelete = () => {
    deleteProducts(selectedIds);
    toast({ title: 'Productos eliminados', description: `${selectedIds.length} productos eliminados.` });
    setSelectedIds([]);
    setBulkDeleteDialogOpen(false);
  };

  const handleBulkCategoryChange = () => {
    if (bulkCategory) {
      bulkUpdateProducts(selectedIds, { categoryId: bulkCategory });
      toast({ title: 'Categoría actualizada', description: `${selectedIds.length} productos actualizados.` });
      setSelectedIds([]);
      setBulkCategoryOpen(false);
      setBulkCategory('');
    }
  };

  const handleBulkPriceChange = () => {
    bulkUpdateProducts(selectedIds, { price: bulkPrice });
    toast({ title: 'Precio actualizado', description: `${selectedIds.length} productos actualizados.` });
    setSelectedIds([]);
    setBulkPriceOpen(false);
    setBulkPrice(0);
  };

  const handleBulkDiscountChange = () => {
    bulkUpdateProducts(selectedIds, { discountPercentage: bulkDiscount });
    toast({ title: 'Descuento actualizado', description: `${selectedIds.length} productos actualizados.` });
    setSelectedIds([]);
    setBulkDiscountOpen(false);
    setBulkDiscount(0);
  };

  const bulkActions = [
    {
      label: 'Activar',
      icon: bulkActionIcons.activate,
      onClick: () => {
        bulkUpdateProducts(selectedIds, { isActive: true });
        toast({ title: 'Productos activados' });
        setSelectedIds([]);
      },
    },
    {
      label: 'Desactivar',
      icon: bulkActionIcons.deactivate,
      onClick: () => {
        bulkUpdateProducts(selectedIds, { isActive: false });
        toast({ title: 'Productos desactivados' });
        setSelectedIds([]);
      },
    },
    {
      label: 'Marcar destacado',
      icon: bulkActionIcons.feature,
      onClick: () => {
        bulkUpdateProducts(selectedIds, { isFeatured: true });
        toast({ title: 'Productos marcados como destacados' });
        setSelectedIds([]);
      },
    },
    {
      label: 'Quitar destacado',
      icon: bulkActionIcons.unfeature,
      onClick: () => {
        bulkUpdateProducts(selectedIds, { isFeatured: false });
        toast({ title: 'Destacado removido de los productos' });
        setSelectedIds([]);
      },
    },
    {
      label: 'Cambiar categoría',
      onClick: () => setBulkCategoryOpen(true),
    },
    {
      label: 'Modificar precio',
      onClick: () => setBulkPriceOpen(true),
    },
    {
      label: 'Modificar descuento',
      onClick: () => setBulkDiscountOpen(true),
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
          <h2 className="text-2xl font-bold text-foreground">Productos</h2>
          <p className="text-muted-foreground">Gestiona el catálogo de productos</p>
        </div>
        <Button onClick={() => { setEditingProduct(null); setIsFormOpen(true); }}>
          <Plus size={18} className="mr-2" />
          Nuevo Producto
        </Button>
      </div>

      <BulkActions selectedCount={selectedIds.length} actions={bulkActions} />

      <DataTable
        data={products}
        columns={columns}
        searchPlaceholder="Buscar productos..."
        searchKeys={['title', 'description']}
        onSelectionChange={setSelectedIds}
        selectedIds={selectedIds}
        emptyMessage="No hay productos. Crea el primero."
      />

      <ProductForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        product={editingProduct}
        onSave={handleSaveProduct}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Eliminar Producto"
        description="¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        variant="destructive"
      />

      <ConfirmDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        title="Eliminar Productos"
        description={`¿Estás seguro de que deseas eliminar ${selectedIds.length} productos? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar todos"
        onConfirm={handleBulkDelete}
        variant="destructive"
      />

      {/* Bulk Category Dialog */}
      <Dialog open={bulkCategoryOpen} onOpenChange={setBulkCategoryOpen}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Cambiar Categoría</DialogTitle>
            <DialogDescription>
              Selecciona la nueva categoría para los {selectedIds.length} productos seleccionados.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nueva Categoría</Label>
              <Select value={bulkCategory} onValueChange={setBulkCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {categories.filter(c => c.isActive).map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkCategoryOpen(false)}>Cancelar</Button>
            <Button onClick={handleBulkCategoryChange} disabled={!bulkCategory}>Aplicar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Price Dialog */}
      <Dialog open={bulkPriceOpen} onOpenChange={setBulkPriceOpen}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Modificar Precio</DialogTitle>
            <DialogDescription>
              Ingresa el nuevo precio para los {selectedIds.length} productos seleccionados.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nuevo Precio ($)</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={bulkPrice}
                onChange={(e) => setBulkPrice(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkPriceOpen(false)}>Cancelar</Button>
            <Button onClick={handleBulkPriceChange}>Aplicar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Discount Dialog */}
      <Dialog open={bulkDiscountOpen} onOpenChange={setBulkDiscountOpen}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Modificar Descuento</DialogTitle>
            <DialogDescription>
              Ingresa el nuevo porcentaje de descuento para los {selectedIds.length} productos seleccionados.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Descuento (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={bulkDiscount}
                onChange={(e) => setBulkDiscount(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkDiscountOpen(false)}>Cancelar</Button>
            <Button onClick={handleBulkDiscountChange}>Aplicar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
