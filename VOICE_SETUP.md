# Voice-to-Text Setup Guide

## Overview
The AMI chatbot now includes voice-to-text functionality using Groq's Whisper Large V3 Turbo model. When users click the microphone icon, they can speak their message, and it will be automatically transcribed and sent.

## Features
- 🎙️ **Voice Recording**: Click the mic button to start/stop recording
- 🌊 **Animated Wave Visualization**: Beautiful wave animation during recording
- 🎨 **Dynamic UI**: Colors change based on Study Mode (orange/purple theme)
- ⚡ **Fast Transcription**: Uses Groq's optimized Whisper model
- 🔄 **Smooth Transitions**: Elegant animations between states

## Setup Instructions

### 1. Get Your Groq API Key
1. Go to [Groq Console](https://console.groq.com/)
2. Sign up for a free account or log in
3. Navigate to the **API Keys** section
4. Click **Create API Key**
5. Copy the generated API key

### 2. Configure the API Key
1. Create a `.env` file in the root directory (it's already created for you)
2. Add your Groq API key:
   ```
   VITE_GROQ_API_KEY=gsk_your_actual_api_key_here
   ```
3. **Important**: The `.env` file is already in `.gitignore` so your API key won't be committed to version control

### 3. Test the Feature
1. Start your development server: `npm run dev`
2. Open the application in your browser
3. Click the microphone button (🎙️) next to the send button
4. Allow microphone permissions when prompted
5. Speak your message - you'll see the animated wave visualization
6. Click the mic button again to stop recording
7. Your speech will be automatically transcribed and sent as a message

## How It Works

### User Experience
1. **Idle State**: Microphone icon is visible and ready
2. **Recording State**: 
   - Icon transforms into animated wave visualization that responds to your voice level
   - Waves are flat when silent, animated when you speak
   - Button background pulses with a glow effect
   - Colors adapt to current mode (orange for normal, purple for study mode)
3. **Processing**: Audio is sent to Groq's Whisper API for transcription
4. **Complete**: Transcribed text appears in the input field (doesn't auto-send)

### Technical Implementation
- **Audio Recording**: Uses browser's `MediaRecorder` API
- **Transcription**: Groq's Whisper Large V3 Turbo model
- **Animation**: Framer Motion for smooth transitions
- **State Management**: React hooks for recording state
- **Error Handling**: Graceful handling of permissions and API errors

## Browser Requirements
- Modern browsers with `MediaRecorder` support
- Microphone access permissions
- HTTPS connection (required for microphone access in production)

## Troubleshooting

### Common Issues
1. **"Could not access microphone"**
   - Check browser permissions
   - Ensure you're on HTTPS in production
   - Try refreshing and allowing permissions

2. **"Please configure your Groq API key"**
   - Make sure you've added your API key to the `.env` file
   - Verify the key is correct (starts with `gsk_`)
   - Restart your development server after adding the key

3. **"Failed to transcribe audio"**
   - Check your internet connection
   - Verify your Groq API key is valid
   - Check browser console for detailed error messages

### Browser Permissions
The first time a user clicks the microphone, the browser will request permission to access the microphone. Users must click "Allow" for the feature to work.

## Customization

### Changing Colors
The voice recording UI automatically adapts to the current theme:
- **Normal Mode**: Orange/amber colors
- **Study Mode**: Purple/indigo colors

### Adjusting Wave Animation
Modify `src/components/ui/VoiceWave.jsx` to customize:
- Number of wave bars (`waveCount`)
- Animation timing and patterns
- Colors and gradients

### Recording Settings
In `src/pages/Ami.jsx`, you can modify:
- Audio quality settings in `MediaRecorder`
- Transcription model (currently using `whisper-large-v3-turbo`)
- Error handling behavior

## Security Notes
- API keys should never be committed to version control
- In production, implement proper API key management
- Consider rate limiting and usage monitoring
- Ensure HTTPS for microphone access

## API Usage
- Model: `whisper-large-v3-turbo`
- Endpoint: `https://api.groq.com/openai/v1/audio/transcriptions`
- Format: Audio files are sent as WAV format
- Processing: Typically completes in 1-2 seconds

The voice-to-text feature is now fully integrated and ready to use!