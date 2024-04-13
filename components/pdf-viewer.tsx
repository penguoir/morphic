import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

export function PDFViewerComponent({ pdfUrl }: { pdfUrl: string }) {

    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer fileUrl={pdfUrl} />
        </Worker>
    );
}