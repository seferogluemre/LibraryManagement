import { Button } from "#components/ui/button";
import { Input } from "#components/ui/input";
import { Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterableColumns?: {
    id: string;
    title: string;
    options: {
      label: string;
      value: string;
    }[];
  }[];
  onSearchSubmit?: (value: string) => void;
  searchValue?: string;
  customFilters?: ReactNode;
}

interface SearchFormData {
  search: string;
}

export function DataTableToolbar<TData>({
  table,
  filterableColumns = [],
  onSearchSubmit,
  searchValue = "",
  customFilters,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const { register, handleSubmit, reset } = useForm<SearchFormData>({
    defaultValues: {
      search: searchValue,
    },
  });

  const onSubmit = (data: SearchFormData) => {
    onSearchSubmit?.(data.search);
  };

  const handleReset = () => {
    reset({ search: "" });
    onSearchSubmit?.("");
  };

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
          {!!onSearchSubmit && (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex items-center space-x-2"
            >
              <Input
                placeholder={`Search...`}
                {...register("search")}
                className="h-8 w-[150px] lg:w-[250px]"
              />
              <Button type="submit" size="sm" variant="outline" className="h-8">
                <MagnifyingGlassIcon className="h-4 w-4" />
              </Button>
              {(isFiltered || searchValue) && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-8"
                  onClick={handleReset}
                >
                  <Cross2Icon className="h-4 w-4" />
                </Button>
              )}
            </form>
          )}

          <div className="flex gap-x-2">
            {filterableColumns.map(function (column) {
              return table.getColumn(column.id) ? (
                <DataTableFacetedFilter
                  key={column.id}
                  column={table.getColumn(column.id)}
                  title={column.title}
                  options={column.options}
                />
              ) : null;
            })}
          </div>
        </div>
        {/* <DataTableViewOptions table={table} /> */}
      </div>

      {customFilters}
    </div>
  );
}
