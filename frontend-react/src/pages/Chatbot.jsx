import { useState, useRef, useEffect } from 'react';
import { useData } from '../context/DataContext';
import Topbar from '../components/Topbar';
import '../styles/chatbot.css';

export default function Chatbot() {
  const { inventory } = useData();
  const [messages, setMessages] = useState([
    {
      role: 'model',
      content: 'Halo! Saya SianAI, asisten RAG kebudayaan Ulos dan penasihat usaha Anda. Ada yang bisa saya bantu hari ini?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend) => {
    const queryText = textToSend || input;
    if (!queryText.trim()) return;

    if (!textToSend) setInput('');

    const userMsg = { role: 'user', content: queryText };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/advisor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryText,
          history: messages.slice(1).map(msg => ({
            role: msg.role === 'model' ? 'model' : 'user',
            content: msg.content
          }))
        })
      });

      const data = await response.json();
      if (data.success) {
        setMessages((prev) => [...prev, { role: 'model', content: data.response }]);
      } else {
        setMessages((prev) => [...prev, { role: 'model', content: 'Maaf, terjadi kesalahan pada server.' }]);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          content: 'Koneksi ke backend Python terputus. Pastikan server FastAPI di port 8000 sudah berjalan.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main-content">
      <div className="page-wrapper">
        <Topbar searchPlaceholder="Tanya asisten adat..." />

        <div className="chatbot-layout chatbot-fullwidth">
          {/* Chat Window */}
          <div className="chat-window">
            <div className="chat-header">
              <div className="chat-title">
                <i className="fa-solid fa-robot text-gold"></i>
                <div>
                  <h3>Asisten Adat SianAI (RAG)</h3>
                  <span className="status-online">Online</span>
                </div>
              </div>
              <button
                className="btn-clear-chat"
                onClick={() => {
                  setMessages([
                    {
                      role: 'model',
                      content: 'Halo! Saya SianAI, asisten RAG kebudayaan Ulos dan penasihat usaha Anda. Ada yang bisa saya bantu hari ini?'
                    }
                  ]);
                }}
                title="Hapus Percakapan"
              >
                <i className="fa-solid fa-trash-can"></i> Reset
              </button>
            </div>

            <div className="messages-container">
              {messages.map((msg, index) => (
                <div key={index} className={`message-bubble-wrapper ${msg.role}`}>
                  <div className="message-avatar">
                    {msg.role === 'model' ? 'AI' : 'ME'}
                  </div>
                  <div className="message-bubble">
                    <p style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="message-bubble-wrapper model loading">
                  <div className="message-avatar">AI</div>
                  <div className="message-bubble">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <form
              className="chat-input-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <input
                type="text"
                placeholder="Tulis pertanyaan Anda tentang adat Batak & Ulos di sini..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
              <button type="submit" className="btn-send-message" disabled={loading || !input.trim()}>
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
