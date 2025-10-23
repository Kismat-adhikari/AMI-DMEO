import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, File, Image as ImageIcon, X } from 'lucide-react';
import { createPortal } from 'react-dom';

// Enhanced Message Bubble with Rich Content Support
const MessageBubble = ({ message, isBot }) => {
  const [imagePreviewIndex, setImagePreviewIndex] = useState(null);

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Helper function to get file type icon color
  const getFileTypeColor = (type) => {
    if (type.startsWith('image/')) return 'text-cyan-400';
    if (type.includes('pdf')) return 'text-red-400';
    if (type.includes('document') || type.includes('word')) return 'text-blue-400';
    if (type.includes('spreadsheet') || type.includes('excel')) return 'text-green-400';
    return 'text-slate-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className={`flex gap-4 ${isBot ? 'justify-start' : 'justify-end'} group`}
    >
      {isBot && (
        <motion.div
          className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg relative overflow-hidden"
          whileHover={{ scale: 1.05, rotate: 5 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500"
            animate={{
              rotate: [0, 360],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <Sparkles className="w-5 h-5 text-white relative z-10" />
          <motion.div
            className="absolute inset-0 bg-white/20"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      )}

      <div
        className={`max-w-[75%] rounded-2xl backdrop-blur-xl relative overflow-hidden ${
          // Adjust padding based on content type
          (message.images && message.images.length > 0) || (message.attachments && message.attachments.length > 0)
            ? 'p-3' // Less padding for messages with attachments
            : 'p-4' // Normal padding for text-only messages
        } ${
          isBot
            ? 'bg-slate-900/90 border border-slate-700/50 text-slate-100 shadow-xl shadow-slate-900/50'
            : 'bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white shadow-xl shadow-cyan-500/30'
        }`}
      >
        {/* Content Container for Charts/MCQ/Flashcards and Attachments */}
        <div className="space-y-3">
          {message.content && (
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
              {message.content}
            </div>
          )}
          
          {/* Unified Attachments Section */}
          {((message.images && message.images.length > 0) || (message.attachments && message.attachments.length > 0)) && (
            <div className="mb-3 space-y-3">
              {/* Image Gallery - Grid Layout */}
              {message.images && message.images.length > 0 && (
                <div className={`grid gap-2 ${
                  message.images.length === 1 ? 'grid-cols-1 max-w-xs' :
                  message.images.length === 2 ? 'grid-cols-2 max-w-sm' :
                  message.images.length === 3 ? 'grid-cols-3 max-w-md' :
                  'grid-cols-3 max-w-lg'
                }`}>
                  {message.images.map((src, i) => (
                    <motion.div
                      key={`image-${i}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative overflow-hidden rounded-lg cursor-zoom-in bg-black/20 ${
                        message.images.length === 1 ? 'aspect-square max-h-48' :
                        message.images.length === 2 ? 'aspect-square h-24' :
                        'aspect-square h-20'
                      }`}
                      onClick={() => setImagePreviewIndex(i)}
                    >
                      <img
                        src={src}
                        alt={`Image ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
                      <div className="absolute top-1 right-1 p-1 bg-black/60 rounded text-white/90">
                        <ImageIcon className="w-2.5 h-2.5" />
                      </div>
                      {message.images.length > 1 && (
                        <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/60 rounded text-xs text-white/90 font-medium">
                          {i + 1}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}

              {/* File Attachments - Keep existing layout for files */}
              {message.attachments && message.attachments.length > 0 && (
                <div className="space-y-2">
                  {message.attachments.map((att, i) => (
                    <motion.div
                      key={`file-${i}`}
                      whileHover={{ scale: 1.01 }}
                      className={`flex items-center gap-3 p-2.5 rounded-lg border ${
                        isBot 
                          ? 'bg-slate-800/50 border-slate-700/30' 
                          : 'bg-black/20 border-white/10'
                      }`}
                    >
                      <div className={`w-12 h-12 flex items-center justify-center rounded-md ${
                        isBot ? 'bg-slate-700/50' : 'bg-black/30'
                      } ${getFileTypeColor(att.type)} flex-shrink-0`}>
                        <File className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{att.name}</p>
                        <p className={`text-xs ${isBot ? 'text-slate-400' : 'text-white/70'}`}>
                          {formatFileSize(att.size)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Message text - only show if there's actual text content */}
          {message.text && message.text.trim() && (
            <p className="text-sm leading-relaxed">{message.text}</p>
          )}
        </div>
        
        <span className="text-xs opacity-60 mt-2 block">{message.time}</span>
        
        {/* Glassmorphism effect */}
        {!isBot && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            initial={false}
          />
        )}
      </div>

      {!isBot && (
        <motion.div 
          className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center flex-shrink-0 shadow-lg"
          whileHover={{ scale: 1.05, rotate: -5 }}
        >
          <span className="text-sm font-semibold text-white">Y</span>
        </motion.div>
      )}

      {/* Image Preview Modal */}
      {imagePreviewIndex !== null && message.images && message.images[imagePreviewIndex] && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative max-w-[90vw] max-h-[90vh] p-4">
            <img
              src={message.images[imagePreviewIndex]}
              alt={`Preview ${imagePreviewIndex + 1}`}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setImagePreviewIndex(null)}
              className="absolute top-6 right-6 p-2 bg-black/70 hover:bg-black/90 rounded-full text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div
            className="absolute inset-0"
            onClick={() => setImagePreviewIndex(null)}
          />
        </div>,
        document.body
      )}
    </motion.div>
  );
};

export default MessageBubble;