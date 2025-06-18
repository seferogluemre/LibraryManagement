import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface TransferHistoryToolbarProps {
    filters: {
        q?: string;
        classId?: string;
        fromDate?: string;
        toDate?: string;
    };
    onFilterChange: (filters: {
        q?: string;
        classId?: string;
        fromDate?: string;
        toDate?: string;
    }) => void;
}

// NOTE: This is a skeleton component.
// The actual DatePicker and other interactive elements will need state and handlers.

export function TransferHistoryToolbar({ filters, onFilterChange }: TransferHistoryToolbarProps) {
    const [searchTerm, setSearchTerm] = useState(filters.q || "");

    // Debounce search term changes
    useEffect(() => {
        const handler = setTimeout(() => {
            onFilterChange({ q: searchTerm || undefined });
        }, 300); // 500ms delay

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm, onFilterChange]);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex flex-col md:flex-row items-center gap-4 w-full">
        <Input
          placeholder="Öğrenci adı, sınıf veya sebep ile ara..."
          className="w-full md:max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
            value={filters.classId}
            onValueChange={(value) => onFilterChange({ classId: value === 'all' ? undefined : value })}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Tüm Sınıflar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Sınıflar</SelectItem>
            {/* Placeholder items - This should be populated with actual class data */}
            <SelectItem value="10-a">10-A</SelectItem>
            <SelectItem value="11-b">11-B</SelectItem>
            <SelectItem value="12-c">12-C</SelectItem>
          </SelectContent>
        </Select>
        {/* Placeholder for Date Range Picker */}
        <div className="flex items-center gap-2">
           <Button variant={"outline"} className="w-[140px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>Başlangıç</span>
            </Button>
             <Button variant={"outline"} className="w-[140px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>Bitiş</span>
            </Button>
        </div>
      </div>
    </div>
  );
} 