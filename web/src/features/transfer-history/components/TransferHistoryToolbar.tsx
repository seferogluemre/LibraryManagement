import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { useEffect, useState } from "react";

interface TransferHistoryToolbarProps {
    filters: {
        q?: string;
        fromDate?: string;
        toDate?: string;
    };
    onFilterChange: (filters: {
        q?: string;
        fromDate?: string;
        toDate?: string;
    }) => void;
}

// NOTE: This is a skeleton component.
// The actual DatePicker and other interactive elements will need state and handlers.

export function TransferHistoryToolbar({ filters, onFilterChange }: TransferHistoryToolbarProps) {
    const [searchTerm, setSearchTerm] = useState(filters.q || "");
    const [fromDate, setFromDate] = useState<Date | undefined>(
        filters.fromDate ? parseISO(filters.fromDate) : undefined
    );
    const [toDate, setToDate] = useState<Date | undefined>(
        filters.toDate ? parseISO(filters.toDate) : undefined
    );

    useEffect(() => {
        const handler = setTimeout(() => {
            onFilterChange({
                q: searchTerm || undefined,
                fromDate: fromDate ? fromDate.toISOString() : undefined,
                toDate: toDate ? toDate.toISOString() : undefined,
            });
        }, 500);

        return () => clearTimeout(handler);
    }, [searchTerm, fromDate, toDate, onFilterChange]);

    const clearFilters = () => {
        setSearchTerm("");
        setFromDate(undefined);
        setToDate(undefined);
    };

    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4 w-full">
                <Input
                    placeholder="Öğrenci adı veya sebep ile ara..."
                    className="w-full md:max-w-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="flex items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn("w-[150px] justify-start text-left font-normal", !fromDate && "text-muted-foreground")}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {fromDate ? format(fromDate, "dd/MM/yyyy") : <span>Başlangıç</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus />
                        </PopoverContent>
                    </Popover>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn("w-[150px] justify-start text-left font-normal", !toDate && "text-muted-foreground")}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {toDate ? format(toDate, "dd/MM/yyyy") : <span>Bitiş</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>
                 {(searchTerm || fromDate || toDate) && (
                    <Button variant="ghost" onClick={clearFilters}>
                        <X className="mr-2 h-4 w-4" />
                        Filtreleri Temizle
                    </Button>
                )}
            </div>
        </div>
    );
} 