'use client'

import React, { useEffect } from 'react'
import { PartialLiteratureReview } from '@/lib/schema/literature-review'
import { useStreamableValue } from 'ai/rsc'
import { MemoizedReactMarkdown } from './ui/markdown'
import { Button } from './ui/button'
import { DownloadIcon } from 'lucide-react'

export type LiteratureReviewProps = {
  literatureReview?: PartialLiteratureReview
}

export const LiteratureReview: React.FC<LiteratureReviewProps> = ({ literatureReview }: LiteratureReviewProps) => {
  const [data, error, pending] = useStreamableValue<PartialLiteratureReview>(literatureReview);

  console.log("Rendering LiteratureReview", { data, error, pending });

  if (error) return <div>Error: {JSON.stringify(error)}</div>;
  if (!data) return null;

  const clickHandler = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: data?.content }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'literature_review.pdf';
      document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
      a.click();  
      a.remove();  //afterwards we remove the element again         
    } catch (error) {
      console.error('Error downloading the PDF:', error);
    }
  }

  return (
    <div className="border border-gray-200 p-8 pb-16 rounded-md font-serif">
      <div className="mt-4">
        <MemoizedReactMarkdown className="prose-sm prose-neutral prose-a:text-accent-foreground/50">{data?.content}</MemoizedReactMarkdown>
      </div>

      <Button variant={"outline"} className='mt-4' onClick={clickHandler}>
        Download LaTeX
        <DownloadIcon size={16} className="inline-block ml-2" />
      </Button>
    </div>
  );
}