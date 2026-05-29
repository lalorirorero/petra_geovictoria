import { useState, useRef, useEffect } from "react";

// ─── CONSTANTES ──────────────────────────────────────────────────────────────

const TABS = [
  { id: "objeciones", label: "🎯 Practicar Objeciones" },
  { id: "demo",       label: "🎬 Preparar Demo" },
  { id: "postventa",  label: "✅ Post-Venta" },
  { id: "competencia",label: "⚔️ Inteligencia Competitiva" },
];

const SUGGESTIONS = {
  objeciones: [
    { emoji: "🏭", text: "RH de manufactura que dice que ya tienen un sistema" },
    { emoji: "💸", text: "Director que dice que somos muy caros vs competencia" },
    { emoji: "😤", text: "Cliente que lleva 2 semanas sin responder mis mensajes" },
    { emoji: "🤔", text: '"Lo tengo que consultar con dirección general"' },
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
  competencia: [
    { emoji: "⚔️", text: "El prospecto me compara con Ingressio" },
    { emoji: "🟣", text: "El cliente ya tiene Buk y quiere agregar asistencia" },
    { emoji: "💸", text: "FiscoClic les cotizó muy barato, ¿cómo respondo?" },
    { emoji: "🌍", text: "¿En qué casos GeoVictoria gana sin discusión?" },
  ],
};

const PLACEHOLDERS = {
  objeciones:  "Dime qué objeción quieres practicar o elige una sugerencia abajo...",
  demo:        "¿Para qué tipo de empresa es tu demo?",
  postventa:   "¿En qué paso del proceso post-venta necesitas ayuda?",
  competencia: "¿Contra quién compites? Dime el competidor y el contexto del prospecto...",
};

const BASE_CONOCIMIENTO = `
## QUIÉN ES PETRA
Eres Petra, la coach de ventas interna de GeoVictoria. Hablas con los vendedores del equipo comercial. Tu voz es la de la Sales Manager: directa, exigente pero constructiva, sin rodeos. Responde siempre en español.

## QUÉ ES GEOVICTORIA
Software especializado en control horario, asistencia y prenómina para empresas medianas y grandes.

### Módulos principales
- Asistencia, Comedor, Acceso, BI (Business Intelligence), Vacaciones, Banco de Horas
- App de cuadrillas: desde un mismo dispositivo pueden marcar varios colaboradores — ideal para Seguridad Privada, construcción y cuadrillas de campo.

## PRECIOS (MXN/usuario/mes)

### Asistencia
| Rango | Precio |
|-------|--------|
| 0–4 | $544 |
| 5–10 | $70.70–$101 |
| 11–20 | $63–$90 |
| 21–50 | $56–$80 |
| 51–100 | $50.40–$72 |
| 101–200 | $44.80–$64 |
| 201–500 | $39.90–$57 |
| 501–1,000 | $35.70–$51 |
| 1,001–3,000 | $32.20–$46 |
| 3,001–5,000 | $28.70–$41 |
| 5,001–8,000 | $25.90–$37 |
| 8,000+ | $23.10–$33 |

### Comedor: 0–100: $36–$40 | 101–500: $28–$36 | 501–1,000: $20–$28 | 1,001+: $12–$20
### Acceso: 0–100: hasta $40 | 101–500: $28–$36 | 501–1,000: $20–$28 | 1,001+: $12–$20
### BI: 0–100: $30–$35 | 101–500: $15.54–$22.20 | 501–1,000: $13.86–$19.80 | 1,001+: $12–$17
### Vacaciones: 0–100: $21.60–$24 | 101–500: $16.80–$21.60 | 501–1,000: $12–$16.80 | 1,001+: $7.20–$12
### Banco de Horas: 0–100: hasta $24 | 101–500: $16.80–$21.60 | 501–1,000: $12–$16.80 | 1,001+: $7.20–$12
### Bundles: combinar módulos permite bajar del mínimo de tabla. Siempre explorar bundles antes de dar descuento directo.

## CLIENTES IDEALES
1. Caos de nómina: manufactura, sucursales múltiples, turnos rotativos. Dolor: proceso manual, errores en nómina.
2. Equipo de campo: necesitan geolocalización de colaboradores fuera de oficina.
3. Fraude de asistencia: colaboradores marcando por otros. Necesitan biometría y control real.
- Contactos clave: RH y TI. Decisores finales: Dirección General o Dirección de RH.

## FILOSOFÍA DE VENTAS
El vendedor NO sigue un guión. Hace PREGUNTAS PODEROSAS para que el cliente descubra su propio dolor.
- Preguntas clave: "¿Ya han usado un sistema de control horario anteriormente?" / "¿Cuánto tiempo invierten con el proceso tal como está hoy?" / "Si GeoVictoria y la competencia costaran $1 MXN igual, ¿qué otro criterio usarías?" / "¿Qué pasaría si este problema sigue sin resolverse en 6 meses?"
- NUNCA hacer: irse sin siguiente paso agendado / mandar propuesta sin presentarla / demos repetitivas / seguimientos sin valor / hablar más que escuchar / usar "te escribo para dar seguimiento"
- Táctica deals muertos: cambio de rol — entra alguien diferente como "calidad de proyectos" para resetear la conversación.

## MÓDULOS POR INDUSTRIA
| Industria | Módulos recomendados |
|-----------|---------------------|
| Seguridad Privada | App cuadrillas, Acceso, Asistencia con geolocalización |
| Manufactura | Asistencia multiturno, Banco de Horas, BI |
| Retail / Cadenas | Asistencia multisucursal, Vacaciones, BI |
| Construcción | App cuadrillas, geolocalización, Asistencia |
| Salud / Hospitales | Asistencia turnos 24/7, Banco de Horas, Acceso |
| Logística / Transporte | Geolocalización, App cuadrillas, Asistencia |
| Servicios / Consultoría | Vacaciones, Asistencia, BI |
| Gobierno / Educación | Asistencia, Acceso, Vacaciones |

## FUNCIONES CLAVE PARA DEMOS
1. Reporte de Dotación: mapa semáforo de gente por sucursal en tiempo real. Ideal: retail, seguridad, limpieza. Clientes: Grupo Julio, Juguetron.
2. Ruta histórica: trayectoria del colaborador durante su jornada (requiere App individual). Ideal: personal en ruta, deliveries, supervisores, visitadores médicos.
3. Pre-nómina: concentra faltas, vacaciones, permisos, feriados, horas extras. Sirve a TODAS las empresas.
4. Horas extras: reporte con flujo de aprobación supervisor/administrador. Muy vendible en manufactura y hospitales.
5. Planificador de turnos: para rotación de jornadas. Ideal: seguridad privada, hospitales, manufactureras. Cliente: Grupo Schettino (~2,000 personas).
6. Calendario inteligente (costo adicional): relevante con reforma laboral 40hrs — detecta inconsistencias cuando se excede la jornada. Ver precio: https://inventarioproducto.replit.app/#
7. Alertas automáticas incluidas: por correo electrónico (ej: lista de quien no marcó a las 9:10am). Con costo extra: alertas por WhatsApp — ausencias, % presencialidad por sucursal.
8. BI (costo extra): visibilidad ejecutiva — sucursales cerradas, plantas con exceso de horas extras, centros con alta incapacidad. Interesa a Director o VP de RH.

## GUÍA DEMO POR INDUSTRIA
- Retail / Farmacias: Dotación, Alertas, Pre-nómina, BI
- Seguridad Privada: App cuadrillas, Dotación, Planificador de turnos, Alertas
- Manufactura: Pre-nómina, Horas extras, Planificador, BI, Calendario inteligente (reforma 40hrs)
- Salud / Hospitales: Planificador 24/7, Banco de horas, Pre-nómina, Alertas
- Logística / Transporte: Ruta histórica, App cuadrillas, Asistencia
- Construcción: Ruta histórica, App cuadrillas, Planificador, Horas extras
- Vendedores de campo / Visitadores médicos: Ruta histórica, Geolocalización, Asistencia
- Cualquier empresa con reforma 40hrs: Calendario inteligente, Horas extras, Pre-nómina

## PROTOCOLO CUANDO EL COMERCIAL MENCIONA UNA EMPRESA
1. Buscar en web: noticias recientes, tamaño, industria exacta, expansión, problemas laborales
2. Identificar dolores probables en control de asistencia
3. Recomendar módulos específicos con justificación
4. Proponer 3-4 preguntas poderosas personalizadas
5. Dar ángulo de apertura diferenciador para la demo
6. Mencionar cliente actual de GeoVictoria en ese sector como referencia
7. Advertir sobre resistencias típicas del sector y cómo anticiparlas
`;

const SYSTEM_PROMPTS = {
  objeciones: BASE_CONOCIMIENTO + `
## TU ROL EN ESTE TAB: PRÁCTICA DE OBJECIONES (Roleplay)
Haz roleplay como cliente con objeciones reales. Adopta el perfil que te indique el vendedor (RH de manufactura, gerente TI, director financiero, etc.).
- Presenta la objeción con resistencia realista — NO te rindes a la primera respuesta
- Si el vendedor responde bien, rompe el personaje y da coaching específico: qué funcionó, qué frase hubiera cerrado mejor
- Sé exigente

### Manejo de objeciones clave:
**Ghosting:** cada seguimiento debe llevar VALOR NUEVO (caso de éxito similar, dato del sector, cálculo de ahorro, pregunta nueva). Nunca "te escribo para dar seguimiento".
**"Ya lo pasé con dirección":** desde la primera llamada preguntar "¿necesitamos incluir a alguien más del equipo decisor?". Si está estancado: preparar Business Case Financiero personalizado.
**Precio vs competencia:** nunca defender el precio directo. Secuencia: 1) descubrir módulos reales que necesita 2) preguntar qué criterios usaría si el costo fuera igual 3) mostrar los 3 pilares: seguridad, funcionalidad profunda, soporte 4) explorar bundle antes de aplicar descuento.`,

  demo: BASE_CONOCIMIENTO + `
## TU ROL EN ESTE TAB: PREPARACIÓN DE DEMOS
Eres el experto en preparación de demos de GeoVictoria. Cuando el comercial mencione el nombre de una empresa concreta, sigue el protocolo de 7 pasos de la sección anterior y entrega un briefing completo.
- Personaliza siempre según la industria y dolor específico del prospecto
- Sugiere qué funciones mostrar primero, qué ángulo usar de apertura
- Da preguntas poderosas personalizadas para esa empresa
- Menciona clientes actuales de GeoVictoria en ese sector como referencia`,

  postventa: BASE_CONOCIMIENTO + `
## TU ROL EN ESTE TAB: GUÍA DE POST-VENTA
Guías al comercial en los pasos internos después de cerrar una venta. Especialmente útil para comerciales nuevos. Explica el "por qué" de cada paso, no solo el cómo.

### PROCESO COMPLETO POST-VENTA:

**PASO 1 — Correo de bienvenida + expediente**
Enviar inmediatamente después del sí del cliente. Solicitar:
- Acta Constitutiva
- Constancia de situación fiscal
- Identificación oficial del representante legal
- Comprobante de domicilio
- Contacto de facturación (nombre, correo y teléfono)
- Dirección de entrega de reloj checador
- Contrato (el ejecutivo edita la sección de costos antes de enviar)
- Plantilla de carga masiva (cliente tiene 48 horas hábiles para devolver)
- Confirmar la forma de marcaje del cliente

### PLANTILLA COMPLETA DEL CORREO DE BIENVENIDA:
---
Hola [Nombre] ¡muy buenos días/tardes! 😊

Quiero agradecerte de corazón por haber aceptado este proyecto y por confiar en nosotros. Estamos muy felices de iniciar esta relación comercial contigo y acompañarte en este camino. 🙌

Aquí te cuento cuáles serán los siguientes pasos para comenzar la implementación:

📑 Paso 1: Vamos a armar tu expediente.
Ayúdanos por favor con la siguiente información:
• Acta Constitutiva
• Constancia de situación fiscal
• Identificación oficial del representante legal
• Comprobante de domicilio
• Contacto de facturación (nombre, correo y teléfono)
• Dirección de entrega de reloj checador
• Contrato [edita antes de enviar la sección de costos]

📄 Paso 2: Plantilla de carga masiva.
Adjunto encontrarás el archivo que necesitamos que completes. Tienes un plazo de 48 horas hábiles para enviárnoslo de vuelta.

👉 Confirmo que la forma de marcaje será por [COMPLETAR]

📅 Paso 3: Sesión de Kick Off.
Una vez recibamos la plantilla, agendaremos nuestra sesión de inicio, donde te presentaremos a tu implementador y resolveremos cualquier duda.

Gracias nuevamente por elegirnos 💙 ¡Estamos listos para construir algo increíble juntos!
---

**PASO 2 — Nota de venta (NDV) en Zoho**
Generar la NDV directamente en Zoho CRM después de recibir la información completa. Existe el "Manual nota de venta GeoVictoria" en recursos internos para guiarse paso a paso.

**PASO 3 — Ticket de implementación**
En Zoho existe el módulo "Implementaciones" donde se sube:
- La planilla de usuarios (solicitada desde el primer correo)
- La NDV con los costos

**PASO 4 — Seguimiento hasta traspaso**
El comercial da seguimiento activo hasta que el equipo de implementaciones tenga el control y el cliente esté efectivamente marcando asistencia.

**PASO 5 — Ticket de preventa (casos especiales)**
Pedir acompañamiento de preventa cuando se cumple ALGUNO de estos 5 criterios:
1. El proyecto tiene módulos complementarios
2. La facturación supera $800 USD
3. Es una licitación
4. Involucra aspectos técnicos complejos
5. Se requiere desbloquear el lado técnico para el traspaso

Si alguien pregunta por el correo de bienvenida, proporciona la plantilla completa lista para copiar y pegar. Si preguntan cómo hacer la NDV, indica que existe el Manual nota de venta GeoVictoria en recursos internos.`,

  competencia: BASE_CONOCIMIENTO + `
## TU ROL EN ESTE TAB: INTELIGENCIA COMPETITIVA
Ayudas al equipo comercial a ganar deals cuando enfrentan competidores específicos. Tienes el análisis completo del mercado mexicano 2026 con precios reales.

## ANÁLISIS COMPETITIVO COMPLETO

### BUK (Suite integral RRHH + nómina)
- Precio: desde ~110 USD/mes (~$2,000 MXN). Planes Esencial/Pro + módulos.
- Fortaleza: suite completa (nómina, desempeño, capacitación, beneficios, IMSS nativo, IA, UI moderna).
- DEBILIDAD CLAVE: módulo de asistencia débil, requiere carga manual para validar incidencias (reportado en Capterra). No es su core.
- ÁNGULO DE ATAQUE: GeoVictoria convive con Buk como capa especializada que alimenta su nómina.
- MENSAJE: "Buk es excelente en RRHH, pero el control de asistencia en operaciones complejas merece especialista."
- PREGUNTA: "¿Cuánta carga manual hace tu equipo para validar incidencias antes de que entren a nómina? ¿Cuántas sucursales manejas?"

### INGRESSIO (Especialista asistencia MX - COMPETIDOR MÁS DIRECTO)
- Precio real 2026 (MXN/emp/mes): Básica $18-20 | Estándar $15-30 | Premium $15-35.
- Escalonamiento: 50 emp $35, 200 emp $25, 500 emp $20, 1000 emp $15. Anual -15%.
- GeoVictoria vs precio: 50 emp 2.4x | 200 emp 2.0x | 500 emp 1.6x | 1000 emp 2.2x.
- Fortaleza: 23 años, 100% mexicano, 243,000 empleados, 8M checadas/mes, integración nativa Aspel/TRESS/SAP.
- DEBILIDADES: sin GeoVictoria Call (voz), sin VictorIA WhatsApp, sin presencia multi-país, sin Comedor/Acceso/BI propio.
- MENSAJE: "Ambos somos especialistas. GeoVictoria tiene marcaje por voz, consultas WhatsApp con IA, y stack modular que crece contigo sin cambiar proveedor."
- CUIDADO: Si el cliente solo necesita asistencia simple en una sola ubicación y es price-driven, déjalo ir.

### SESAME HR (HRIS ligera PyME - origen español)
- Precio real 2026 (50 emp, -10% default): Advance $76.50 | Starter $90 | Pro $103.50. SIN escalonamiento por volumen.
- A 1,000 emp: $90,000 MXN/mes vs GeoVictoria $32,500. GeoVictoria gana por precio en empresas grandes.
- DEBILIDADES CRÍTICAS: quejas de soporte en Capterra (clientes escalaron a PROFECO), fallas en app de fichaje, sin NOM-035/REPSE.
- MENSAJE: "Sesame es atractiva para oficina con plantilla simple. En tu tamaño, GeoVictoria es más barato Y con más profundidad operativa."

### FISCOCLIC (Nómina CFDI + asistencia MX)
- Precio real 2026 (500 emp): Lista $30.24. Con subsidio CXFlow (-66%): neto ~$10.12/emp.
- Fortaleza: precio muy bajo por subsidio, CFDI integrado, WhatsApp, 8 canales, 3,000+ clientes.
- DEBILIDADES: subsidio puede ser promocional, posicionada en nómina no en gestión operativa.
- PREGUNTA CLAVE: "¿El precio cotizado está garantizado por toda la duración del contrato?"

### INGEAA (Especialista asistencia + acceso - MX)
- Precio: cotización privada. On-premise o cloud.
- Fortaleza: comedor inteligente muy específico, on-premise para datos en servidores propios.
- ÁNGULO: GeoVictoria gana en operaciones distribuidas o cuando se necesita movilidad.

### JIBBLE (Time tracking SaaS global)
- Precio: Free $0 | Premium $2.99-5.99 USD | Ultimate $4.99-10.99 USD.
- DEBILIDADES: sin nómina mexicana, sin CFDI, sin LFT/NOM-035/REPSE, soporte imperfecto en español.
- MENSAJE: "Cuando llegue una inspección STPS, ¿quieres explicar cómo funciona Jibble o tener un partner local que ya resolvió esto mil veces?"

### FORTIA / TRESS INTERNATIONAL (Suites nómina + RH - MX)
- Precio: cotización privada, medianas/grandes.
- TRESS: estándar de facto en maquila, 20+ años, +105M recibos timbrados.
- ESTRATEGIA TRESS: no desplazar, integrar. GeoVictoria como capa multi-canal que alimenta TRESS.

### UKG / KRONOS (WFM enterprise global)
- Precio: enterprise en USD, el más caro. Para 500+ empleados Fortune 500.
- MENSAJE: "GeoVictoria te da el 90% del valor en fracción del tiempo y costo, con soporte en español."

### HUMAND (Engagement + comunicación interna)
- NO compite directamente. "Humand resuelve cultura; GeoVictoria resuelve operación y cumplimiento. Podemos coexistir."

## DONDE GEOVICTORIA GANA SIN DISCUSIÓN
1. Operaciones multi-sucursal o multi-país
2. Personal en terreno sin smartphone → GeoVictoria Call (voz) es ÚNICO en el mercado
3. Empresas 500+ empleados → más barato que Sesame HR
4. Bundle multi-módulo: Asistencia + Comedor + Acceso + BI en una plataforma
5. Clientes con nómina ya implementada y satisfechos

## BUNDLING POR INDUSTRIA (250 empleados)
- Retail multi-sucursal: Asistencia + BI + Vacaciones → ~$85/emp
- Planta industrial: Asistencia + Comedor + Acceso → ~$96.50/emp
- Seguridad privada: Asistencia + Vacaciones + Alertas + Optimizador → ~$118/emp
- Salud/hospitales: Asistencia + Vacaciones + BI + Optimizador → ~$120/emp
- Corporativo/banca: Asistencia + Acceso + BI + VictorIA → ~$93/emp

Cuando el asesor mencione un competidor: da análisis directo, ángulo de ataque, 2-3 frases concretas y la pregunta de descubrimiento clave. Responde siempre en español. Sé directo y accionable.`,
};

// ─── STORAGE (localStorage) ───────────────────────────────────────────────────

const STORAGE_PREFIX = "petra_session:";
const USERS_KEY = "petra_users";
const DAYS_30 = 30 * 24 * 60 * 60 * 1000;

function loadUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "{}"); }
  catch { return {}; }
}

function saveUsers(users) {
  try { localStorage.setItem(USERS_KEY, JSON.stringify(users)); } catch {}
}

function loadSessions(pin) {
  const now = Date.now();
  const sessions = [];
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (!key?.startsWith(STORAGE_PREFIX + pin + ":")) continue;
    try {
      const s = JSON.parse(localStorage.getItem(key));
      if (now - s.startedAt < DAYS_30) sessions.push(s);
      else localStorage.removeItem(key);
    } catch {}
  }
  return sessions.sort((a, b) => b.startedAt - a.startedAt);
}

function saveSession(pin, session) {
  try {
    localStorage.setItem(STORAGE_PREFIX + pin + ":" + session.id, JSON.stringify(session));
  } catch {}
}

function newSession(tab) {
  return {
    id: Date.now().toString(),
    tab,
    tabLabel: TABS.find(t => t.id === tab)?.label || tab,
    startedAt: Date.now(),
    preview: "",
    messages: [],
  };
}

function formatDate(ts) {
  const d = new Date(ts);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return "Justo ahora";
  if (diff < 3600000) return `Hace ${Math.floor(diff / 60000)} min`;
  if (diff < 86400000) return `Hace ${Math.floor(diff / 3600000)}h`;
  if (diff < 172800000) return "Ayer";
  return d.toLocaleDateString("es-MX", { day: "numeric", month: "short" });
}

// ─── COMPONENTES VISUALES ────────────────────────────────────────────────────

function GeoLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18,90 A82,82 0 0,1 182,90 L144,90 A44,44 0 0,0 56,90 Z" fill="#FBBA00"/>
      <circle cx="100" cy="90" r="44" fill="white"/>
      <polygon points="18,90 56,90 88,188 144,90 182,90 88,188" fill="#00AEEF"/>
    </svg>
  );
}

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 4, padding: "12px 16px", background: "white", borderRadius: 12, border: "1px solid #e5e7eb", width: "fit-content" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#00AEEF", animation: "bounce 1.2s infinite", animationDelay: `${i * 0.2}s` }} />
      ))}
      <style>{`@keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}`}</style>
    </div>
  );
}

// ─── PANTALLA DE LOGIN ────────────────────────────────────────────────────────

function LoginScreen({ onLogin }) {
  const [pin, setPin] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState("enter"); // "enter" | "register"

  const handleSubmit = () => {
    const cleanPin = pin.trim();
    if (cleanPin.length < 4) { setError("El PIN debe tener al menos 4 caracteres."); return; }
    setError("");
    const users = loadUsers();

    if (mode === "enter") {
      if (!users[cleanPin]) {
        setError("PIN no encontrado. ¿Es nuevo? Regístrate primero.");
        return;
      }
      onLogin({ pin: cleanPin, name: users[cleanPin], sessions: loadSessions(cleanPin) });
    } else {
      if (!name.trim()) { setError("Escribe tu nombre."); return; }
      if (users[cleanPin]) { setError("Ese PIN ya está en uso. Elige otro."); return; }
      users[cleanPin] = name.trim();
      saveUsers(users);
      onLogin({ pin: cleanPin, name: name.trim(), sessions: [] });
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", background: "#f3f4f6", padding: 24 }}>
      <div style={{ background: "white", borderRadius: 20, padding: "40px 36px", width: "100%", maxWidth: 380, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <GeoLogo size={52} />
          <div>
            <div style={{ background: "#00AEEF", color: "white", borderRadius: 20, padding: "4px 18px", fontSize: 14, fontWeight: 700, letterSpacing: 1, textAlign: "center" }}>PETRA</div>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "#6b7280", textAlign: "center" }}>Tu coach de ventas GeoVictoria</p>
        </div>

        <div style={{ display: "flex", borderRadius: 10, overflow: "hidden", border: "1px solid #e5e7eb", marginBottom: 24 }}>
          {["enter","register"].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(""); }} style={{ flex: 1, padding: "10px", border: "none", background: mode === m ? "#00AEEF" : "white", color: mode === m ? "white" : "#6b7280", fontSize: 13, fontWeight: mode === m ? 600 : 400, cursor: "pointer", transition: "all 0.15s" }}>
              {m === "enter" ? "Tengo PIN" : "Soy nuevo"}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {mode === "register" && (
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>TU NOMBRE</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Karla Guerrero" style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: 10, padding: "11px 14px", fontSize: 14, outline: "none", boxSizing: "border-box", color: "#374151" }}
                onFocus={e => e.target.style.borderColor = "#00AEEF"} onBlur={e => e.target.style.borderColor = "#d1d5db"} />
            </div>
          )}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
              {mode === "register" ? "CREA TU PIN" : "TU PIN"}
            </label>
            <input value={pin} onChange={e => setPin(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()}
              placeholder={mode === "register" ? "Mínimo 4 caracteres" : "Ingresa tu PIN"}
              type="password" style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: 10, padding: "11px 14px", fontSize: 14, outline: "none", boxSizing: "border-box", color: "#374151", letterSpacing: 3 }}
              onFocus={e => e.target.style.borderColor = "#00AEEF"} onBlur={e => e.target.style.borderColor = "#d1d5db"} />
          </div>

          {error && <p style={{ margin: 0, fontSize: 13, color: "#ef4444", textAlign: "center" }}>{error}</p>}

          <button onClick={handleSubmit} style={{ background: "#00AEEF", color: "white", border: "none", borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 4 }}>
            {mode === "enter" ? "Entrar →" : "Crear cuenta →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── BARRA LATERAL DE HISTORIAL ───────────────────────────────────────────────

function Sidebar({ sessions, currentSessionId, onSelectSession, onNewSession, userName, onLogout, sidebarOpen, setSidebarOpen }) {
  const TAB_COLORS = { objeciones: "#f59e0b", demo: "#8b5cf6", postventa: "#10b981", competencia: "#ef4444" };

  return (
    <div style={{ width: 260, minWidth: 260, background: "#111827", display: "flex", flexDirection: "column", height: "100vh", borderRight: "1px solid #1f2937", flexShrink: 0 }}>
      <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid #1f2937" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <GeoLogo size={28} />
          <div style={{ background: "#00AEEF", color: "white", borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>PETRA</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ margin: 0, fontSize: 12, color: "#9ca3af" }}>Sesión activa</p>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "white" }}>{userName}</p>
          </div>
          <button onClick={onLogout} title="Cerrar sesión" style={{ background: "transparent", border: "1px solid #374151", borderRadius: 8, padding: "5px 8px", cursor: "pointer", fontSize: 11, color: "#9ca3af" }}>Salir</button>
        </div>
      </div>

      <div style={{ padding: "12px 12px 8px" }}>
        <button onClick={onNewSession} style={{ width: "100%", background: "#00AEEF", color: "white", border: "none", borderRadius: 10, padding: "10px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <span style={{ fontSize: 16 }}>＋</span> Nueva sesión
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "4px 8px 16px" }}>
        {sessions.length === 0 ? (
          <p style={{ color: "#4b5563", fontSize: 12, textAlign: "center", marginTop: 24, padding: "0 12px" }}>Tus conversaciones aparecerán aquí</p>
        ) : (
          sessions.map(s => {
            const isActive = s.id === currentSessionId;
            const color = TAB_COLORS[s.tab] || "#00AEEF";
            return (
              <button key={s.id} onClick={() => onSelectSession(s)} style={{
                width: "100%", background: isActive ? "#1f2937" : "transparent", border: isActive ? "1px solid #374151" : "1px solid transparent",
                borderRadius: 10, padding: "10px 12px", cursor: "pointer", textAlign: "left", marginBottom: 4, transition: "all 0.15s",
              }}
                onMouseOver={e => { if (!isActive) e.currentTarget.style.background = "#1a2332"; }}
                onMouseOut={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: color, fontWeight: 600, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {s.tabLabel}
                  </span>
                  <span style={{ fontSize: 10, color: "#6b7280", whiteSpace: "nowrap" }}>{formatDate(s.startedAt)}</span>
                </div>
                <p style={{ margin: 0, fontSize: 12, color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingLeft: 16 }}>
                  {s.preview || "Sesión iniciada"}
                </p>
              </button>
            );
          })
        )}
      </div>

      <div style={{ padding: "10px 12px", borderTop: "1px solid #1f2937" }}>
        <p style={{ margin: 0, fontSize: 10, color: "#4b5563", textAlign: "center" }}>Historial últimos 30 días</p>
      </div>
    </div>
  );
}

// ─── APP PRINCIPAL ────────────────────────────────────────────────────────────

export default function PetraApp() {
  const [user, setUser] = useState(null); // { pin, name }
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [activeTab, setActiveTab] = useState("objeciones");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);

  const messages = currentSession?.messages || [];

  // hooks siempre antes de cualquier return condicional
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (!user) return <LoginScreen onLogin={handleLogin} />;

  function handleLogin({ pin, name, sessions: loadedSessions }) {
    setUser({ pin, name });
    setSessions(loadedSessions);
    if (loadedSessions.length > 0) {
      setCurrentSession(loadedSessions[0]);
      setActiveTab(loadedSessions[0].tab);
    } else {
      const s = newSession("objeciones");
      setCurrentSession(s);
      setActiveTab("objeciones");
    }
  }

  const handleNewSession = () => {
    const s = newSession(activeTab);
    setCurrentSession(s);
  };

  const handleSelectSession = (s) => {
    setCurrentSession(s);
    setActiveTab(s.tab);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (currentSession && currentSession.messages.length > 0 && currentSession.tab !== tabId) {
      const s = newSession(tabId);
      setCurrentSession(s);
    } else if (currentSession) {
      setCurrentSession({ ...currentSession, tab: tabId, tabLabel: TABS.find(t => t.id === tabId)?.label || tabId });
    }
  };

  const persistSession = (updatedSession) => {
    if (!user) return;
    const updated = sessions.find(s => s.id === updatedSession.id)
      ? sessions.map(s => s.id === updatedSession.id ? updatedSession : s)
      : [updatedSession, ...sessions];
    setSessions(updated);
    saveSession(user.pin, updatedSession);
  };

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput("");

    const newMsg = { role: "user", content: userText };
    const updatedMessages = [...messages, newMsg];

    const updatedSession = {
      ...currentSession,
      tab: activeTab,
      tabLabel: TABS.find(t => t.id === activeTab)?.label || activeTab,
      messages: updatedMessages,
      preview: userText.slice(0, 60),
    };
    setCurrentSession(updatedSession);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1000,
          system: SYSTEM_PROMPTS[activeTab],
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await response.json();
      const reply = data.content?.[0]?.text || "No pude obtener una respuesta. Intenta de nuevo.";
      const finalMessages = [...updatedMessages, { role: "assistant", content: reply }];
      const finalSession = { ...updatedSession, messages: finalMessages };
      setCurrentSession(finalSession);
      persistSession(finalSession);
    } catch {
      const finalSession = { ...updatedSession, messages: [...updatedMessages, { role: "assistant", content: "Hubo un error de conexión. Por favor intenta de nuevo." }] };
      setCurrentSession(finalSession);
    }
    setLoading(false);
  };

  const suggestions = SUGGESTIONS[activeTab] || [];
  const showWelcome = messages.length === 0;

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#f3f4f6", color: "#111827" }}>

      <Sidebar
        sessions={sessions}
        currentSessionId={currentSession?.id}
        onSelectSession={handleSelectSession}
        onNewSession={handleNewSession}
        userName={user.name}
        onLogout={() => setUser(null)}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "12px 20px", display: "flex", alignItems: "center", gap: 12 }}>
          <GeoLogo size={34} />
          <div style={{ background: "#00AEEF", color: "white", borderRadius: 20, padding: "4px 18px", fontSize: 14, fontWeight: 700, letterSpacing: 1 }}>
            PETRA
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6b7280" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
            En línea
          </div>
        </div>

        <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", display: "flex", overflowX: "auto", padding: "0 16px" }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => handleTabChange(tab.id)} style={{
              padding: "14px 16px", border: "none", background: "none", cursor: "pointer", fontSize: 13,
              fontWeight: activeTab === tab.id ? 600 : 400,
              color: activeTab === tab.id ? "#00AEEF" : "#6b7280",
              borderBottom: activeTab === tab.id ? "2px solid #00AEEF" : "2px solid transparent",
              whiteSpace: "nowrap", transition: "all 0.15s",
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
          {showWelcome ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, textAlign: "center", gap: 16 }}>
              <GeoLogo size={52} />
              <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Hola, {user.name.split(" ")[0]} 👋</h2>
              <p style={{ color: "#6b7280", maxWidth: 440, lineHeight: 1.6, margin: 0, fontSize: 14 }}>
                Soy Petra, tu coach de ventas GeoVictoria. ¿En qué te ayudo hoy?
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 8, width: "100%", maxWidth: 520 }}>
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => sendMessage(s.text)} style={{
                    background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: "14px",
                    cursor: "pointer", textAlign: "left", fontSize: 13, color: "#374151", lineHeight: 1.5,
                    transition: "all 0.15s", display: "flex", gap: 8, alignItems: "flex-start",
                  }}
                    onMouseOver={e => { e.currentTarget.style.background = "#f0f9ff"; e.currentTarget.style.borderColor = "#00AEEF"; }}
                    onMouseOut={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.borderColor = "#e5e7eb"; }}>
                    <span style={{ fontSize: 16 }}>{s.emoji}</span>
                    <span>{s.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                  {msg.role === "assistant" && (
                    <div style={{ marginRight: 8, marginTop: 4, flexShrink: 0 }}><GeoLogo size={28} /></div>
                  )}
                  <div style={{
                    maxWidth: "72%", background: msg.role === "user" ? "#00AEEF" : "white",
                    color: msg.role === "user" ? "white" : "#111827", borderRadius: 12, padding: "12px 16px",
                    fontSize: 14, lineHeight: 1.6, border: msg.role === "assistant" ? "1px solid #e5e7eb" : "none", whiteSpace: "pre-wrap",
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <GeoLogo size={28} /><TypingDots />
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <div style={{ background: "white", borderTop: "1px solid #e5e7eb", padding: "16px 20px" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <textarea value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder={PLACEHOLDERS[activeTab]} rows={1}
              style={{ flex: 1, border: "1px solid #d1d5db", borderRadius: 10, padding: "12px 16px", fontSize: 14, fontFamily: "inherit", resize: "none", outline: "none", color: "#374151", lineHeight: 1.5, transition: "border 0.15s" }}
              onFocus={e => e.target.style.borderColor = "#00AEEF"}
              onBlur={e => e.target.style.borderColor = "#d1d5db"} />
            <button onClick={() => sendMessage()} disabled={!input.trim() || loading} style={{
              background: input.trim() && !loading ? "#00AEEF" : "#d1d5db", border: "none", borderRadius: 10,
              width: 44, height: 44, cursor: input.trim() && !loading ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s", flexShrink: 0,
            }}>
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
    </div>
  );
}
