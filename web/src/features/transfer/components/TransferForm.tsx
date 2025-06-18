import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/api"
import { getAccessToken } from "@/lib/auth"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { CheckCircle, XCircle } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface TransferRequest {
  studentId: string
  oldClassId: string
  newClassId: string
  notes?: string
}

// Define explicit types for query data
interface Student {
  id: string
  name: string
  class: { id: string; name: string }
}

interface Classroom {
  id: string
  name: string
}

export function TransferForm() {
  const [selectedStudent, setSelectedStudent] = useState<string>("")
  const [targetClass, setTargetClass] = useState<string>("")
  const [notes, setNotes] = useState("")
  const [currentClass, setCurrentClass] = useState<string>("")

  const queryClient = useQueryClient()

  // Öğrenci listesini getir
  const { data: students } = useQuery<Student[]>({
    queryKey: ["students"],
    queryFn: async () => {
      const res = await api.students.index.get()
      if (res.error) throw new Error("Öğrenciler getirilemedi")
      return res.data as Student[]
    },
  })

  const { data: classes } = useQuery<Classroom[]>({
    queryKey: ["classrooms"],
    queryFn: async () => {
      const classRes = await api.classrooms.index.get()
      if (classRes.error) throw new Error("Sınıflar getirilemedi")
      return classRes.data as Classroom[]
    },
  })
  
  const { mutate: transferStudent, isPending } = useMutation({
    mutationFn: async (values: TransferRequest) => {
      const accessToken = getAccessToken();
      if (!accessToken) {
        toast.error("Yetkilendirme hatası", { description: "Lütfen tekrar giriş yapın." });
        throw new Error("Yetkilendirme token'ı bulunamadı");
      }
      
      const res = await api["transfer-history"].post(values, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.error) {
        if (res.error.status === 401 || res.error.status === 403) {
            toast.error("Yetkilendirme hatası", { description: "Token geçersiz veya süresi dolmuş. Lütfen tekrar giriş yapın." });
        }
        throw new Error(res.error.value.message || "Bir hata oluştu");
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success("Transfer başarıyla gerçekleştirildi", {
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      })
      queryClient.invalidateQueries({ queryKey: ["students"] })
      
      setSelectedStudent("")
      setTargetClass("")
      setNotes("")
      setCurrentClass("")
    },
    onError: (error) => {
      toast.error("Transfer işlemi başarısız oldu", {
        description: error.message,
        icon: <XCircle className="h-5 w-5 text-red-500" />,
      })
    },
  })

  const handleStudentChange = (value: string) => {
    setSelectedStudent(value)
    const student = students?.find(s => s.id === value)
    if (student) {
      setCurrentClass(student.class.name)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedStudent || !targetClass) {
      toast.error("Lütfen gerekli alanları doldurun")
      return
    }

    const student = students?.find(s => s.id === selectedStudent)
    
    if (!student) {
      toast.error("Öğrenci bilgisi bulunamadı")
      return
    }

    const transferData: TransferRequest = {
      studentId: selectedStudent,
      oldClassId: student.class.id,
      newClassId: targetClass,
      notes: notes.trim() || undefined
    }

    transferStudent(transferData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer Formu</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Öğrenci Seçin</label>
            <Select value={selectedStudent} onValueChange={handleStudentChange}>
              <SelectTrigger>
                <SelectValue placeholder="Öğrenci seçin..." />
              </SelectTrigger>
              <SelectContent>
                {students?.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedStudent && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Mevcut Sınıf</label>
              <div className="p-2 bg-muted rounded-md">
                {currentClass}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Hedef Sınıf</label>
            <Select value={targetClass} onValueChange={setTargetClass}>
              <SelectTrigger>
                <SelectValue placeholder="Hedef sınıf seçin..." />
              </SelectTrigger>
              <SelectContent>
                {classes?.map((class_) => (
                  <SelectItem key={class_.id} value={class_.id}>
                    {class_.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Transfer Notları (Opsiyonel)</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Transfer sebebi veya ek notlar..."
              className="min-h-[100px]"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Transfer Ediliyor..." : "Transferi Gerçekleştir"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
