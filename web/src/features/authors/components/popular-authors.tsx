import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

// Mock data, will be replaced with actual API data
const popularAuthors = [
    { name: "Paulo Coelho", nationality: "Brezilyalı", bookCount: 12, avatarUrl: "https://placehold.co/40x40" },
    { name: "Victor Hugo", nationality: "Fransız", bookCount: 9, avatarUrl: "https://placehold.co/40x40" },
    { name: "Fyodor Dostoyevski", nationality: "Rus", bookCount: 8, avatarUrl: "https://placehold.co/40x40" },
    { name: "Antoine de Saint-Exupéry", nationality: "Fransız", bookCount: 6, avatarUrl: "https://placehold.co/40x40" },
    { name: "George Orwell", nationality: "İngiliz", bookCount: 5, avatarUrl: "https://placehold.co/40x40" },
    { name: "Franz Kafka", nationality: "Çek", bookCount: 4, avatarUrl: "https://placehold.co/40x40" },
];


export function PopularAuthors() {
    return (
        <div>
            <h2 className="text-2xl font-bold tracking-tight mb-4">En Popüler Yazarlar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {popularAuthors.map((author) => (
                    <Card key={author.name}>
                        <CardContent className="p-4 flex flex-col items-center text-center">
                            <Avatar className="w-16 h-16 mb-4">
                                <AvatarImage src={author.avatarUrl} alt={author.name} />
                                <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <p className="font-semibold">{author.name}</p>
                            <p className="text-sm text-muted-foreground">{author.nationality}</p>
                            <p className="text-lg font-bold mt-2 text-primary">{author.bookCount}</p>
                            <p className="text-xs text-muted-foreground">Kitap Sayısı</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
} 