
interface PDFViewerDialogProps {
  pdfUrl: string;
}

export function PDFViewerDialog({ pdfUrl }: PDFViewerDialogProps) {
  return <iframe src={pdfUrl} width="100%" height="500px" title="PDF Viewer" />;
}
