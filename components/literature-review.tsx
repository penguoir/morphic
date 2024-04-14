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

  return (
    <div className="border border-gray-200 p-8 pb-16 rounded-md font-serif">
      <div className="mt-4">
        <MemoizedReactMarkdown className="prose-sm prose-neutral prose-a:text-accent-foreground/50">{data?.content}</MemoizedReactMarkdown>
      </div>
    <Button variant={"outline"} className='mt-4'>
      Download LaTeX
      <DownloadIcon size={16} className="inline-block ml-2" />
    </Button>
    </div>
  );
}