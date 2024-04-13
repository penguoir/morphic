import { PDFDocument } from 'pdf-lib';

export async function GET(request: Request) {
    const url = new URL(request.url);
    let pdfUrl = url.searchParams.get('url')?.replace('/abs/', '/pdf/');
    pdfUrl += pdfUrl?.endsWith('.pdf') ? '' : '.pdf';

    console.log('Fetching PDF:', pdfUrl);

    if (!pdfUrl) {
        return new Response(JSON.stringify({ message: 'Invalid URL provided' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const response = await fetch(pdfUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch PDF: ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const firstPage = pdfDoc.getPages()[0];
        const newPdfDoc = await PDFDocument.create();
        const [importedPage] = await newPdfDoc.copyPages(pdfDoc, [0]);
        newPdfDoc.addPage(importedPage);

        const pdfBytes = await newPdfDoc.save();

        return new Response(pdfBytes, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf'
            }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ message: 'Error fetching PDF', error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}