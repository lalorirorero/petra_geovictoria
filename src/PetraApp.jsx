import { useState, useRef, useEffect } from "react";

const TABS = [
  { id: "cierre", label: "💡 Consejos de Cierre" },
  { id: "objeciones", label: "🎯 Practicar Objeciones" },
  { id: "frases", label: "📋 Frases y Guiones" },
  { id: "deal", label: "🔍 Analizar Deal" },
  { id: "demo", label: "🎯 Preparar Demo" },
  { id: "postventa", label: "✅ Post-Venta" },
];

const SUGGESTIONS = {
  objeciones: [
    { emoji: "🏭", text: "RH de manufactura que dice que ya tienen un sistema" },
    { emoji: "💸", text: "Director que dice que somos muy caros vs competencia" },
    { emoji: "😤", text: "Cliente que lleva 2 semanas sin responder mis mensajes" },
    { emoji: "🤔", text: '"Lo tengo que consultar con dirección general"' },
  ],
  cierre: [
    { emoji: "🎯", text: "¿Cómo aplico el termómetro Sandler?" },
    { emoji: "📋", text: "El prospecto dice que lo va a pensar" },
    { emoji: "🔄", text: "Cómo hacer una reversión de objeción" },
    { emoji: "✅", text: "Checklist de cierre con compromiso mutuo" },
  ],
  frases: [
    { emoji: "🗣️", text: "Frases para abrir una reunión en frío" },
    { emoji: "💬", text: "Cómo aplicar el contrato previo (ANOT)" },
    { emoji: "❓", text: "Preguntas del embudo del dolor" },
    { emoji: "📞", text: "Script para llamada de seguimiento" },
  ],
  deal: [
    { emoji: "📊", text: "Mi deal lleva 3 meses estancado" },
    { emoji: "👥", text: "No sé quién toma la decisión final" },
    { emoji: "💰", text: "El prospecto no me dice su presupuesto" },
    { emoji: "🔍", text: "Analizar si el deal está calificado (Dolor+Presupuesto+Decisión)" },
  ],
  demo: [
    { emoji: "🏗️", text: "Demo para empresa de manufactura con 500 empleados" },
    { emoji: "🏪", text: "Demo para retail con múltiples sucursales" },
    { emoji: "⚖️", text: "Cómo mostrar cumplimiento de reforma laboral" },
    { emoji: "🔧", text: "Qué módulos mostrar según el dolor del prospecto" },
  ],
  postventa: [
    { emoji: "🚀", text: "¿Cuáles son los pasos de implementación?" },
    { emoji: "📋", text: "¿Qué necesito del cliente para el onboarding?" },
    { emoji: "🤝", text: "Cómo hacer el handoff al equipo de CS" },
    { emoji: "📈", text: "Cómo pedir referidos al cliente nuevo" },
  ],
};

const PLACEHOLDERS = {
  objeciones: "Dime qué objeción quieres practicar o elige una sugerencia abajo...",
  cierre: "¿En qué etapa del cierre estás? ¿Qué necesitas?",
  frases: "¿Qué situación necesitas un guión o frase?",
  deal: "Cuéntame sobre tu deal para analizarlo...",
  demo: "¿Para qué tipo de empresa es tu demo?",
  postventa: "¿En qué paso del proceso post-venta necesitas ayuda?",
};

const SYSTEM_PROMPTS = {
  objeciones: `Eres Petra, coach de ventas de GeoVictoria. Tu rol es ayudar a los asesores comerciales a practicar y superar objeciones usando la metodología Sandler. GeoVictoria es un sistema de control de asistencia y gestión de personal con fichaje biométrico, GPS, app móvil, integración con nóminas y cumplimiento laboral.

Cuando el asesor te dé una objeción, debes:
1. Validar la objeción sin ponerse a la defensiva (reversión Sandler)
2. Hacer preguntas del embudo del dolor para descubrir el dolor real
3. Dar una respuesta consultiva, no un pitch
4. Sugerir frases concretas que puede usar
5. Ser directo, práctico y motivador

Usa frases como "¿Puedo preguntarte algo?" y técnicas como la reversión, el parafraseo y el termómetro Sandler. Responde siempre en español. Sé conciso y accionable.`,

  cierre: `Eres Petra, coach de ventas de GeoVictoria. Ayudas a cerrar deals usando metodología Sandler. Da consejos concretos de cierre: cómo usar el termómetro Sandler, cómo manejar "lo voy a pensar", cómo hacer el contrato previo, cómo confirmar Dolor+Presupuesto+Decisión. Sé directo y práctico. Responde en español.`,

  frases: `Eres Petra, coach de ventas de GeoVictoria. Proporciona guiones y frases exactas que el asesor puede usar en sus conversaciones de venta. Basado en metodología Sandler: contrato previo ANOT, embudo del dolor, técnicas de rapport, preguntas de calificación. Da frases listas para usar, no teoría. Responde en español.`,

  deal: `Eres Petra, analista de deals de GeoVictoria. Ayudas a diagnosticar oportunidades estancadas o difíciles usando el framework Sandler: Dolor + Presupuesto + Decisión. Haz preguntas para entender el estado del deal y da recomendaciones concretas de qué hacer. Responde en español.`,

  demo: `Eres Petra, especialista en demos de GeoVictoria. Ayudas a preparar presentaciones personalizadas según el perfil del prospecto. GeoVictoria tiene: fichaje biométrico, app GPS, integración SAP/nóminas, control comedor, cumplimiento reforma laboral, reportes de asistencia, geofencing. Sugiere qué mostrar según el dolor del cliente. Responde en español.`,

  postventa: `Eres Petra, guía de post-venta de GeoVictoria. Explicas los pasos internos después de cerrar: proceso de implementación, onboarding, qué datos necesitas del cliente, cómo hacer el handoff a Customer Success, cómo asegurar adopción y pedir referidos. Sé precisa con los procesos internos de GeoVictoria. Responde en español.`,
};

function GeoLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M16 2C10.477 2 6 6.477 6 12c0 7 10 18 10 18s10-11 10-18c0-5.523-4.477-10-10-10z" fill="#00AEEF" opacity="0.2"/>
      <path d="M16 2C10.477 2 6 6.477 6 12c0 7 10 18 10 18s10-11 10-18c0-5.523-4.477-10-10-10z" stroke="#00AEEF" strokeWidth="2" fill="none"/>
      <circle cx="16" cy="12" r="3" fill="#00AEEF"/>
      <path d="M10 28 L16 20 L22 28" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 4, padding: "12px 16px", background: "white", borderRadius: 12, border: "1px solid #e5e7eb", width: "fit-content" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 8, height: 8, borderRadius: "50%", background: "#00AEEF",
          animation: "bounce 1.2s infinite",
          animationDelay: `${i * 0.2}s`
        }} />
      ))}
      <style>{`@keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }`}</style>
    </div>
  );
}

export default function PetraApp() {
  const [activeTab, setActiveTab] = useState("objeciones");
  const [messages, setMessages] = useState({});
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const currentMessages = messages[activeTab] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages, loading]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput("");

    const newMsg = { role: "user", content: userText };
    const updatedHistory = [...currentMessages, newMsg];
    setMessages(prev => ({ ...prev, [activeTab]: updatedHistory }));
    setLoading(true);

    try {
      // Llamada al proxy seguro en lugar de directamente a Anthropic
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1000,
          system: SYSTEM_PROMPTS[activeTab],
          messages: updatedHistory.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await response.json();
      const reply = data.content?.[0]?.text || "No pude obtener una respuesta. Intenta de nuevo.";
      setMessages(prev => ({
        ...prev,
        [activeTab]: [...updatedHistory, { role: "assistant", content: reply }]
      }));
    } catch {
      setMessages(prev => ({
        ...prev,
        [activeTab]: [...updatedHistory, { role: "assistant", content: "Hubo un error de conexión. Por favor intenta de nuevo." }]
      }));
    }
    setLoading(false);
  };

  const suggestions = SUGGESTIONS[activeTab] || [];
  const showWelcome = currentMessages.length === 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#f3f4f6", color: "#111827" }}>
      {/* Header */}
      <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "12px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <GeoLogo />
        <div style={{ background: "#00AEEF", color: "white", borderRadius: 20, padding: "4px 14px", fontSize: 13, fontWeight: 700, letterSpacing: 0.5 }}>
          PETRA DE GEOVICTORIA
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6b7280" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
          En línea
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", display: "flex", overflowX: "auto", padding: "0 16px" }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "14px 16px",
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: activeTab === tab.id ? 600 : 400,
              color: activeTab === tab.id ? "#00AEEF" : "#6b7280",
              borderBottom: activeTab === tab.id ? "2px solid #00AEEF" : "2px solid transparent",
              whiteSpace: "nowrap",
              transition: "all 0.15s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
        {showWelcome ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, textAlign: "center", gap: 16 }}>
            <GeoLogo />
            <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>¿En qué te ayudo hoy?</h2>
            <p style={{ color: "#6b7280", maxWidth: 480, lineHeight: 1.6, margin: 0 }}>
              Soy Petra, tu coach de ventas GeoVictoria. Consigue consejos para cerrar deals, prepara tu próxima demo, practica objeciones o consulta los pasos internos post-venta.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 8, width: "100%", maxWidth: 560 }}>
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s.text)}
                  style={{
                    background: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: 12,
                    padding: "16px",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: 14,
                    color: "#374151",
                    lineHeight: 1.5,
                    transition: "all 0.15s",
                    display: "flex",
                    gap: 8,
                    alignItems: "flex-start",
                  }}
                  onMouseOver={e => { e.currentTarget.style.background = "#f0f9ff"; e.currentTarget.style.borderColor = "#00AEEF"; }}
                  onMouseOut={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.borderColor = "#e5e7eb"; }}
                >
                  <span style={{ fontSize: 18 }}>{s.emoji}</span>
                  <span>{s.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {currentMessages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                {msg.role === "assistant" && (
                  <div style={{ marginRight: 8, marginTop: 4, flexShrink: 0 }}>
                    <GeoLogo />
                  </div>
                )}
                <div style={{
                  maxWidth: "72%",
                  background: msg.role === "user" ? "#00AEEF" : "white",
                  color: msg.role === "user" ? "white" : "#111827",
                  borderRadius: 12,
                  padding: "12px 16px",
                  fontSize: 14,
                  lineHeight: 1.6,
                  border: msg.role === "assistant" ? "1px solid #e5e7eb" : "none",
                  whiteSpace: "pre-wrap",
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <GeoLogo />
                <TypingDots />
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div style={{ background: "white", borderTop: "1px solid #e5e7eb", padding: "16px 20px" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder={PLACEHOLDERS[activeTab]}
            rows={1}
            style={{
              flex: 1,
              border: "1px solid #d1d5db",
              borderRadius: 10,
              padding: "12px 16px",
              fontSize: 14,
              fontFamily: "inherit",
              resize: "none",
              outline: "none",
              color: "#374151",
              lineHeight: 1.5,
              transition: "border 0.15s",
            }}
            onFocus={e => e.target.style.borderColor = "#00AEEF"}
            onBlur={e => e.target.style.borderColor = "#d1d5db"}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={{
              background: input.trim() && !loading ? "#00AEEF" : "#d1d5db",
              border: "none",
              borderRadius: 10,
              width: 44,
              height: 44,
              cursor: input.trim() && !loading ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.15s",
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <p style={{ margin: "8px 0 0", fontSize: 12, color: "#9ca3af", textAlign: "center" }}>
          Shift+Enter para nueva línea · Sé específico para mejores respuestas
        </p>
      </div>
    </div>
  );
}
