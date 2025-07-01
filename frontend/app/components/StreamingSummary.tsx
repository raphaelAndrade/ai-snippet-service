interface StreamingSummaryProps {
    summary: string;
    isStreaming: boolean;
  }
  
  export function StreamingSummary({ summary, isStreaming }: StreamingSummaryProps) {
    const hasContent = !!summary.trim();
  
    return (
      <div className="mt-6 p-4 border border-slate-200 rounded-lg bg-slate-50 min-h-[100px] transition-all duration-300">
        <p className="text-xs font-medium text-slate-500 mb-2 tracking-wide">
          {isStreaming ? "Generating Summary..." : hasContent ? "AI Summary Preview" : "Your summary preview will appear here"}
        </p>
  
        <div className="whitespace-pre-line text-slate-800 text-base leading-relaxed">
          {isStreaming && !hasContent ? (
            <span className="text-emerald-700 animate-pulse italic">Thinking<span className="animate-ping">.</span></span>
          ) : (
            summary
          )}
        </div>
      </div>
    );
  }
  