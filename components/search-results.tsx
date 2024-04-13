'use client'

import React, { useState, useEffect } from 'react';
import { AvatarImage, Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CardContent, Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { requestPDF } from '@/lib/utils/arxiv2pdf';
import { PDFViewerComponent } from './pdf-viewer';

export interface SearchResultsProps {
  results: { title: string; url: string; content: string }[];
}

export function SearchResults({ results }: SearchResultsProps) {
  const [showAllResults, setShowAllResults] = useState(false);
  const [pdfUrls, setPdfUrls] = useState<{ [key: string]: string }>({});

  const handleViewMore = () => {
    setShowAllResults(true);
  };

  const fetchPDF = async (url: string, index: number) => {
    try {
      const response = await requestPDF(url);
      const blob = await response.blob();
      const pdfUrl = URL.createObjectURL(blob);
      setPdfUrls(prev => ({ ...prev, [index]: pdfUrl }));
    } catch (error) {
      console.error('Error fetching PDF:', error);
    }
  };

  useEffect(() => {
    results.forEach((result, index) => {
      fetchPDF(result.url, index);
    });
  }, [results]);

  const displayedResults = showAllResults ? results : results.slice(0, 3);
  const additionalResultsCount = results.length > 3 ? results.length - 3 : 0;

  return (
    <div className="flex flex-wrap">
      {displayedResults.map((result, index) => (
        <div className="w-1/2 md:w-1/4 p-1" key={index}>
          <Link href={result.url} passHref target="_blank">
            <Card className="flex-1">
              <CardContent className="p-2">
                  <p className="text-xs line-clamp-2">{result.content}</p>
                  <div className="mt-2 flex items-center space-x-2">
                      <Avatar className="h-4 w-4">
                          <AvatarImage
                              src={`https://www.google.com/s2/favicons?domain=${new URL(result.url).hostname}`}
                              alt={result.title}
                          />
                          <AvatarFallback>
                              {new URL(result.url).hostname[0]}
                          </AvatarFallback>
                      </Avatar>
                      <div className="text-xs opacity-60 truncate">
                          {result.title}
                      </div>
                  </div>
                  {/* Conditionally render the PDFViewerComponent below the title */}
                  {pdfUrls[index] && (
                      <div className="mt-2">
                          <PDFViewerComponent pdfUrl={pdfUrls[index]} />
                      </div>
                  )}
              </CardContent>
            </Card>
          </Link>
        </div>
      ))}
      {!showAllResults && additionalResultsCount > 0 && (
        <div className="w-1/2 md:w-1/4 p-1">
          <Card className="flex-1 flex h-full items-center justify-center">
            <CardContent className="p-2">
              <Button
                variant={'link'}
                className="text-muted-foreground"
                onClick={handleViewMore}
              >
                View {additionalResultsCount} more
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}