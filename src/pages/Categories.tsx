import { useState } from 'react';
import { useDataStore } from '@/store/dataStore';
import { Category } from '@/types';
import { DataTable } from '@/components/shared/DataTable';
import { BulkActions, bulkActionIcons } from '@/components/shared/BulkActions';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { CategoryForm } from '@/components/categories/CategoryForm';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Categories() {
  const { toast } = useToast();
  const { categories, addCategory, updateCategory, deleteCategory, deleteCategories, bulkUpdateCategories } = useDataStore();
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  const columns = [
    {
      key: 'name',
      label: 'Nombre',
      render: (category: Category) => (
        <span className="font-medium text-foreground">{category.name}</span>
      ),
    },
    {
      key: 'isActive',
      label: 'Estado',
      render: (category: Category) => (
        <StatusBadge status={category.isActive ? 'active' : 'inactive'} />
      ),
    },
    {
      key: 'createdAt',
      label: 'Fecha de Creación',
      render: (category: Category) => (
        <span className="text-muted-foreground">{category.createdAt}</span>
      ),
    },
    {
      key: 'actions',
      label: '',
      className: 'w-24',
      render: (category: Category) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setEditingCategory(category);
              setIsFormOpen(true);
            }}
          >
            <Pencil size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setCategoryToDelete(category.id);
              setDeleteDialogOpen(true);
            }}
          >
            <Trash2 size={16} className="text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  const handleSaveCategory = (categoryData: Partial<Category>) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, categoryData);
      toast({ title: 'Categoría actualizada', description: 'Los cambios se guardaron correctamente.' });
    } else {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: categoryData.name || '',
        isActive: categoryData.isActive ?? true,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      addCategory(newCategory);
      toast({ title: 'Categoría creada', description: 'La categoría se creó correctamente.' });
    }
    setEditingCategory(null);
  };

  const handleDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete);
      toast({ title: 'Categoría eliminada', description: 'La categoría se eliminó correctamente.' });
      setCategoryToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleBulkDelete = () => {
    deleteCategories(selectedIds);
    toast({ title: 'Categorías eliminadas', description: `${selectedIds.length} categorías eliminadas.` });
    setSelectedIds([]);
    setBulkDeleteDialogOpen(false);
  };

  const bulkActions = [
    {
      label: 'Activar',
      icon: bulkActionIcons.activate,
      onClick: () => {
        bulkUpdateCategories(selectedIds, { isActive: true });
        toast({ title: 'Categorías activadas' });
        setSelectedIds([]);
      },
    },
    {
      label: 'Desactivar',
      icon: bulkActionIcons.deactivate,
      onClick: () => {
        bulkUpdateCategories(selectedIds, { isActive: false });
        toast({ title: 'Categorías desactivadas' });
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
          <h2 className="text-2xl font-bold text-foreground">Categorías</h2>
          <p className="text-muted-foreground">Gestiona las categorías de productos</p>
        </div>
        <Button onClick={() => { setEditingCategory(null); setIsFormOpen(true); }}>
          <Plus size={18} className="mr-2" />
          Nueva Categoría
        </Button>
      </div>

      <BulkActions selectedCount={selectedIds.length} actions={bulkActions} />

      <DataTable
        data={categories}
        columns={columns}
        searchPlaceholder="Buscar categorías..."
        searchKeys={['name']}
        onSelectionChange={setSelectedIds}
        selectedIds={selectedIds}
        emptyMessage="No hay categorías. Crea la primera."
      />

      <CategoryForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        category={editingCategory}
        onSave={handleSaveCategory}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Eliminar Categoría"
        description="¿Estás seguro de que deseas eliminar esta categoría? Los productos asociados quedarán sin categoría."
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        variant="destructive"
      />

      <ConfirmDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        title="Eliminar Categorías"
        description={`¿Estás seguro de que deseas eliminar ${selectedIds.length} categorías?`}
        confirmLabel="Eliminar todas"
        onConfirm={handleBulkDelete}
        variant="destructive"
      />
    </div>
  );
}
