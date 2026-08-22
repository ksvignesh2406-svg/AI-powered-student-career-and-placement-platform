import { useEffect, useRef, useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { askCampusAI } from "../../utils/dashboardApi";

/**
 * Reusable AI Chat Panel for Faculty, Parent (and any future dashboard).
 * Props:
 *   - role: "faculty" | "parent"
 *   - userName: displayed in the greeting
 *   - context: object with dashboard-specific data sent as system context to Groq
 *   - accentColor: hex color string for header & user bubble (default: "#059669")
 *   - placeholder: input placeholder text
 *   - greeting: optional override for the first AI message
 *   - quickActions: array of { label, prompt } quick-action chips
 */
export default function AIChatPanel({
  role = "faculty",
  userName = "",
  context = {},
  accentColor = "#059669",
  placeholder = "Ask anything...",
  greeting,
  quickActions = [],
}) {
  const defaultGreeting =
    greeting ||
    (role === "faculty"
      ? `Hi ${userName || "Professor"}! I can help you draft student emails, analyse at-risk alerts, review leave requests, or plan your lecture schedule.`
      : `Hi ${userName || "there"}! I can explain your child's academic progress, attendance trends, fee status, or help you draft a message to the proctor.`);

  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: defaultGreeting },
  ]);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom on every new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const sendMessage = async (event) => {
    event?.preventDefault();
    const prompt = question.trim();
    if (!prompt || isLoading) return;

    setQuestion("");
    setMessages((prev) => [...prev, { role: "user", text: prompt }]);
    setIsLoading(true);

    try {
      const result = await askCampusAI(prompt, context);
      if (result.error) throw new Error(result.error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: result.response || "I could not generate a response." },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: err.message || "Unable to reach Campus AI right now. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const askQuick = (prompt) => {
    setQuestion(prompt);
    setTimeout(() => sendMessage({ preventDefault: () => {} }), 50);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "580px",
        background: "white",
        borderRadius: "18px",
        border: "1px solid #e2e8f0",
        overflow: "hidden",
        boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 20px",
          background: `linear-gradient(135deg, ${accentColor} 0%, #047857 100%)`,
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontWeight: "700",
          flexShrink: 0,
        }}
      >
        <MessageSquare size={18} />
        <span>Campus Assistant AI</span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: "11px",
            background: "rgba(255,255,255,0.15)",
            padding: "4px 10px",
            borderRadius: "999px",
            fontWeight: "600",
          }}
        >
          GROQ AI
        </span>
      </div>

      {/* Quick Action Chips */}
      {quickActions.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: "8px",
            padding: "10px 14px",
            borderBottom: "1px solid #f1f5f9",
            overflowX: "auto",
            flexShrink: 0,
            scrollbarWidth: "none",
          }}
        >
          {quickActions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={() => askQuick(action.prompt)}
              disabled={isLoading}
              style={{
                padding: "6px 12px",
                borderRadius: "999px",
                border: `1px solid ${accentColor}40`,
                background: `${accentColor}0f`,
                color: accentColor,
                fontSize: "11px",
                fontWeight: "700",
                whiteSpace: "nowrap",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}

      {/* Messages Area */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          padding: "16px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          background: "#f8fafc",
          scrollBehavior: "smooth",
        }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              alignSelf: message.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "82%",
              padding: "10px 14px",
              borderRadius:
                message.role === "user"
                  ? "16px 4px 16px 16px"
                  : "4px 16px 16px 16px",
              fontSize: "13px",
              lineHeight: "1.55",
              whiteSpace: "pre-wrap",
              background:
                message.role === "user" ? accentColor : "#ffffff",
              color: message.role === "user" ? "#ffffff" : "#1e293b",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              border: message.role === "assistant" ? "1px solid #f1f5f9" : "none",
            }}
          >
            {message.text}
          </div>
        ))}
        {isLoading && (
          <div
            style={{
              alignSelf: "flex-start",
              padding: "10px 14px",
              borderRadius: "4px 16px 16px 16px",
              background: "#ffffff",
              border: "1px solid #f1f5f9",
              fontSize: "13px",
              color: "#64748b",
              fontStyle: "italic",
            }}
          >
            Campus AI is thinking...
          </div>
        )}
      </div>

      {/* Input Area */}
      <form
        onSubmit={sendMessage}
        style={{
          display: "flex",
          padding: "12px 14px",
          background: "#ffffff",
          borderTop: "1px solid #e2e8f0",
          gap: "8px",
          flexShrink: 0,
        }}
      >
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: "10px",
            border: "1px solid #cbd5e1",
            outline: "none",
            fontSize: "13px",
            background: "#f8fafc",
          }}
        />
        <button
          type="submit"
          disabled={isLoading}
          style={{
            background: isLoading ? "#94a3b8" : accentColor,
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "0 16px",
            cursor: isLoading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s",
          }}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
