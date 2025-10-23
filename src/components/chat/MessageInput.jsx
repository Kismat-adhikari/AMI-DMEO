import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Plus, X, Brain, Image, File, TrendingUp, BookOpen, Zap } from 'lucide-react';

// Enhanced Message Input
const MessageInput = ({ onSend, isLandingMode = false }) => {
  const [input, setInput] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const [menuStyle, setMenuStyle] = useState(null);

  // useLayoutEffect so we can measure DOM synchronously after render
  useLayoutEffect(() => {
    if (!menuOpen) {
      setMenuStyle(null);
      return;
    }

    function updatePosition() {
      const btn = btnRef.current;
      const menu = menuRef.current;
      if (!btn || !menu) return;

      const btnRect = btn.getBoundingClientRect();
      const menuRect = menu.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      const menuHeight = menuRect.height || 140;
      const menuWidth = menuRect.width || 180;

      // prefer above
      let top = btnRect.top - menuHeight - 8;
      // if not enough space, place below (but prefer above)
      if (top < 8) top = btnRect.bottom + 8;

      let left = btnRect.left + btnRect.width / 2 - menuWidth / 2;
      left = Math.max(8, Math.min(left, viewportWidth - menuWidth - 8));

      setMenuStyle({ top: `${top}px`, left: `${left}px` });
    }

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [menuOpen]);

  const handleSend = () => {
    if (input.trim() || (images && images.length > 0) || (attachments && attachments.length > 0)) {
      // Send the message with current images and attachments
      onSend(input, images || [], attachments || []);
      setInput('');
      
      // Clear the arrays but don't revoke object URLs yet
      // The URLs are still needed for the message display
      setImages([]);
      setAttachments([]);
    }
  };

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [images, setImages] = useState([]);
  const [previewIndex, setPreviewIndex] = useState(null);
  const fileAttachRef = useRef(null);
  const [attachments, setAttachments] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragKind, setDragKind] = useState(null); // 'image' | 'file' | 'mixed'
  const dragCounter = useRef(0);

  const detectDragKind = (items) => {
    if (!items || items.length === 0) return null;
    let hasImage = false;
    let hasFile = false;
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      // item may be a DataTransferItem
      const type = it.type || (it.kind === 'file' && it.type) || '';
      if (type && type.startsWith('image/')) hasImage = true;
      else if (it.kind === 'file' || type) hasFile = true;
    }
    if (hasImage && hasFile) return 'mixed';
    if (hasImage) return 'image';
    if (hasFile) return 'file';
    return 'file';
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const kind = detectDragKind(e.dataTransfer.items);
    setDragKind(kind);
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    const kind = detectDragKind(e.dataTransfer.items);
    setDragKind(kind);
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // only clear dragging if leaving the container
    setIsDragging(false);
    setDragKind(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const dt = e.dataTransfer;
    const files = Array.from(dt.files || []);
    if (files.length) {
      const imageFiles = files.filter((f) => f.type.startsWith('image/'));
      const otherFiles = files.filter((f) => !f.type.startsWith('image/'));
      if (imageFiles.length) {
        const urls = imageFiles.map((f) => URL.createObjectURL(f));
        setImages((prev) => [...prev, ...urls]);
      }
      if (otherFiles.length) {
        const items = otherFiles.map((f) => ({
          id: Math.random().toString(36).slice(2, 9),
          name: f.name,
          size: f.size,
          type: f.type,
          file: f,
        }));
        setAttachments((prev) => [...prev, ...items]);
      }
    }
    setDragKind(null);
  };

  // global drag handlers so drop works anywhere on the page
  useEffect(() => {
    const onWindowDragEnter = (e) => {
      e.preventDefault();
      dragCounter.current += 1;
      const kind = detectDragKind(e.dataTransfer.items);
      setDragKind(kind);
      setIsDragging(true);
    };

    const onWindowDragOver = (e) => {
      e.preventDefault();
      const kind = detectDragKind(e.dataTransfer.items);
      setDragKind(kind);
    };

    const onWindowDragLeave = (e) => {
      e.preventDefault();
      dragCounter.current -= 1;
      if (dragCounter.current <= 0) {
        dragCounter.current = 0;
        setIsDragging(false);
        setDragKind(null);
      }
    };

    const onWindowDrop = (e) => {
      e.preventDefault();
      dragCounter.current = 0;
      handleDrop(e);
    };

    window.addEventListener('dragenter', onWindowDragEnter);
    window.addEventListener('dragover', onWindowDragOver);
    window.addEventListener('dragleave', onWindowDragLeave);
    window.addEventListener('drop', onWindowDrop);

    return () => {
      window.removeEventListener('dragenter', onWindowDragEnter);
      window.removeEventListener('dragover', onWindowDragOver);
      window.removeEventListener('dragleave', onWindowDragLeave);
      window.removeEventListener('drop', onWindowDrop);
    };
  }, []);

  const handleKeyPress = (e) => {
    // handle Enter to send (preserve Shift+Enter for newline)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize logic: set height to scrollHeight, with a max clamp
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;

    // reset height to compute correct scrollHeight
    ta.style.height = 'auto';
    const maxHeight = 160; // px - roughly 4-6 lines depending on line-height
    const newHeight = Math.min(ta.scrollHeight, maxHeight);
    ta.style.height = newHeight + 'px';
  }, [input]);

  // Cleanup object URLs only on component unmount
  useEffect(() => {
    // cleanup on unmount: revoke any object URLs
    return () => {
      if (images && images.length) {
        images.forEach((u) => URL.revokeObjectURL(u));
      }
    };
  }, []); // Remove dependency on images array

  return (
    <div className={`${isLandingMode ? 'p-0' : 'p-4 border-t border-slate-800/50 bg-slate-950/80 backdrop-blur-2xl'}`}>
      <div className={`flex gap-3 items-end ${isLandingMode ? 'max-w-2xl' : 'max-w-4xl'} mx-auto`}>
        {/* Plus button (left of typing field) */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMenuOpen((s) => !s)}
            ref={btnRef}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="p-4 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl text-slate-400 hover:text-white hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all relative z-20"
          >
            <motion.div
              animate={{ rotate: menuOpen ? 45 : 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              {/* swap icons visually: Plus when closed, X when open */}
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
            </motion.div>
          </motion.button>

          {/* Backdrop to close the menu when clicking outside */}
          {menuOpen && (
            <div
              className="fixed inset-0 z-10"
              onClick={() => setMenuOpen(false)}
            />
          )}

          {/* Tooltip menu rendered into document.body via portal so it's always on top */}
          {menuOpen && createPortal(
            <AnimatePresence>
              <motion.div
                ref={menuRef}
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                style={menuStyle || {}}
                className="fixed bg-slate-900/95 backdrop-blur-2xl border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50 min-w-[180px]"
              >
                <div className="py-2">
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
                  >
                    <Brain className="w-4 h-4 text-purple-400" />
                    Study Mode
                  </button>
                  <button
                    onClick={() => {
                      // open the hidden file input to pick an image
                      if (fileInputRef && fileInputRef.current) fileInputRef.current.click();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
                  >
                    <Image className="w-4 h-4 text-cyan-400" />
                    Insert Image
                  </button>
                  <button
                    onClick={() => {
                      if (fileAttachRef && fileAttachRef.current) fileAttachRef.current.click();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
                  >
                    <File className="w-4 h-4 text-emerald-400" />
                    Attach File
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>,
            document.body
          )}
        </div>

        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex-1 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl ${isLandingMode ? 'p-4' : 'p-3'} focus-within:border-cyan-500/50 focus-within:shadow-lg focus-within:shadow-cyan-500/20 transition-all relative`}
        >
          {/* Drag overlay */}
          {isDragging && (
            <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
              <div className="flex flex-col items-center gap-2 bg-gradient-to-br from-slate-900/80 to-slate-800/70 border border-slate-700/50 rounded-xl px-6 py-4 backdrop-blur-lg">
                <div className="flex items-center gap-3">
                  <div style={{ transform: 'rotate(-12deg)' }}>
                    {dragKind === 'image' ? (
                      <Image className="w-6 h-6 text-cyan-400" />
                    ) : (
                      <File className="w-6 h-6 text-emerald-400" />
                    )}
                  </div>
                  <div className="text-center">
                    <div className="text-xl leading-none" style={{ fontFamily: '"Bebas Neue", system-ui, sans-serif', letterSpacing: '0.06em' }}>DROP IT HERE</div>
                    <div className="text-xs text-slate-400 mt-1" style={{ fontFamily: '"Space Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, monospace' }}>
                      {dragKind === 'image' ? 'image(s) — release to attach' : dragKind === 'file' ? 'file(s) — release to attach' : 'files or images — release to attach'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Hidden file input for image insertion */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              if (files.length) {
                const urls = files.map((f) => URL.createObjectURL(f));
                // append to existing images
                setImages((prev) => [...prev, ...urls]);
              }
              // close menu if open
              setMenuOpen(false);
            }}
          />

          {/* Hidden general file attachment picker */}
          <input
            ref={fileAttachRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              if (files.length) {
                const items = files.map((f) => ({
                  id: Math.random().toString(36).slice(2, 9),
                  name: f.name,
                  size: f.size,
                  type: f.type,
                  file: f,
                }));
                setAttachments((prev) => [...prev, ...items]);
              }
            }}
          />

          {/* Inline image previews (flow left-aligned) */}
          {images && images.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-2">
              {images.map((src, i) => (
                <div key={src} className="relative rounded-md overflow-hidden bg-black/20 w-[140px] h-[140px]">
                  <img
                    src={src}
                    alt={`preview-${i}`}
                    className="w-full h-full object-cover cursor-zoom-in block"
                    onClick={() => setPreviewIndex(i)}
                  />
                  <button
                    onClick={() => {
                      // remove this image
                      URL.revokeObjectURL(src);
                      setImages((prev) => prev.filter((u, idx) => idx !== i));
                      // if preview modal open was this image, close it
                      if (previewIndex === i) setPreviewIndex(null);
                    }}
                    aria-label={`Remove image ${i + 1}`}
                    className="absolute top-1 right-1 bg-black/60 rounded-full p-1 text-white hover:bg-black/80"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Attachments (files) */}
          {attachments && attachments.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-2 items-center">
              {attachments.map((att) => (
                <div key={att.id} className="flex items-center gap-2 bg-slate-900/60 border border-slate-700/40 rounded-md px-2 py-1 text-xs">
                  <div className="w-5 h-5 flex items-center justify-center text-slate-300">
                    {/* simple file icon */}
                    <File className="w-4 h-4" />
                  </div>
                  <div className="max-w-[160px] truncate">{att.name}</div>
                  <button
                    onClick={() => setAttachments((prev) => prev.filter((a) => a.id !== att.id))}
                    className="ml-1 text-slate-400 hover:text-white"
                    aria-label={`Remove ${att.name}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={isLandingMode ? "Message Ami..." : "Ask Ami anything... (charts, quizzes, flashcards & more)"}
            className={`w-full bg-transparent text-white placeholder-slate-500 outline-none resize-none leading-relaxed transition-all duration-150 ease-in-out px-2 max-h-[160px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700/50 scrollbar-track-transparent ${isLandingMode ? 'text-base py-3' : 'text-sm py-2'}`}
            rows={1}
            style={{ overflowY: 'auto' }}
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          disabled={!input.trim() && (!images || images.length === 0) && (!attachments || attachments.length === 0)}
          className="p-4 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl text-white hover:shadow-2xl hover:shadow-cyan-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
        >
          <Send className="w-5 h-5 relative z-10" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-4 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl text-slate-400 hover:text-white hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
        >
          <Mic className="w-5 h-5" />
        </motion.button>
      </div>
      
      {/* Quick Actions */}
      {/* Fullscreen image preview modal */}
      {previewIndex !== null && images && images[previewIndex] && createPortal(
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80" onClick={() => setPreviewIndex(null)} />
          <div className="relative max-w-[90vw] max-h-[90vh] p-4 lg:max-w-[800px] lg:max-h-[80vh]">
            <img src={images[previewIndex]} alt={`full-preview-${previewIndex}`} className="w-full h-auto max-h-[80vh] lg:max-h-[72vh] object-contain rounded shadow-xl" />
            <button
              onClick={() => setPreviewIndex(null)}
              className="absolute top-6 right-6 lg:top-12 lg:right-8 bg-black/70 rounded-full p-2 text-white hover:bg-black/90"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>,
        document.body
      )}
      {/* Global drop overlay (portal) */}
      {isDragging && createPortal(
        <div className="fixed inset-0 z-60 flex items-center justify-center pointer-events-none">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative z-70 flex items-center gap-6 bg-slate-900/80 border border-slate-700/50 rounded-2xl px-8 py-6">
            <div className="flex items-center gap-3">
              <div style={{ transform: 'rotate(-12deg)' }}>
                <Image className="w-8 h-8 text-cyan-400" />
              </div>
              <div style={{ transform: 'rotate(12deg)' }}>
                <File className="w-8 h-8 text-emerald-400" />
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl text-white" style={{ fontFamily: '"Bebas Neue", system-ui, sans-serif', letterSpacing: '0.03em' }}>DROP TO SHARE</div>
              <div className="text-sm text-slate-300 mt-1" style={{ fontFamily: '"Space Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, monospace' }}>
                {dragKind === 'image' ? 'image(s) • release to add' : dragKind === 'file' ? 'file(s) • release to add' : 'images or files • release to add'}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
      {!isLandingMode && (
        // hidden on mobile and small tablets (visible only from md breakpoint and up)
        <div className={`hidden md:flex gap-2 mt-3 mx-auto flex-wrap justify-center ${isLandingMode ? 'max-w-2xl' : 'max-w-4xl'}`}>
          {[
            { icon: TrendingUp, label: 'Stock Chart' },
            { icon: Brain, label: 'Quiz Me' },
            { icon: BookOpen, label: 'Flashcards' },
            { icon: Zap, label: 'Quick Answer' },
          ].map((action, idx) => (
            <motion.button
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl text-slate-400 hover:text-white hover:border-cyan-500/50 text-xs font-medium transition-all flex items-center gap-2 group flex-shrink-0"
            >
              <action.icon className="w-3.5 h-3.5 group-hover:text-cyan-400 transition-colors" />
              {action.label}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageInput;