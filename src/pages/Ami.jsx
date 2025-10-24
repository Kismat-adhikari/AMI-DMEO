import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, TrendingUp, BookOpen, Sparkles } from 'lucide-react';
import { GROQ_API_KEY } from '../config/groq';

// Import all the extracted components
import AnimatedBackground from '../components/ui/AnimatedBackground';
import Sidebar from '../components/chat/Sidebar';
import ChatHeader from '../components/chat/ChatHeader';
import ChatWindow from '../components/chat/ChatWindow';
import MessageInput from '../components/chat/MessageInput';
import WelcomePrompts from '../components/chat/WelcomePrompts';

// Main Ami Component
const Ami = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [studyMode, setStudyMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [transcribedText, setTranscribedText] = useState('');
  const chatWindowRef = useRef(null);
  const audioChunks = useRef([]);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Clean up object URLs when component unmounts to prevent memory leaks
  useEffect(() => {
    return () => {
      // Clean up all object URLs from messages on unmount
      messages.forEach(message => {
        if (message.images) {
          message.images.forEach(image => {
            if (image.url && image.url.startsWith('blob:')) {
              URL.revokeObjectURL(image.url);
            }
          });
        }
      });
      
      // Stop recording and clean up media recorder on unmount
      if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        setIsRecording(false);
      }
    };
  }, []);
  
  // Stop recording when user navigates away or closes tab
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [mediaRecorder, isRecording]);

  const handleSendMessage = (text, images = [], attachments = []) => {
    // Mark that chat has started on first message
    if (!hasStartedChat) {
      setHasStartedChat(true);
    }

    // Process attachments to include file data for display
    const processedAttachments = attachments.map(att => ({
      id: att.id,
      name: att.name,
      size: att.size,
      type: att.type,
      // Keep the file object for potential future upload functionality
      file: att.file
    }));

    const userMessage = {
      id: messages.length + 1,
      text: text.trim(),
      isBot: false,
      time: 'Just now',
      images: images || [],
      attachments: processedAttachments || [],
    };
    setMessages([...messages, userMessage]);
    
    // Reset scroll state when user sends a message
    if (chatWindowRef.current && chatWindowRef.current.resetScrollState) {
      chatWindowRef.current.resetScrollState();
    }

    setIsTyping(true);
    
    setTimeout(() => {
      // Welcome message for first interaction, then detect special content
      let response;
      let content = null;
      
      // Check if files were sent
      const hasImages = images && images.length > 0;
      const hasAttachments = attachments && attachments.length > 0;
      
      if (messages.length === 1) {
        if (hasImages || hasAttachments) {
          response = "Hello! I'm Ami, your intelligent AI companion. I can see you've shared some files with me. I can help analyze images, documents, and answer questions about your attachments. How can I assist you with these files?";
        } else {
          response = "Hello! I'm Ami, your intelligent AI companion. I can help you with analysis, create interactive content, and answer your questions. Let me help you with your request.";
        }
      } else {
        if (hasImages || hasAttachments) {
          response = "I can see the files you've shared. In a real implementation, I would analyze these attachments and provide insights based on their content. What would you like me to help you with regarding these files?";
        } else {
          response = "I understand your question. I'm here to assist you with anything you need. This is a demo response - in a real implementation, I would provide intelligent, contextual responses to your queries.";
        }
      }

      if (text.toLowerCase().includes('stock') || text.toLowerCase().includes('chart')) {
        content = (
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-semibold text-cyan-400">Stock Chart Preview</span>
            </div>
            <div className="h-48 bg-slate-950/50 rounded-lg border border-slate-700/30 flex items-center justify-center">
              <p className="text-slate-500 text-sm">Chart visualization would appear here</p>
            </div>
          </div>
        );
        response = "Here's a preview of the stock chart. In production, this would show real-time data with interactive visualizations.";
      } else if (text.toLowerCase().includes('quiz') || text.toLowerCase().includes('mcq')) {
        content = (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-semibold text-purple-400">Multiple Choice Quiz</span>
            </div>
            <div className="space-y-2">
              {['Option A', 'Option B', 'Option C', 'Option D'].map((opt, i) => (
                <button key={i} className="w-full p-3 bg-slate-950/50 border border-slate-700/30 rounded-lg text-left hover:border-cyan-500/50 hover:bg-slate-800/30 transition-all text-sm">
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
        response = "Here's an interactive quiz! Select an answer to continue.";
      } else if (text.toLowerCase().includes('flashcard')) {
        content = (
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-pink-400" />
              <span className="text-sm font-semibold text-pink-400">Flashcard</span>
            </div>
            <div className="h-40 bg-gradient-to-br from-slate-900 to-slate-950 rounded-lg border border-slate-700/30 flex items-center justify-center p-6">
              <p className="text-center text-slate-300">Tap to flip</p>
            </div>
          </div>
        );
        response = "Here's your flashcard! Click it to reveal the answer.";
      }

      const botMessage = {
        id: messages.length + 2,
        text: response,
        isBot: true,
        time: 'Just now',
        content: content,
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleStudyMode = () => {
    setStudyMode(!studyMode);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      // Set up audio analysis for wave animation
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      analyserRef.current = analyser;
      
      // Start monitoring audio levels
      const monitorAudioLevel = () => {
        if (!analyserRef.current) return;
        
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        
        // Calculate average volume
        const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        const normalizedLevel = Math.min(average / 100, 1); // Normalize to 0-1, adjusted sensitivity
        
        setAudioLevel(normalizedLevel);
        
        // Continue monitoring while recording
        animationFrameRef.current = requestAnimationFrame(monitorAudioLevel);
      };
      
      audioChunks.current = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };
      
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        await transcribeAudio(audioBlob);
        
        // Stop audio monitoring
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        
        // Stop all tracks to free up the microphone
        stream.getTracks().forEach(track => track.stop());
        audioContext.close();
      };
      
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      
      // Start audio level monitoring
      monitorAudioLevel();
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
      setAudioLevel(0);
      
      // Stop audio monitoring
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  const transcribeAudio = async (audioBlob) => {
    try {
      // Check if API key is configured
      if (!GROQ_API_KEY || GROQ_API_KEY === 'your_groq_api_key_here') {
        alert('Please configure your Groq API key in the .env file (VITE_GROQ_API_KEY)');
        return;
      }
      
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.wav');
      formData.append('model', 'whisper-large-v3-turbo');
      
      const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Transcription failed');
      }
      
      const data = await response.json();
      const transcribedText = data.text;
      
      if (transcribedText && transcribedText.trim()) {
        // Set the transcribed text in the input field instead of auto-sending
        setTranscribedText(transcribedText.trim());
      }
      
    } catch (error) {
      console.error('Error transcribing audio:', error);
      alert('Failed to transcribe audio. Please try again.');
    }
  };

  const handleVoiceRecord = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className={`min-h-screen flex flex-col text-white overflow-hidden transition-all duration-1000 ${
      studyMode 
        ? 'bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900' 
        : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
    }`}>
      <AnimatedBackground studyMode={studyMode} />

      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 flex flex-col min-w-0 relative h-screen overflow-hidden">
          {/* Enhanced Header */}
          <ChatHeader 
            sidebarOpen={sidebarOpen} 
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            studyMode={studyMode}
          />

          {/* Chat Container - takes remaining space */}
          <div className="flex-1 relative flex flex-col overflow-hidden">
            {!hasStartedChat ? (
              /* Landing State - Centered Input */
              <motion.div
                className="flex-1 flex items-center justify-center px-6"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-full max-w-2xl">
                  {/* Enhanced Title Section */}
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-12"
                  >
                    <motion.div
                      className="inline-flex items-center gap-4 mb-6"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden transition-all duration-1000 ${
                        studyMode 
                          ? 'bg-gradient-to-br from-purple-400 via-indigo-500 to-blue-500 shadow-purple-500/30' 
                          : 'bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 shadow-orange-500/30'
                      }`}>
                        <motion.div
                          className={`absolute inset-0 transition-all duration-1000 ${
                            studyMode 
                              ? 'bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-400' 
                              : 'bg-gradient-to-br from-rose-500 via-orange-500 to-amber-400'
                          }`}
                          animate={{
                            rotate: [0, 360],
                          }}
                          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        />
                        <Sparkles className="w-8 h-8 text-white relative z-10" />
                      </div>
                      <div className="text-left">
                        <h1 className={`text-5xl font-bold bg-clip-text text-transparent transition-all duration-1000 ${
                          studyMode 
                            ? 'bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400' 
                            : 'bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400'
                        }`}>
                          Ami
                        </h1>
                        <p className={`font-medium transition-all duration-1000 ${
                          studyMode 
                            ? 'text-purple-300/80' 
                            : 'text-orange-300/80'
                        }`}>
                          {studyMode ? 'Deep Learning Mode Active' : 'Your Intelligent Study Companion'}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>

                  <AnimatePresence mode="wait">
                    <WelcomePrompts studyMode={studyMode} />
                  </AnimatePresence>
                  
                  {/* Suggested prompts */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8"
                  >
                    {[
                      { text: "Create a quiz about biology", icon: Brain },
                      { text: "Analyze AAPL stock performance", icon: TrendingUp },
                      { text: "Make flashcards for Spanish vocabulary", icon: BookOpen },
                      { text: "Help me understand quantum physics", icon: Sparkles },
                    ].map((suggestion, idx) => (
                      <motion.button
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + idx * 0.1 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSendMessage(suggestion.text)}
                        className={`p-4 bg-slate-800/40 backdrop-blur-xl border rounded-xl text-left hover:shadow-lg transition-all duration-700 group ${
                          studyMode 
                            ? 'border-purple-500/20 hover:border-purple-400/50 hover:bg-purple-900/20 hover:shadow-purple-500/10' 
                            : 'border-orange-500/20 hover:border-orange-400/50 hover:bg-orange-900/20 hover:shadow-orange-500/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <suggestion.icon className={`w-5 h-5 flex-shrink-0 transition-colors duration-700 ${
                            studyMode 
                              ? 'text-purple-400/70 group-hover:text-purple-300' 
                              : 'text-orange-400/70 group-hover:text-orange-300'
                          }`} />
                          <span className="text-slate-200 group-hover:text-white transition-colors text-sm">
                            {suggestion.text}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                  
                  <MessageInput 
                    onSend={handleSendMessage} 
                    onStudyMode={handleStudyMode} 
                    onVoiceRecord={handleVoiceRecord}
                    studyMode={studyMode} 
                    isRecording={isRecording}
                    audioLevel={audioLevel}
                    transcribedText={transcribedText}
                    onTranscribedTextUsed={() => setTranscribedText('')}
                    isLandingMode={true} 
                  />
                </div>
              </motion.div>
            ) : (
              /* Chat Mode - Normal Layout */
              <motion.div
                className="flex-1 relative flex flex-col overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {/* Chat Window */}
                <ChatWindow ref={chatWindowRef} messages={messages} isTyping={isTyping} studyMode={studyMode} />

                {/* Message Input - Fixed at bottom */}
                <div className="flex-shrink-0">
                  <MessageInput 
                    onSend={handleSendMessage} 
                    onStudyMode={handleStudyMode} 
                    onVoiceRecord={handleVoiceRecord}
                    studyMode={studyMode} 
                    isRecording={isRecording}
                    audioLevel={audioLevel}
                    transcribedText={transcribedText}
                    onTranscribedTextUsed={() => setTranscribedText('')}
                    isLandingMode={false} 
                  />
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Ami;