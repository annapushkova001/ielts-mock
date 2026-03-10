import { useMemo } from 'react';
import type { PassageHighlight } from '../../types';

interface PassageViewerProps {
  title: string;
  content: string;
  highlight?: PassageHighlight | null;
}

function applyHighlight(html: string, highlight: PassageHighlight): string {
  const { startText, endText } = highlight;
  const startIdx = html.indexOf(startText);
  if (startIdx === -1) return html;
  const endIdx = html.indexOf(endText, startIdx);
  if (endIdx === -1) return html;
  const endPos = endIdx + endText.length;
  return (
    html.slice(0, startIdx) +
    '<mark class="bg-yellow-200 px-0.5">' +
    html.slice(startIdx, endPos) +
    '</mark>' +
    html.slice(endPos)
  );
}

export default function PassageViewer({ title, content, highlight }: PassageViewerProps) {
  const processedContent = useMemo(() => {
    if (highlight) {
      return applyHighlight(content, highlight);
    }
    return content;
  }, [content, highlight]);

  return (
    <div className="p-4 md:p-6 overflow-y-auto h-full">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div
        className="prose prose-sm max-w-none leading-relaxed [&_p]:mb-4 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2"
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />
    </div>
  );
}
