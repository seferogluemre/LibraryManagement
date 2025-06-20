import { Input } from "@/components/ui/input";
import { AddEditCategoryModal } from "./add-edit-category-modal";

export function CategoriesToolbar() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Kategori adı veya açıklama ile ara..."
          className="h-8 w-[150px] lg:w-[250px]"
        />
      </div>
      <div className="space-x-2">
        <AddEditCategoryModal />
      </div>
    </div>
  );
} 