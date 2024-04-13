'use client'

import React, { useEffect } from 'react'
import { PartialLiteratureReview } from '@/lib/schema/literature-review'
import { useStreamableValue } from 'ai/rsc'

export type LiteratureReviewProps = {
  literatureReview?: PartialLiteratureReview
}

export const LiteratureReview: React.FC<LiteratureReviewProps> = ({ literatureReview }: LiteratureReviewProps) => {
  const streamableState = useStreamableValue<PartialLiteratureReview>(literatureReview);

  if (streamableState[1]) return <div>Loading...</div>;

  return (
    <div className="pt-4 border-t border-gray-200 p-8">
      {streamableState[0] ? streamableState[0].content : ""}
    </div>
  );
}