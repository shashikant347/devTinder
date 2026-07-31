import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { createSocketConnection } from "../utils/socket";

const Chat = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { connections } = useSelector((state) => state.connection);
  const recipient = useMemo(
    () => location.state?.user || connections.find((conn) => conn._id === id),
    [connections, id, location.state]
  );

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  const roomId = useMemo(() => {
    if (!user?._id || !id) return null;
    return [user._id, id].sort().join("_");
  }, [user?._id, id]);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed || !user || !roomId || !socketRef.current) return;

    const newMessage = {
      from: user._id,
      text: trimmed,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMessage]);
    socketRef.current.emit("sendMessage", {
      roomId,
      sender: user._id,
      text: trimmed,
      timestamp: newMessage.timestamp,
    });
    setMessage("");
  };

  useEffect(() => {
    if (!user?._id || !id || !roomId) return;

    const socket = createSocketConnection();
    socketRef.current = socket;

    const handleConnect = () => {
      socket.emit("joinChat", { userid: user._id, id });
    };

    const handleReceiveMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    const handleChatHistory = (history) => {
      setMessages(history || []);
    };

    socket.on("connect", handleConnect);
    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("chatHistory", handleChatHistory);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("chatHistory", handleChatHistory);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user?._id, id, roomId]);

  if (!recipient) {
    return (
      <div className="min-h-[calc(100vh-130px)] py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-outfit font-bold text-base-content mb-4">
            Chat not found
          </h1>
          <p className="text-base-content/60 mb-6">
            Choose a connected developer from your connections to start a chat.
          </p>
          <button
            onClick={() => navigate("/connections")}
            className="btn bg-gradient-to-r from-pink-500 to-purple-500 border-0 text-white"
          >
            View Connections
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-130px)] py-8 px-4">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-base-100/80 border border-base-content/10 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="avatar">
              <div className="w-16 h-16 rounded-full ring-2 ring-primary/30 overflow-hidden">
                <img
                  src={
                    recipient.photoUrl ||
                    "https://geographyandyou.com/images/user-profile.png"
                  }
                  alt={`${recipient.firstname} ${recipient.lastname}`}
                />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-outfit font-bold text-base-content">
                {recipient.firstname} {recipient.lastname}
              </h1>
              {recipient.skills?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {recipient.skills.slice(0, 4).map((skill, index) => (
                    <span
                      key={index}
                      className="badge badge-sm bg-primary/10 text-primary border-primary/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => navigate("/connections")}
            className="btn btn-sm btn-ghost text-base-content/70"
          >
            Back to Connections
          </button>
        </div>

        <div className="bg-base-100/90 border border-base-content/10 rounded-3xl shadow-2xl overflow-hidden">
          <div
            ref={scrollRef}
            className="max-h-[60vh] min-h-[50vh] overflow-y-auto p-5 flex flex-col gap-4"
          >
            {messages.length === 0 ? (
              <div className="text-center text-base-content/50 mt-10">
                Start the conversation by sending a message.
              </div>
            ) : (
              messages.map((msg, index) => {
                const isMine = msg.from === user._id;
                return (
                  <div
                    key={index}
                    className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-3xl p-4 shadow-sm ${
                        isMine
                          ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                          : "bg-base-200 text-base-content"
                      }`}
                    >
                      <p className="whitespace-pre-line break-words">{msg.text}</p>
                      <div className="text-[10px] text-base-content/40 text-right mt-2">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="border-t border-base-content/10 p-4 bg-base-200/80">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder={`Message ${recipient.firstname}...`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="input input-bordered input-lg flex-1 bg-base-100"
              />
              <button
                onClick={handleSend}
                className="btn bg-gradient-to-r from-pink-500 to-purple-500 border-0 text-white"
              >
                Send
              </button>
            </div>
            <p className="text-xs text-base-content/50 mt-2">
              Messages are stored locally in your browser. Socket or backend sync
              can be added later.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
