export type ClassroomsResponse = {
  id: string;
  name: string;
  students: {
    id: string;
    name: string;
    email: string | null;
    studentNo: number;
  }[];
}[]; 