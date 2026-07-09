import { useEffect, useState } from "react";
import api from "../../api/axios";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState("");

  // ================= FETCH MESSAGES =================
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get("/contact"); // <-- singular
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // ================= UPDATE STATUS / REPLY =================
  const handleReply = async (id) => {
    if (!replyText.trim()) return alert("Reply cannot be empty");

    try {
      const res = await api.put(`/contact/${id}`, { // <-- singular
        status: "replied",
        replyMessage: replyText,
      });

      setMessages((prev) =>
        prev.map((msg) => (msg._id === id ? res.data.contact : msg))
      );
      setReplyText("");
      setReplyingId(null);
    } catch (err) {
      console.error("Failed to reply", err);
      alert("Failed to send reply");
    }
  };

  const toggleRead = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "unread" ? "read" : "unread";
      const res = await api.put(`/contact/${id}`, { status: newStatus }); // <-- singular
      setMessages((prev) =>
        prev.map((msg) => (msg._id === id ? res.data.contact : msg))
      );
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  if (loading) {
    return (
      <p className="text-purple-600 text-center mt-6">Loading messages...</p>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-purple-700 mb-6">
        Customer Messages ✉️
      </h2>

      {messages.length === 0 ? (
        <p className="text-green-500 font-semibold">No messages yet.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`bg-white/80 p-4 rounded-xl shadow-md ${
                msg.status === "unread" ? "border-l-4 border-pink-500" : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-purple-700">
                    {msg.name} ({msg.email})
                  </h3>
                  {msg.phone && (
                    <p className="text-sm text-gray-600">Phone: {msg.phone}</p>
                  )}
                  <p className="text-sm text-gray-700 mt-2">
                    <strong>Subject:</strong> {msg.subject}
                  </p>
                  <p className="text-gray-600 mt-1">{msg.message}</p>
                  {msg.replyMessage && (
                    <div className="mt-2 p-2 bg-purple-100 rounded">
                      <strong>Reply:</strong> {msg.replyMessage}
                    </div>
                  )}
                </div>

                <div className="ml-4 flex flex-col gap-2">
                  <button
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:opacity-90 text-sm"
                    onClick={() =>
                      setReplyingId(replyingId === msg._id ? null : msg._id)
                    }
                  >
                    Reply
                  </button>
                  <button
                    className={`px-2 py-1 rounded text-sm ${
                      msg.status === "unread"
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-gray-700"
                    }`}
                    onClick={() => toggleRead(msg._id, msg.status)}
                  >
                    {msg.status === "unread" ? "Mark Read" : "Mark Unread"}
                  </button>
                </div>
              </div>

              {replyingId === msg._id && (
                <div className="mt-3">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full p-2 rounded-lg border border-purple-300"
                    placeholder="Write your reply..."
                  ></textarea>
                  <button
                    onClick={() => handleReply(msg._id)}
                    className="mt-2 px-4 py-2 bg-pink-500 text-white rounded hover:opacity-90"
                  >
                    Send Reply
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Messages;
