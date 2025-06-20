export type Category = {
  id: number;
  name: string;
  description: string | null;
  _count: {
    books: number;
  };
}; 