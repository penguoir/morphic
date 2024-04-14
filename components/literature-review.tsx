'use client'

import React, { useEffect } from 'react'
import { PartialLiteratureReview } from '@/lib/schema/literature-review'
import { useStreamableValue } from 'ai/rsc'
import { MemoizedReactMarkdown } from './ui/markdown'

export type LiteratureReviewProps = {
  literatureReview?: PartialLiteratureReview
}

export const LiteratureReview: React.FC<LiteratureReviewProps> = ({ literatureReview }: LiteratureReviewProps) => {
  const [data, error, pending] = useStreamableValue<PartialLiteratureReview>(literatureReview);

  console.log("Rendering LiteratureReview", { data, error, pending });

  if (pending) return <div>Loading...</div>;
  if (error) return <div>Error: {JSON.stringify(error)}</div>;
  if (!data) return null;

  return (
    <div className="border border-gray-200 p-8 pb-16 rounded-md font-serif">
      <h1 className="text-xl font-bold text-center mb-4">Literature Review</h1>
      <div className="mt-4">
        <MemoizedReactMarkdown className="prose-sm prose-neutral prose-a:text-accent-foreground/50">{data?.content}</MemoizedReactMarkdown>
      </div>
    </div>
  );
}