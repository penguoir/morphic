import { createReadStream, createWriteStream, promises as fsPromises } from 'fs';
import latex from 'node-latex';

export async function POST(request: Request) {
    try {
        const requestBody = await request.json(); // Parse the request body as JSON
        const latexCode = requestBody.latexCode; // Extract the LaTeX code from the JSON object under the key 'latexCode'
        const bibContent = requestBody.bibContent; // Extract the .bib content from the JSON object under the key 'bibContent'
        

        // Prepare a temporary file or stream setup
        const tempTexPath = 'temp.tex';
        const tempPdfPath = 'output.pdf';
        const tempBibPath = 'temp.bib';

        // Write the LaTeX code to a temporary .tex file
        await fsPromises.writeFile(tempTexPath, latexCode);

        // Write the .bib content to a temporary .bib file, if it exists
        if (bibContent) {
            await fsPromises.writeFile(tempBibPath, bibContent);
        }

        // Convert LaTeX to PDF using node-latex
        const input = createReadStream(tempTexPath);
        const output = createWriteStream(tempPdfPath);
        const pdf = latex(input);

        pdf.pipe(output);
        await new Promise((resolve, reject) => {
            pdf.on('error', reject);
            output.on('finish', resolve);
        });

        // Read the generated PDF and send as response
        const pdfBuffer = await fsPromises.readFile(tempPdfPath);

        return new Response(pdfBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf'
            }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ message: 'Error processing LaTeX', error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    } finally {
        // Cleanup temporary files
        try {
            await fsPromises.unlink('temp.tex');
            await fsPromises.unlink('output.pdf');
            await fsPromises.unlink('temp.bib');
        } catch (error) {
            console.error('Error cleaning up temporary files:', error);
        }
    }
}