import React from "react";
import kb from "../../assets/data/petcare_knowledge.json";
import { buildIndex, searchBest, topK } from "../../utils/qaSearch";

const SUGGESTIONS = [
  "Vaccination schedule for puppies",
  "How often to bathe a dog?",
  "Safe human foods for cats",
  "Stop cat scratching furniture",
  "Heatstroke signs in dogs"
];

export default function ChatBotWidget() {
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState(() => {
    const saved = sessionStorage.getItem("pc_chat");
    return saved
      ? JSON.parse(saved)
      : [{ role: "bot", text: "Hi! I’m PetCare Assistant 🐾. Ask me anything about pet care." }];
  });
  const [loading, setLoading] = React.useState(false);
  const [theme, setTheme] = React.useState("light"); // light | dark
  const [index] = React.useState(() => buildIndex(kb));

  React.useEffect(() => {
    sessionStorage.setItem("pc_chat", JSON.stringify(messages));
  }, [messages]);

  function push(role, text) {
    setMessages(m => [...m, { role, text }]);
  }

  function answerWithKB(q) {
    const best = searchBest(index, q);
    if (best) {
      // gợi ý thêm 2 câu liên quan
      const related = topK(index, q, 3)
        .filter(x => x.id !== best.id)
        .slice(0, 2);
      const relBlock = related.length
        ? "\n\n**You might also ask:**\n" +
          related.map(r => `• ${r.question}`).join("\n")
        : "";
      return `**${best.question}**\n${best.answer}\n\n_Category: ${best.category}._${relBlock}`;
    }
    const t = q.toLowerCase();
    if (/(book|appointment|đặt lịch|schedule)/.test(t)) {
      return "You can book a vet in the **Nearby Vets** section on the homepage. Pick a doctor and press **Book**. Need a link? → **/vet**";
    }
    if (/(price|giá|cost)/.test(t)) {
      return "Prices are shown on each product card in the Shop. Add items to the cart to see totals and discounts.";
    }
    return "Sorry, I don’t have that in my knowledge base yet. Try rephrasing, or ask me about **nutrition, grooming, vaccines, training, emergencies,**…";
  }

  function onSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    push("user", text);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const reply = answerWithKB(text);
      push("bot", reply);
      setLoading(false);
    }, 350);
  }

  function quickAsk(q) {
    setInput(q);
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} };
      onSend(fakeEvent);
    }, 0);
  }

  const isDark = theme === "dark";

  return (
    <>
      {!open && (
        <button
          className="pc-chat-fab"
          onClick={() => setOpen(true)}
          title="Chat with PetCare Assistant"
          aria-label="Open chat"
        >
          💬
        </button>
      )}

      {open && (
        <div className={`pc-chat-panel shadow-lg ${isDark ? "pc-dark" : ""}`}>
          <div className="pc-chat-header">
            <div className="d-flex align-items-center gap-2">
              <strong>PetCare Assistant</strong>
              <span className="badge bg-success">AI</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setTheme(isDark ? "light" : "dark")}
                title="Toggle theme"
              >
                {isDark ? "☀️" : "🌙"}
              </button>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setOpen(false)}>✕</button>
            </div>
          </div>

          {/* Suggestions */}
          <div className="pc-suggestions">
            {SUGGESTIONS.map(s => (
              <button key={s} className="pc-chip" onClick={() => quickAsk(s)}>{s}</button>
            ))}
          </div>

          <div className="pc-chat-body">
            {messages.map((m, i) => (
              <MessageBubble key={i} role={m.role} text={m.text} dark={isDark} />
            ))}
            {loading && <div className="pc-typing">Assistant is typing…</div>}
          </div>

          <form className="pc-chat-input" onSubmit={onSend}>
            <input
              className="form-control"
              placeholder="Type your question… (Press Enter)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="btn btn-primary ms-2" type="submit" disabled={loading}>
              Send
            </button>
          </form>
        </div>
      )}

      <style>{`
        .pc-chat-fab{
          position:fixed; right:20px; bottom:20px; z-index:1100;
          width:56px; height:56px; border:none; border-radius:50%;
          background:#E67E22; color:#fff; font-size:22px;
          box-shadow:0 8px 22px rgba(0,0,0,.2);
        }
        .pc-chat-panel{
          position:fixed; right:20px; bottom:20px; z-index:1100;
          width:360px; max-height:72vh; background:#fff; border-radius:16px;
          display:flex; flex-direction:column; overflow:hidden; border:1px solid rgba(0,0,0,.08);
        }
        .pc-dark{ background:#121212; color:#eaeaea; border-color:#222; }
        .pc-chat-header{
          padding:10px 12px; background:#f7f7f9; display:flex; align-items:center; justify-content:space-between;
          border-bottom:1px solid rgba(0,0,0,.06);
        }
        .pc-dark .pc-chat-header{ background:#171717; border-color:#222; }
        .pc-suggestions{
          padding:8px 12px; display:flex; flex-wrap:wrap; gap:8px; background:#fff;
          border-bottom:1px solid rgba(0,0,0,.06);
        }
        .pc-dark .pc-suggestions{ background:#121212; border-color:#222; }
        .pc-chip{
          border:1px solid rgba(0,0,0,.15); background:#fff; color:#333; border-radius:20px; padding:6px 10px; font-size:12px;
        }
        .pc-dark .pc-chip{ background:#1b1b1b; color:#ddd; border-color:#333; }
        .pc-chat-body{ padding:12px; overflow-y:auto; flex:1; background:#fafafa; }
        .pc-dark .pc-chat-body{ background:#141414; }
        .pc-msg{ max-width:85%; padding:8px 12px; margin:6px 0; border-radius:14px; line-height:1.35; white-space:pre-wrap; }
        .pc-bot{ background:#ffffff; border:1px solid #eee; align-self:flex-start; }
        .pc-dark .pc-bot{ background:#1a1a1a; border-color:#2b2b2b; color:#eaeaea; }
        .pc-user{ background:#E67E22; color:#fff; align-self:flex-end; margin-left:auto; }
        .pc-typing{ font-size:12px; color:#666; margin-top:6px; }
        .pc-dark .pc-typing{ color:#aaa; }
        .pc-chat-input{ padding:10px; display:flex; border-top:1px solid rgba(0,0,0,.06); background:#fff; }
        .pc-dark .pc-chat-input{ background:#121212; border-color:#222; }
      `}</style>
    </>
  );
}

function MessageBubble({ role, text }) {
  const html = text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/_(.+?)_/g, "<em>$1</em>")
    .replace(/\n/g, "<br/>");

  return (
    <div className={`pc-msg ${role === "bot" ? "pc-bot" : "pc-user"}`}
         dangerouslySetInnerHTML={{ __html: html }} />
  );
}
