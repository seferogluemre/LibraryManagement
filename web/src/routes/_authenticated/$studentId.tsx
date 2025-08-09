import { StudentDetailPage } from "@/features/student-detail";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/$studentId")({
  component: StudentDetail,
});

function StudentDetail() {
  const { studentId } = Route.useParams();
  return <StudentDetailPage studentId={studentId} />;
}