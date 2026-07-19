import { useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Highlighter, Undo2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const MarkdownRenderer = forwardRef(({ content, className = '', onMark, isDrawingMode }, ref) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [selection, setSelection] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [history, setHistory] = useState([]);

  useImperativeHandle(ref, () => ({
    undo: () => {
      if (!canvasRef.current || !context || history.length === 0) return;
      const canvas = canvasRef.current;
      
      if (history.length === 1) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        setHistory([]);
      } else {
        const newHistory = [...history];
        newHistory.pop(); // Remove current state
        const previousState = newHistory[newHistory.length - 1];
        context.putImageData(previousState, 0, 0);
        setHistory(newHistory);
      }
    },
    hasHistory: history.length > 0
  }));

  useEffect(() => {
    const handleSelection = () => {
      if (isDrawingMode) return;
      const activeSelection = window.getSelection();
      if (!activeSelection || activeSelection.isCollapsed) {
        setSelection(null);
        return;
      }

      const text = activeSelection.toString().trim();
      if (!text || text.length < 3) {
        setSelection(null);
        return;
      }

      if (
        containerRef.current &&
        containerRef.current.contains(activeSelection.anchorNode) &&
        containerRef.current.contains(activeSelection.focusNode)
      ) {
        const range = activeSelection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        setSelection({
          text,
          top: rect.top - 40,
          left: rect.left + rect.width / 2,
        });
      } else {
        setSelection(null);
      }
    };

    document.addEventListener('selectionchange', handleSelection);
    return () => document.removeEventListener('selectionchange', handleSelection);
  }, [isDrawingMode]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    
    const resizeCanvas = () => {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      if (canvas.width > 0 && canvas.height > 0) {
        tempCtx.drawImage(canvas, 0, 0);
      }

      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;

      const ctx = canvas.getContext('2d');
      if (tempCanvas.width > 0 && tempCanvas.height > 0) {
        ctx.drawImage(tempCanvas, 0, 0);
      }
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.4)'; 
      ctx.lineWidth = 6; 
      ctx.globalCompositeOperation = 'multiply';
      setContext(ctx);
    };
    
    resizeCanvas();
    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(container);
    return () => observer.disconnect();
  }, [content]);

  const saveState = useCallback(() => {
    if (!canvasRef.current || !context) return;
    const canvas = canvasRef.current;
    setHistory(prev => [...prev, context.getImageData(0, 0, canvas.width, canvas.height)]);
  }, [context]);

  const startDrawing = (e) => {
    if (!isDrawingMode || !context) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    if (history.length === 0) saveState(); 

    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || !isDrawingMode || !context) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing || !context) return;
    context.closePath();
    setIsDrawing(false);
    saveState();
  };

  const handleMark = () => {
    if (selection && onMark) {
      onMark(selection.text);
      window.getSelection().removeAllRanges();
      setSelection(null);
    }
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || ''}</ReactMarkdown>
      </div>

      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="absolute top-0 left-0 w-full h-full z-10"
        style={{ 
          pointerEvents: isDrawingMode ? 'auto' : 'none',
          cursor: isDrawingMode ? 'crosshair' : 'auto' 
        }}
      />

      <AnimatePresence>
        {selection && onMark && !isDrawingMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            style={{
              position: 'fixed',
              top: selection.top,
              left: selection.left,
              transform: 'translateX(-50%)',
              zIndex: 1000,
            }}
          >
            <button
              onClick={handleMark}
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg shadow-xl hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              <Highlighter className="w-4 h-4" />
              Mark
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-indigo-600" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default MarkdownRenderer;
