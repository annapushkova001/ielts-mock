import { useState, type ReactNode } from 'react';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';

interface SplitScreenProps {
  left: ReactNode;
  right: ReactNode;
}

export default function SplitScreen({ left, right }: SplitScreenProps) {
  const [mobileTab, setMobileTab] = useState<'passage' | 'questions'>('passage');

  return (
    <>
      {/* Desktop: side-by-side resizable panels */}
      <div className="hidden md:flex flex-1 min-h-0">
        <PanelGroup orientation="horizontal" className="h-full">
          <Panel defaultSize={50} minSize={30} className="h-full">
            <div className="h-full overflow-y-auto">{left}</div>
          </Panel>
          <PanelResizeHandle className="w-2 bg-gray-200 hover:bg-gray-400 transition-colors flex items-center justify-center cursor-col-resize">
            <span className="text-gray-500 text-xs">↔</span>
          </PanelResizeHandle>
          <Panel defaultSize={50} minSize={30} className="h-full">
            <div className="h-full overflow-y-auto">{right}</div>
          </Panel>
        </PanelGroup>
      </div>

      {/* Mobile: tab-based toggle */}
      <div className="md:hidden flex flex-col flex-1 min-h-0">
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-2 text-center text-sm font-medium cursor-pointer ${
              mobileTab === 'passage'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500'
            }`}
            onClick={() => setMobileTab('passage')}
          >
            Passage
          </button>
          <button
            className={`flex-1 py-2 text-center text-sm font-medium cursor-pointer ${
              mobileTab === 'questions'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500'
            }`}
            onClick={() => setMobileTab('questions')}
          >
            Questions
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {mobileTab === 'passage' ? left : right}
        </div>
      </div>
    </>
  );
}
