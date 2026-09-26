import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

function Chat() {
  const { projectId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const fetchChat = async () => {
    try {
      const res = await API.get(`/chat/${projectId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMessages(res.data.messages || []);
    } catch (err) {
      toast.error('Failed to load chat');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChat();
  }, [projectId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    try {
      const res = await API.post(
        '/chat',
        { projectId, text },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setMessages(res.data.messages);
      setText('');
    } catch (err) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading chat...</div>;

  return (
    <div className="container mt-4" style={{ maxWidth: '700px' }}>
      <h2 className="mb-4">Project Chat</h2>
      <div
        className="border rounded p-3 mb-3"
        style={{ height: '400px', overflowY: 'auto', backgroundColor: '#f8f9fa' }}
      >
        {messages.length === 0 ? (
          <p className="text-muted">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.sender?._id === user.userId || msg.sender === user.userId;
            return (
              <div
                key={idx}
                className={`d-flex mb-2 ${isMe ? 'justify-content-end' : 'justify-content-start'}`}
              >
                <div
                  className={`p-2 rounded ${isMe ? 'bg-primary text-white' : 'bg-white border'}`}
                  style={{ maxWidth: '70%' }}
                >
                  {!isMe && (
                    <div className="small fw-bold">{msg.sender?.name || 'User'}</div>
                  )}
                  <div>{msg.text}</div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSend} className="d-flex gap-2">
        <input
          type="text"
          className="form-control"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" disabled={sending}>
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;