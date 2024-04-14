import fetch from 'node-fetch';

/**
 * This function takes a URL as input, performs a request to the specified route,
 * and returns the response from the server.
 * 
 * @param {string} url - The URL to request the PDF from.
 * @returns {Promise<Response>} - The server's response to the request.
 */
export async function requestPDF(url: string): Promise<Response> {
    try {

        const baseUrl = 'http://academorphic.vercel.app'; // Base URL of the server

        // Construct the absolute URL
        const apiUrl = `${baseUrl}/api/arxiv2pdf?url=${encodeURIComponent(url)}`;

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }) as unknown as Response;

        // Check if the response is OK (status code in the range 200-299)
        if (!response.ok) {
            throw new Error(`Server responded with a non-OK status: ${response.status}`);
        }

        // Return the response for further processing
        return response;
    } catch (error) {
        console.error('Error requesting PDF:', error);
        throw error; // Rethrow to allow caller to handle
    }
}