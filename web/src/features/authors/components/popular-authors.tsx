import type { Author } from "@/components/columns/authors-columns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useMemo } from "react";

interface PopularAuthorsProps {
    authors: Author[];
}

const getInitials = (name: string) => {
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.length > 2 ? initials.substring(0, 2) : initials;
}

export function PopularAuthors({ authors }: PopularAuthorsProps) {
    const popularAuthors = useMemo(() => {
        if (!authors) return [];
        return [...authors]
            .sort((a, b) => b._count.books - a._count.books)
            .slice(0, 6);
    }, [authors]);

    return (
        <div>
            <h2 className="text-2xl font-bold tracking-tight mb-4">En Popüler Yazarlar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {popularAuthors.map((author) => (
                    <Card key={author.id}>
                        <CardContent className="p-4 flex flex-col items-center text-center">
                            <Avatar className="w-16 h-16 mb-4">
                                <AvatarImage src={author.avatarUrl} alt={author.name} />
                                <AvatarFallback>{getInitials(author.name)}</AvatarFallback>
                            </Avatar>
                            <p className="font-semibold">{author.name}</p>
                            <p className="text-lg font-bold mt-2 text-primary">{author._count.books}</p>
                            <p className="text-xs text-muted-foreground">Kitap Sayısı</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
} 