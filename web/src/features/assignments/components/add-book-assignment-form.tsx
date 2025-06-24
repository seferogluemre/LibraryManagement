import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"
import { handleServerError } from "@/utils/handle-server-error"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

type Book = NonNullable<Awaited<ReturnType<typeof api.books.get>>["data"]>[number]
type Student = NonNullable<
  Awaited<ReturnType<typeof api.students.get>>["data"]
>[number]

const formSchema = z.object({
  bookId: z.string({ required_error: "Kitap seçimi zorunludur." }),
  studentId: z.string({ required_error: "Öğrenci seçimi zorunludur." }),
  returnDue: z.date({ required_error: "İade tarihi zorunludur." }),
})

type FormValues = z.infer<typeof formSchema>

interface AddBookAssignmentFormProps {
  onSuccess: () => void
}

export function AddBookAssignmentForm({ onSuccess }: AddBookAssignmentFormProps) {
  const queryClient = useQueryClient()
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })
  const [isBookPopoverOpen, setIsBookPopoverOpen] = useState(false)
  const [isStudentPopoverOpen, setIsStudentPopoverOpen] = useState(false)

  const { data: books, isLoading: isBooksLoading } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const res = await api.books.get({ query: { available: "true" } })
      if (res.error) throw new Error("Kitaplar getirelemedi")
      return res.data
    },
  })

  const { data: students, isLoading: isStudentsLoading } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const res = await api.students.get()
      if (res.error) throw new Error("Öğrenciler getirilemedi")
      return res.data
    },
  })

  const createAssignmentMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const res = await api["book-assignments"].post({
        book_id: values.bookId,
        student_id: values.studentId,
        return_due: values.returnDue.toISOString(),
      })
      if (res.error) throw res.error
      return res.data
    },
    onSuccess: () => {
      toast.success("Kitap ataması başarıyla oluşturuldu.")
      queryClient.invalidateQueries({ queryKey: ["assignments"] })
      queryClient.invalidateQueries({ queryKey: ["assignments-stats"] })
      onSuccess()
    },
    onError: (error) => {
      handleServerError(error)
    },
  })

  const onSubmit = (values: FormValues) => {
    createAssignmentMutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="bookId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Kitap</FormLabel>
              <Popover
                modal={false}
                open={isBookPopoverOpen}
                onOpenChange={setIsBookPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      disabled={isBooksLoading}
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? books?.find((book: Book) => book.id === field.value)
                            ?.title
                        : "Kitap seçin"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[375px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Kitap ara..."
                      disabled={isBooksLoading}
                    />
                    <CommandList>
                      {isBooksLoading && (
                        <CommandEmpty>Kitaplar yükleniyor...</CommandEmpty>
                      )}
                      <CommandEmpty>Kitap bulunamadı.</CommandEmpty>
                      <CommandGroup>
                        {books?.map((book: Book) => (
                          <CommandItem
                            value={book.title}
                            key={book.id}
                            onSelect={() => {
                              form.setValue("bookId", book.id)
                              setIsBookPopoverOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                book.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {book.title}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="studentId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Öğrenci</FormLabel>
              <Popover
                modal={false}
                open={isStudentPopoverOpen}
                onOpenChange={setIsStudentPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      disabled={isStudentsLoading}
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? students?.find(
                            (student: Student) => student.id === field.value
                          )?.name
                        : "Öğrenci seçin"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[375px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Öğrenci ara..."
                      disabled={isStudentsLoading}
                    />
                    <CommandList>
                      {isStudentsLoading && (
                        <CommandEmpty>Öğrenciler yükleniyor...</CommandEmpty>
                      )}
                      <CommandEmpty>Öğrenci bulunamadı.</CommandEmpty>
                      <CommandGroup>
                        {students?.map((student: Student) => (
                          <CommandItem
                            value={student.name}
                            key={student.id}
                            onSelect={() => {
                              form.setValue("studentId", student.id)
                              setIsStudentPopoverOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                student.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {student.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="returnDue"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>İade Tarihi</FormLabel>
              <Popover modal={false}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Tarih seçin</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={createAssignmentMutation.isPending}
        >
          {createAssignmentMutation.isPending
            ? "Kaydediliyor..."
            : "Kaydet"}
        </Button>
      </form>
    </Form>
  )
} 