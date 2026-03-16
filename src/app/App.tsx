import { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';

const imgImage4 = "https://www.nowadays.ai/_next/static/media/nowadays-icon.5c8c330e.png";

const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY as string;
const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const eventTypeOptions = [
  "Team Offsite", "Exec Dinner", "All-Hands", "Product Launch", "Sales Kickoff",
  "Leadership Retreat", "Holiday Party", "Team Building", "Client Event", "Conference",
  "Workshop", "Training Session", "Networking Event", "Awards Ceremony", "Quarterly Review"
];

const guestTypeOptions = [
  "Internal team", "Executive leadership", "Clients & partners", "Board members", "Investors",
  "Vendors & suppliers", "Industry peers", "Media & press", "Job candidates",
  "Alumni & former employees", "Cross-functional teams", "External consultants"
];

function loadJsPDF(): Promise<any> {
  return new Promise((resolve, reject) => {
    if ((window as any).jspdf) { resolve((window as any).jspdf.jsPDF); return; }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    script.onload = () => resolve((window as any).jspdf.jsPDF);
    script.onerror = () => reject(new Error("Failed to load jsPDF"));
    document.head.appendChild(script);
  });
}

function extractJSON(text: string) {
  try { return JSON.parse(text.trim()); } catch {}
  const s = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  try { return JSON.parse(s); } catch {}
  const a = text.indexOf("{"), b = text.lastIndexOf("}");
  if (a !== -1 && b !== -1) { try { return JSON.parse(text.slice(a, b + 1)); } catch {} }
  throw new Error("Could not parse AI response.");
}

// Load a remote image as base64 via canvas for embedding in PDF
function loadImageAsBase64(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas context failed")); return; }
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = url;
  });
}

async function buildPDF(m: any, eventType: string, guestType: string, budget: string, goals: string) {
  const JsPDF = await loadJsPDF();
  const doc = new JsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210, mg = 22, cW = W - mg * 2;
  let y = 0;

  // ── Colour palette — soft, warm, matches the site ──────────────────────────
  const violet: [number, number, number]     = [108, 99, 210];   // main accent
  const violetDeep: [number, number, number] = [91, 82, 188];    // header bg
  const lavCard: [number, number, number]    = [237, 234, 253];  // card fills
  const lavBg: [number, number, number]      = [245, 243, 255];  // footer bg
  const warmWhite: [number, number, number]  = [252, 251, 255];  // page bg
  const ink: [number, number, number]        = [30, 27, 50];     // primary text
  const mid: [number, number, number]        = [90, 85, 115];    // body text
  const muted: [number, number, number]      = [155, 150, 175];  // labels / meta
  const white: [number, number, number]      = [255, 255, 255];
  const borderSoft: [number, number, number] = [220, 215, 240];
  const rowBase: [number, number, number]    = [252, 251, 255];
  const rowAlt: [number, number, number]     = [248, 247, 255];

  // Try to embed logo
  let logoB64: string | null = null;
  try { logoB64 = await loadImageAsBase64(imgImage4); } catch { logoB64 = null; }

  // Helper: fill warm-white page background (call on each new page)
  function pageBg() {
    doc.setFillColor(...warmWhite);
    doc.rect(0, 0, W, 297, "F");
  }

  // ── Page 1 background ───────────────────────────────────────────────────────
  pageBg();

  // ── Header strip ────────────────────────────────────────────────────────────
  doc.setFillColor(...violetDeep);
  doc.rect(0, 0, W, 30, "F");

  // Decorative soft circles top-right
  doc.setFillColor(120, 112, 225);
  doc.circle(W - 8, -2, 24, "F");
  doc.setFillColor(140, 132, 230);
  doc.circle(W - 2, 36, 16, "F");

  // Logo in header
  if (logoB64) {
    try { doc.addImage(logoB64, "PNG", mg, 7, 16, 16); } catch {}
  }
  const textStartX = mg + (logoB64 ? 20 : 0);

  doc.setTextColor(...white);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("nowadays", textStartX, 17);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(210, 205, 245);
  doc.text("Event Approval Planner", textStartX, 24);

  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  doc.setTextColor(210, 205, 245);
  doc.setFontSize(7.5);
  doc.text(today, W - mg, 17, { align: "right" });

  y = 44;

  // ── Title ───────────────────────────────────────────────────────────────────
  doc.setTextColor(...ink);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  const titleLines = doc.splitTextToSize(m.eventTitle || "Event Approval Memo", cW);
  doc.text(titleLines, mg, y);
  y += titleLines.length * 8;

  // Meta line
  const tags = [eventType, guestType || "Internal team", m.suggestedDate || ""].filter(Boolean);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...mid);
  doc.text(tags.join("   ·   "), mg, y);
  y += 8;

  // Divider
  doc.setDrawColor(...borderSoft);
  doc.setLineWidth(0.4);
  doc.line(mg, y, W - mg, y);
  y += 11;

  // ── Metric cards ────────────────────────────────────────────────────────────
  const cards = [
    { label: "Budget",         val: `$${budget}` },
    { label: "Estimated Cost", val: m.estimatedTotal || "—" },
    { label: "Cost / Person",  val: m.costPerPerson || "—" },
    { label: "Best City",      val: m.recommendedCity || "—" },
  ];
  const gap = 4, cardH = 21;
  const cardW = (cW - gap * 3) / 4;

  cards.forEach((c, i) => {
    const x = mg + i * (cardW + gap);
    doc.setFillColor(...lavCard);
    doc.setDrawColor(...borderSoft);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, y, cardW, cardH, 3, 3, "FD");

    doc.setFontSize(6.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...muted);
    doc.text(c.label.toUpperCase(), x + cardW / 2, y + 7.5, { align: "center" });

    doc.setFontSize(9.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...violet);
    const vLines = doc.splitTextToSize(c.val, cardW - 5);
    doc.text(vLines[0], x + cardW / 2, y + 15.5, { align: "center" });
  });
  y += cardH + 12;

  // ── Section helper ───────────────────────────────────────────────────────────
  function section(title: string, body: string) {
    if (y > 252) {
      doc.addPage(); pageBg(); y = 22;
    }
    // Left accent bar + label
    doc.setFillColor(...violet);
    doc.roundedRect(mg, y, 2.5, 6.5, 1, 1, "F");
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...violet);
    doc.text(title.toUpperCase(), mg + 6, y + 5);
    y += 11;

    doc.setFontSize(9.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...mid);
    const lines = doc.splitTextToSize(body, cW);
    lines.forEach((l: string) => {
      if (y > 272) { doc.addPage(); pageBg(); y = 22; }
      doc.text(l, mg, y);
      y += 5.6;
    });
    y += 8;
  }

  section("Executive Summary", m.executiveSummary || "");
  section("Business Case & ROI", m.businessCase || "");
  section("Goals & Purpose", goals);

  // ── Budget breakdown ─────────────────────────────────────────────────────────
  if (y > 195) { doc.addPage(); pageBg(); y = 22; }

  doc.setFillColor(...violet);
  doc.roundedRect(mg, y, 2.5, 6.5, 1, 1, "F");
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...violet);
  doc.text("BUDGET BREAKDOWN", mg + 6, y + 5);
  y += 11;

  const colCat = 58, colEst = 36;
  const colNotes = cW - colCat - colEst - 6;

  // Header row — soft violet, rounded
  doc.setFillColor(...violet);
  doc.roundedRect(mg, y, cW, 8.5, 1.5, 1.5, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...white);
  doc.text("Category",   mg + 5,              y + 5.8);
  doc.text("Estimate",   mg + colCat + 4,     y + 5.8);
  doc.text("Notes",      mg + colCat + colEst + 4, y + 5.8);
  y += 8.5;

  (m.breakdown || []).forEach((row: any, i: number) => {
    if (y > 265) { doc.addPage(); pageBg(); y = 22; }

    const rawNote = row.notes || "";
    const words = rawNote.split(" ");
    const shortNote = words.length > 7 ? words.slice(0, 7).join(" ") + "…" : rawNote;

    const catLines  = doc.splitTextToSize(row.category || "", colCat - 8);
    const estLines  = doc.splitTextToSize(row.estimate  || "", colEst - 6);
    const noteLines = doc.splitTextToSize(shortNote,          colNotes - 4);
    const maxL = Math.max(catLines.length, estLines.length, noteLines.length);
    const rowH = Math.max(8.5, maxL * 5.2 + 4);

    doc.setFillColor(...(i % 2 === 0 ? rowBase : rowAlt));
    doc.rect(mg, y, cW, rowH, "F");

    // Small accent dot
    doc.setFillColor(...lavCard);
    doc.circle(mg + 3, y + rowH / 2, 1.2, "F");

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...ink);
    doc.text(catLines, mg + 7, y + 6);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...violet);
    doc.text(estLines, mg + colCat + 4, y + 6);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...mid);
    doc.text(noteLines, mg + colCat + colEst + 4, y + 6);

    y += rowH;
  });

  doc.setDrawColor(...borderSoft);
  doc.setLineWidth(0.35);
  doc.line(mg, y, W - mg, y);
  y += 11;

  section("Recommendation & Next Steps", m.recommendation || "");
  section("Why Nowadays", m.nowadaysValue || "Nowadays handles all venue sourcing, negotiations, and vendor management — saving your team weeks of back-and-forth. Our platform typically saves clients 15–20% on total event costs through exclusive partnerships and smart negotiation.");

  // ── City callout ─────────────────────────────────────────────────────────────
  if (m.cityReason && m.recommendedCity) {
    if (y > 255) { doc.addPage(); pageBg(); y = 22; }
    const cityLines = doc.splitTextToSize(m.cityReason, cW - 14);
    const boxH = 13 + cityLines.length * 5.5;
    doc.setFillColor(...lavCard);
    doc.setDrawColor(...borderSoft);
    doc.setLineWidth(0.35);
    doc.roundedRect(mg, y, cW, boxH, 4, 4, "FD");

    doc.setFillColor(...violet);
    doc.circle(mg + 6.5, y + 8, 2.2, "F");

    doc.setFontSize(9.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...violet);
    doc.text(`Recommended destination: ${m.recommendedCity}`, mg + 13, y + 9);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...mid);
    doc.text(cityLines, mg + 6, y + 15);
    y += boxH + 9;
  }

  // ── Disclaimer ───────────────────────────────────────────────────────────────
  if (y > 265) { doc.addPage(); pageBg(); y = 22; }
  doc.setDrawColor(...borderSoft);
  doc.setLineWidth(0.3);
  doc.line(mg, y, W - mg, y);
  y += 5;
  doc.setFontSize(7);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(...muted);
  const disc = "This document was generated as a planning aid and cost estimates are approximate. Final pricing will vary based on vendor availability, location, and negotiated rates. All figures should be verified with Nowadays prior to formal budget approval.";
  doc.splitTextToSize(disc, cW).forEach((l: string) => {
    if (y > 278) { doc.addPage(); pageBg(); y = 22; }
    doc.text(l, mg, y); y += 4.5;
  });

  // ── Footer on every page ─────────────────────────────────────────────────────
  const pages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFillColor(...lavBg);
    doc.rect(0, 283, W, 14, "F");
    if (logoB64) {
      try { doc.addImage(logoB64, "PNG", mg, 285.5, 8, 8); } catch {}
    }
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...muted);
    doc.text(
      "Prepared with Nowadays Event Approval Planner · nowadays.ai",
      mg + (logoB64 ? 11 : 0),
      291
    );
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...violet);
    doc.text(`${i} / ${pages}`, W - mg, 291, { align: "right" });
  }

  window.open(URL.createObjectURL(doc.output("blob")), "_blank");
}

// ─────────────────────────────────────────────────────────────────────────────
// App component
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [eventType, setEventType] = useState('');
  const [guestType, setGuestType] = useState('');
  const [budget, setBudget] = useState('');
  const [goals, setGoals] = useState('');
  const [eventTypeOpen, setEventTypeOpen] = useState(false);
  const [guestTypeOpen, setGuestTypeOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { loadJsPDF().catch(() => {}); }, []);

  async function handleOpenPDF() {
    if (!eventType) { setError("Please select an event type."); return; }
    if (!budget)    { setError("Please enter a budget."); return; }
    if (!goals)     { setError("Please describe your goals and purpose."); return; }
    setLoading(true);
    setError("");

    const enhancedGoals = goals.trim().length < 30
      ? `${goals.trim()} — fostering team alignment, strengthening cross-functional relationships, and driving measurable business outcomes`
      : goals.trim().charAt(0).toUpperCase() + goals.trim().slice(1) + (goals.trim().endsWith('.') ? '' : '.');

    const prompt = `You are a corporate event planning expert. Generate a professional executive approval memo that would convince a CFO or exec to approve this event budget. Be persuasive, specific, and data-driven. Return ONLY valid JSON with no markdown, no extra text, no explanation.

Event Type: ${eventType}
Guest Type: ${guestType || "Internal team"}
Budget: $${budget}
Goals: ${enhancedGoals}

Return this exact JSON structure:
{
  "eventTitle": "specific descriptive title e.g. Q3 Leadership Alignment Offsite",
  "suggestedDate": "specific recommended timeframe e.g. September 15–18, 2025",
  "estimatedTotal": "realistic cost range e.g. $74,000 – $82,000",
  "costPerPerson": "per person range e.g. $2,100 – $2,350",
  "recommendedCity": "specific best city",
  "cityReason": "one compelling sentence explaining why this city is ideal for this event type and group",
  "breakdown": [
    {"category": "Accommodation", "estimate": "$X,XXX – $X,XXX", "notes": "max 5 words e.g. 3-night hotel block"},
    {"category": "Venue & Meeting Rooms", "estimate": "$X,XXX – $X,XXX", "notes": "max 5 words e.g. full-day boardroom rental"},
    {"category": "Food & Beverage", "estimate": "$X,XXX – $X,XXX", "notes": "max 5 words e.g. catered meals included"},
    {"category": "Activities & Team Building", "estimate": "$X,XXX – $X,XXX", "notes": "max 5 words e.g. half-day group activity"},
    {"category": "Travel & Transport", "estimate": "$X,XXX – $X,XXX", "notes": "max 5 words e.g. flights and ground transport"},
    {"category": "Contingency (10%)", "estimate": "$X,XXX", "notes": "max 5 words e.g. buffer for overruns"}
  ],
  "executiveSummary": "3-4 persuasive sentences: what the event is, who attends, strategic importance, expected outcomes.",
  "businessCase": "3-4 sentences citing specific research where relevant (e.g. Gallup, McKinsey) on team engagement, retention savings, and productivity gains from in-person collaboration.",
  "recommendation": "2-3 sentences: state the approval ask clearly, outline immediate next steps if approved, note the planning timeline.",
  "nowadaysValue": "2 sentences on how using Nowadays for sourcing and negotiation saves significant time and reduces costs vs. planning independently."
}`;

    try {
      const res = await fetch(`${ENDPOINT}?key=${GEMINI_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 10000 },
        }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error((e as any)?.error?.message || `API error ${res.status}`);
      }
      const data = await res.json();
      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      await buildPDF(extractJSON(raw), eventType, guestType, budget, enhancedGoals);
    } catch (err: any) {
      setError("Error: " + (err.message || "Something went wrong. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1527 1440">
          <defs>
            <radialGradient cx="0" cy="0" gradientTransform="matrix(1284.59 -1232 1306.43 841.25 80.1675 169)" gradientUnits="userSpaceOnUse" id="paint0_radial" r="1">
              <stop stopColor="#e9d5f0" stopOpacity="0.3" />
              <stop offset="0.588369" stopColor="#fef8fb" />
              <stop offset="1" stopColor="#c5d9e8" stopOpacity="0.3" />
            </radialGradient>
          </defs>
          <path d="M0 0H1527V1440H0V0Z" fill="url(#paint0_radial)" />
        </svg>
      </div>

      {/* Nav */}
      <div className="relative bg-[#fdfcfe] h-[60px] sm:h-[69px] border-b border-gray-100">
        <div className="flex items-center h-full px-4 sm:px-[30px]">
          <img alt="nowadays logo" className="size-[36px] sm:size-[45px] object-cover flex-shrink-0" src={imgImage4} />
          <p className="ml-3 sm:ml-[17px] text-[18px] sm:text-[20px] font-medium text-[#1e1e1e]">nowadays</p>
        </div>
      </div>

      {/* Hero */}
      <div className="relative mt-8 sm:mt-[52px] text-center px-4">
        <h1 className="text-[34px] sm:text-[48px] lg:text-[64px] font-semibold text-[#1c1c1e] tracking-[-1.5px] sm:tracking-[-2.56px] leading-tight">
          Event Approval Planner
        </h1>
        <p className="mt-4 sm:mt-[30px] text-[17px] sm:text-[24px] font-medium text-[#6b7280] tracking-[-0.5px] sm:tracking-[-0.96px]">
          From idea to sign-off in 60 seconds
        </p>
        <p className="mt-4 sm:mt-[32px] mx-auto max-w-[794px] text-[14px] sm:text-[16px] text-[#6b7280] leading-relaxed">
          Get a complete ready-to-send exec memo, <span className="font-semibold">all in one place</span>. No spreadsheets, no back-and-forth. Just the numbers you need to get approved and start planning.
        </p>
      </div>

      {/* Form Card */}
      <div className="relative mx-auto mt-8 sm:mt-[62px] mb-16 sm:mb-[100px] w-full max-w-[1193px] px-4">
        <div className="bg-white border border-[#d1d5db] rounded-[16px] sm:rounded-[20px] p-5 sm:p-10 lg:p-[68px_68px_54px_68px] shadow-sm">

          <h2 className="text-[18px] sm:text-[20px] font-medium text-black tracking-[-0.5px] sm:tracking-[-0.8px] mb-6 sm:mb-[43px]">
            Event Details
          </h2>

          <div className="space-y-6 sm:space-y-[43px]">

            {/* Event Type + Guest Type — single col on mobile, 2-col on sm+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8 lg:gap-[69px]">

              <div className="relative">
                <label className="block text-[14px] sm:text-[16px] text-[#1e1e1e] mb-2 sm:mb-[10px]">Event Type</label>
                <div className="relative">
                  <button
                    onClick={() => { setEventTypeOpen(!eventTypeOpen); setGuestTypeOpen(false); }}
                    className="w-full h-[46px] px-4 bg-white border border-[#d1d5db] rounded-[10px] text-left text-[14px] sm:text-[16px] flex items-center justify-between hover:border-[#b5b5b5] transition-colors"
                  >
                    <span className={eventType ? 'text-[#1e1e1e]' : 'text-[#9ca3af]'}>{eventType || 'Select event type'}</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={`transition-transform flex-shrink-0 ${eventTypeOpen ? 'rotate-180' : ''}`}>
                      <path d="M7 10L12 15L17 10" stroke="#1e1e1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {eventTypeOpen && (
                    <div className="absolute z-50 mt-2 w-full bg-white border border-[#d1d5db] rounded-[10px] shadow-lg max-h-[260px] overflow-auto">
                      {eventTypeOptions.map((o) => (
                        <button key={o} onClick={() => { setEventType(o); setEventTypeOpen(false); }}
                          className="w-full px-4 py-3 text-left text-[14px] sm:text-[16px] text-[#1e1e1e] hover:bg-[#f3f4f6] transition-colors first:rounded-t-[10px] last:rounded-b-[10px]">
                          {o}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="relative">
                <label className="block text-[14px] sm:text-[16px] text-[#1e1e1e] mb-2 sm:mb-[10px]">Guest Type</label>
                <div className="relative">
                  <button
                    onClick={() => { setGuestTypeOpen(!guestTypeOpen); setEventTypeOpen(false); }}
                    className="w-full h-[46px] px-4 bg-white border border-[#d1d5db] rounded-[10px] text-left text-[14px] sm:text-[16px] flex items-center justify-between hover:border-[#b5b5b5] transition-colors"
                  >
                    <span className={guestType ? 'text-[#1e1e1e]' : 'text-[#9ca3af]'}>{guestType || 'Select guest type'}</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={`transition-transform flex-shrink-0 ${guestTypeOpen ? 'rotate-180' : ''}`}>
                      <path d="M7 10L12 15L17 10" stroke="#1e1e1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {guestTypeOpen && (
                    <div className="absolute z-50 mt-2 w-full bg-white border border-[#d1d5db] rounded-[10px] shadow-lg max-h-[260px] overflow-auto">
                      {guestTypeOptions.map((o) => (
                        <button key={o} onClick={() => { setGuestType(o); setGuestTypeOpen(false); }}
                          className="w-full px-4 py-3 text-left text-[14px] sm:text-[16px] text-[#1e1e1e] hover:bg-[#f3f4f6] transition-colors first:rounded-t-[10px] last:rounded-b-[10px]">
                          {o}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-[14px] sm:text-[16px] text-[#1e1e1e] mb-2 sm:mb-[10px]">Budget</label>
              {/* Stack vertically on mobile */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                <div className="relative w-full sm:w-[445px] flex-shrink-0">
                  <span className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[14px] sm:text-[16px] text-[#1e1e1e] font-medium pointer-events-none">$</span>
                  <input
                    type="text"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value.replace(/[^0-9,]/g, ''))}
                    placeholder="0"
                    className="w-full h-[46px] pl-[30px] pr-4 bg-white border border-[#d1d5db] rounded-[10px] text-[14px] sm:text-[16px] text-[#1e1e1e] focus:outline-none focus:border-[#5B52E7] transition-colors"
                  />
                </div>
                <a
                  href="https://www.nowadays.ai/budget-estimator"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] sm:text-[16px] text-[#5B52E7] underline hover:text-[#4842c7] transition-colors"
                >
                  Don't have a budget? Use the Budget Estimator →
                </a>
              </div>
            </div>

            {/* Goals */}
            <div>
              <label className="block text-[14px] sm:text-[16px] text-[#1e1e1e] mb-2 sm:mb-[10px]">
                Goals & Purpose{' '}
                <span className="text-[#6b7280]">— Write 1-2 sentences about what you hope to achieve</span>
              </label>
              <input
                type="text"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="e.g. Align the leadership team on Q3 strategy and strengthen cross-functional relationships."
                className="w-full h-[46px] px-4 bg-white border border-[#d1d5db] rounded-[10px] text-[14px] sm:text-[16px] text-[#1e1e1e] focus:outline-none focus:border-[#5B52E7] transition-colors"
              />
            </div>
          </div>

          {error   && <p className="mt-4 text-[13px] text-red-600">{error}</p>}
          {loading && <p className="mt-4 text-[13px] text-[#5B52E7]">Generating your exec memo, this takes about 15 seconds…</p>}

          {/* CTA — full-width on mobile, right-aligned on desktop */}
          <div className="flex justify-center sm:justify-end mt-7 sm:mt-[46px]">
            <button
              onClick={handleOpenPDF}
              disabled={loading}
              className={`w-full sm:w-auto h-[52px] px-[32px] text-white text-[14px] font-semibold rounded-[26px] border-2 border-white shadow-md transition-colors ${
                loading
                  ? 'bg-[#9490f0] cursor-not-allowed'
                  : 'bg-[#5B52E7] hover:bg-[#4842c7] cursor-pointer'
              }`}
            >
              {loading ? "Generating..." : "Open PDF summary"}
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop to close dropdowns */}
      {(eventTypeOpen || guestTypeOpen) && (
        <div className="fixed inset-0 z-40" onClick={() => { setEventTypeOpen(false); setGuestTypeOpen(false); }} />
      )}
      <Analytics />
    </div>
  );
}
