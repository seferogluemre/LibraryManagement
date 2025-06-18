"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { useInfiniteQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { Fragment, useEffect, useState } from "react";

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

    const {
        data: classroomsData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["classrooms"],
        queryFn: async ({ pageParam = 1 }) =>
            (await api.classrooms.get({ query: { page: pageParam, limit: 10 } })).data as any,
        getNextPageParam: (lastPage: any) => {
            const morePagesExist = lastPage && lastPage.data.length === lastPage.limit;
            return morePagesExist ? lastPage.page + 1 : undefined;
        },
        initialPageParam: 1,
    });

    // Debounce search term changes
    useEffect(() => {
        const handler = setTimeout(() => {
            onFilterChange({ q: searchTerm || undefined });
        }, 300); // 500ms delay

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm, onFilterChange]);

    const handleFilter = (field: string, value: string) => {
        onFilterChange({ [field]: value === 'all' ? undefined : value });
    };

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
                    value={filters.classId || ""}
                    onValueChange={(value) => handleFilter("classId", value)}
                >
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Sınıfa Göre Filtrele" />
                    </SelectTrigger>
                    <SelectContent>
                        <motion.div variants={containerVariants} initial="hidden" animate="visible">
                            <SelectItem value="all">Tüm Sınıflar</SelectItem>
                            {classroomsData?.pages.map((page, i) => (
                                <Fragment key={i}>
                                    {page?.data?.map((classroom: any) => (
                                        <motion.div key={classroom.id} variants={itemVariants}>
                                            <SelectItem value={classroom.id}>{classroom.name}</SelectItem>
                                        </motion.div>
                                    ))}
                                </Fragment>
                            ))}
                            {hasNextPage && (
                                <Button
                                    className="w-full mt-2"
                                    variant="ghost"
                                    onClick={() => fetchNextPage()}
                                    disabled={isFetchingNextPage}
                                >
                                    {isFetchingNextPage ? <Loader2 className="h-4 w-4 animate-spin" /> : "Daha Fazla Yükle"}
                                </Button>
                            )}
                        </motion.div>
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