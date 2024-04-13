import fetch from 'node-fetch';
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { QdrantVectorStore } from '@langchain/community/vectorstores/qdrant';
import { OpenAIEmbeddings } from '@langchain/openai';

export async function POST(request: Request) {
    console.log("Registering documents on Qdrant")

    const { urls } = await request.json()
    const pdfUrls = urls.map((url: string) => url.replace('/abs/', '/pdf/') + '.pdf');

    for (const url of pdfUrls) {
        const response = await fetch(url)
        const buffer = await response.buffer()

        const loader = new PDFLoader(new Blob([buffer]))
        const pages = await loader.load()

        const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 2000 });

        const documents = await textSplitter.createDocuments(
            pages.map(p => p.pageContent),
            pages.map(_ => ({ url }))
        )

        const embeddings = new OpenAIEmbeddings()
        const vectorStore = await QdrantVectorStore.fromDocuments(documents, embeddings, {
            url: process.env.QDRANT_URL,
            collectionName: "arxiv-papers-1",
        })

    }

    console.log("Registered documents on Qdrant", { urls })

    return new Response(null, {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}

