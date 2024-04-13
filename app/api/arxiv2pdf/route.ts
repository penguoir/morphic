import fetch from 'node-fetch';
import fs from 'fs/promises';  // Use the promise-based version of fs for better performance

export async function GET(request: Request) {

    const url = new URL(request.url);
    const pdfUrl = url.searchParams.get('url')?.replace('/abs/', '/pdf/') + '.pdf';

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
        const pdfBuffer = Buffer.from(arrayBuffer);
        const pdfName = pdfUrl.split('/').pop() || 'downloaded.pdf';

        const dir = `./public/pdfs`;
        await fs.writeFile(`${dir}/${pdfName}`, pdfBuffer);

        return new Response(JSON.stringify({ message: 'PDF saved successfully', pdfName }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ message: 'Error fetching PDF', error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}