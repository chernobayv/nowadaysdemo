import { useState, useEffect } from 'react';

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

async function buildPDF(m: any, eventType: string, guestType: string, budget: string, goals: string) {
  const JsPDF = await loadJsPDF();
  const doc = new JsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210, mg = 22, cW = W - mg * 2;
  let y = 0;

  const purple: [number, number, number] = [91, 82, 231];
  const purpleLight: [number, number, number] = [237, 235, 253];
  const ink: [number, number, number] = [28, 28, 30];
  const mid: [number, number, number] = [75, 85, 99];
  const muted: [number, number, number] = [156, 163, 175];
  const white: [number, number, number] = [255, 255, 255];
  const lightGray: [number, number, number] = [249, 250, 251];
  const borderGray: [number, number, number] = [229, 231, 235];

  // ── Header ─────────────────────────────────────────────────────────────────
  doc.setFillColor(...purple);
  doc.rect(0, 0, W, 24, "F");
  doc.setTextColor(...white);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("nowadays", mg, 15);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text("Event Approval Planner — Demo", mg + 30, 15);
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  doc.text(today, W - mg, 15, { align: "right" });
  y = 36;

  // ── Title ──────────────────────────────────────────────────────────────────
  doc.setTextColor(...ink);
  doc.setFontSize(19);
  doc.setFont("helvetica", "bold");
  const titleLines = doc.splitTextToSize(m.eventTitle || "Event Approval Memo", cW);
  doc.text(titleLines, mg, y);
  y += titleLines.length * 7;

  doc.setFontSize(9.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...mid);
  doc.text([eventType, guestType || "Internal team", m.suggestedDate || ""].filter(Boolean).join("  ·  "), mg, y);
  y += 9;
  doc.setDrawColor(...borderGray);
  doc.setLineWidth(0.25);
  doc.line(mg, y, W - mg, y);
  y += 9;

  // ── Metric cards ───────────────────────────────────────────────────────────
  const mW = (cW - 9) / 4;
  [
    { label: "Budget", val: `$${budget}` },
    { label: "Estimated Cost", val: m.estimatedTotal || "—" },
    { label: "Cost / Person", val: m.costPerPerson || "—" },
    { label: "Best City", val: m.recommendedCity || "—" },
  ].forEach((c, i) => {
    const x = mg + i * (mW + 3);
    doc.setFillColor(...lightGray);
    doc.setDrawColor(...borderGray);
    doc.setLineWidth(0.25);
    doc.roundedRect(x, y, mW, 17, 2, 2, "FD");
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...muted);
    doc.text(c.label.toUpperCase(), x + mW / 2, y + 6, { align: "center" });
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...ink);
    const valLines = doc.splitTextToSize(c.val, mW - 4);
    doc.text(valLines[0] || c.val, x + mW / 2, y + 12.5, { align: "center" });
  });
  y += 24;

  // ── Section helper ─────────────────────────────────────────────────────────
  function section(title: string, body: string) {
    if (y > 252) { doc.addPage(); y = 22; }
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...purple);
    doc.text(title.toUpperCase(), mg, y);
    y += 4;
    doc.setDrawColor(...purple);
    doc.setLineWidth(0.35);
    doc.line(mg, y, mg + 28, y);
    y += 5;
    doc.setFontSize(9.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...mid);
    const lines = doc.splitTextToSize(body, cW);
    lines.forEach((l: string) => {
      if (y > 272) { doc.addPage(); y = 22; }
      doc.text(l, mg, y);
      y += 5.5;
    });
    y += 5;
  }

  section("Executive Summary", m.executiveSummary || "");
  section("Business Case & ROI", m.businessCase || "");
  section("Goals & Purpose", goals);

  // ── Budget breakdown table ─────────────────────────────────────────────────
  if (y > 195) { doc.addPage(); y = 22; }
  doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(...purple);
  doc.text("BUDGET BREAKDOWN", mg, y); y += 4;
  doc.setDrawColor(...purple); doc.setLineWidth(0.35);
  doc.line(mg, y, mg + 28, y); y += 6;

  // Column widths — notes column is narrow to force short text
  const colCat = 58;
  const colEst = 35;
  const colNotes = cW - colCat - colEst - 6;

  // Table header
  doc.setFillColor(...purple); doc.rect(mg, y, cW, 7.5, "F");
  doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(...white);
  doc.text("Category", mg + 3, y + 5);
  doc.text("Estimate", mg + colCat + 5, y + 5);
  doc.text("Notes", mg + colCat + colEst + 5, y + 5);
  y += 7.5;

  (m.breakdown || []).forEach((row: any, i: number) => {
    if (y > 265) { doc.addPage(); y = 22; }

    doc.setFontSize(8.5);
    // Truncate notes to max 6 words as a safety net on top of the prompt
    const rawNote = (row.notes || "");
    const words = rawNote.split(" ");
    const shortNote = words.length > 7 ? words.slice(0, 7).join(" ") + "…" : rawNote;

    const catLines = doc.splitTextToSize(row.category || "", colCat - 4);
    const estLines = doc.splitTextToSize(row.estimate || "", colEst - 4);
    const noteLines = doc.splitTextToSize(shortNote, colNotes - 4);
    const maxLines = Math.max(catLines.length, estLines.length, noteLines.length);
    const rowH = Math.max(7, maxLines * 5 + 4);

    doc.setFillColor(i % 2 === 0 ? 249 : 244, i % 2 === 0 ? 250 : 246, i % 2 === 0 ? 251 : 253);
    doc.rect(mg, y, cW, rowH, "F");

    doc.setFont("helvetica", "normal"); doc.setTextColor(...ink);
    doc.text(catLines, mg + 3, y + 5);

    doc.setFont("helvetica", "bold"); doc.setTextColor(...purple);
    doc.text(estLines, mg + colCat + 5, y + 5);

    doc.setFont("helvetica", "normal"); doc.setTextColor(...mid);
    doc.text(noteLines, mg + colCat + colEst + 5, y + 5);

    y += rowH;
  });
  y += 7;

  section("Recommendation & Next Steps", m.recommendation || "");
  section("Why Nowadays", m.nowadaysValue || "Nowadays handles all venue sourcing, negotiations, and vendor management — saving your team weeks of back-and-forth. Our platform typically saves clients 15–20% on total event costs through exclusive partnerships and smart negotiation.");

  // ── City callout ───────────────────────────────────────────────────────────
  if (m.cityReason && m.recommendedCity) {
    if (y > 255) { doc.addPage(); y = 22; }
    doc.setFontSize(8.5);
    const cityReasonLines = doc.splitTextToSize(m.cityReason, cW - 12);
    const cityBoxH = 10 + cityReasonLines.length * 5.5;
    doc.setFillColor(...purpleLight);
    doc.setDrawColor(...purple);
    doc.setLineWidth(0.4);
    doc.roundedRect(mg, y, cW, cityBoxH, 3, 3, "FD");
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...purple);
    doc.text(`Recommended destination: ${m.recommendedCity}`, mg + 5, y + 6.5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...mid);
    doc.text(cityReasonLines, mg + 5, y + 12);
    y += cityBoxH + 5;
  }

  // ── Disclaimer ─────────────────────────────────────────────────────────────
  if (y > 265) { doc.addPage(); y = 22; }
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(...muted);
  const disclaimer = "This document was generated as a planning aid and cost estimates are approximate. Final pricing will vary based on vendor availability, location, and negotiated rates. All figures should be verified with Nowadays prior to formal budget approval.";
  const discLines = doc.splitTextToSize(disclaimer, cW);
  discLines.forEach((l: string) => {
    if (y > 278) { doc.addPage(); y = 22; }
    doc.text(l, mg, y);
    y += 4.5;
  });

  // ── Footer ─────────────────────────────────────────────────────────────────
  const pages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFillColor(245, 244, 255);
    doc.rect(0, 284, W, 13, "F");
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...muted);
    doc.text("Prepared using Nowadays Event Approval Planner · nowadays.ai", mg, 292);
    doc.text(`Page ${i} of ${pages}`, W - mg, 292, { align: "right" });
  }

  window.open(URL.createObjectURL(doc.output("blob")), "_blank");
}

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
    if (!budget) { setError("Please enter a budget."); return; }
    if (!goals) { setError("Please describe your goals and purpose."); return; }
    setLoading(true);
    setError("");

    // Lightly enhance goals to sound more professional
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
          generationConfig: { temperature: 0.2, maxOutputTokens: 4000 },
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
    <div className="relative size-full overflow-auto" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* Background */}
      <div className="absolute inset-0 -z-10">
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
      <div className="relative bg-[#fdfcfe] h-[69px] border-b border-gray-100">
        <div className="flex items-center h-full px-[30px]">
          <img alt="nowadays logo" className="size-[45px] object-cover" src={imgImage4} />
          <p className="ml-[17px] text-[20px] font-medium text-[#1e1e1e]">nowadays</p>
        </div>
      </div>

      {/* Hero */}
      <div className="relative mt-[52px] text-center">
        <h1 className="text-[64px] font-semibold text-[#1c1c1e] tracking-[-2.56px] leading-none">
          Event Approval Planner
        </h1>
        <p className="mt-[30px] text-[24px] font-medium text-[#6b7280] tracking-[-0.96px]">
          From idea to sign-off in 60 seconds
        </p>
        <p className="mt-[32px] mx-auto max-w-[794px] text-[16px] text-[#6b7280] tracking-[-0.64px] leading-normal px-4">
          Get a complete ready-to-send exec memo, <span className="font-semibold">all in one place</span>. No spreadsheets, no back-and-forth. Just the numbers you need to get approved and start planning.
        </p>
      </div>

      {/* Form Card */}
      <div className="relative mx-auto mt-[62px] mb-[100px] w-full max-w-[1193px] px-4">
        <div className="bg-white border border-[#d1d5db] rounded-[20px] p-[68px_68px_54px_68px] shadow-sm">
          <h2 className="text-[20px] font-medium text-black tracking-[-0.8px] mb-[43px]">Event Details</h2>

          <div className="space-y-[43px]">

            {/* Event Type + Guest Type */}
            <div className="grid grid-cols-2 gap-[69px]">
              <div className="relative">
                <label className="block text-[16px] text-[#1e1e1e] tracking-[-0.64px] mb-[10px]">Event Type</label>
                <div className="relative">
                  <button onClick={() => { setEventTypeOpen(!eventTypeOpen); setGuestTypeOpen(false); }}
                    className="w-full h-[46px] px-4 bg-white border border-[#d1d5db] rounded-[10px] text-left text-[16px] flex items-center justify-between hover:border-[#b5b5b5] transition-colors">
                    <span className={eventType ? 'text-[#1e1e1e]' : 'text-[#9ca3af]'}>{eventType || 'Select event type'}</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={`transition-transform flex-shrink-0 ${eventTypeOpen ? 'rotate-180' : ''}`}>
                      <path d="M7 10L12 15L17 10" stroke="#1e1e1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  {eventTypeOpen && (
                    <div className="absolute z-50 mt-2 w-full bg-white border border-[#d1d5db] rounded-[10px] shadow-lg max-h-[300px] overflow-auto">
                      {eventTypeOptions.map((o) => (
                        <button key={o} onClick={() => { setEventType(o); setEventTypeOpen(false); }}
                          className="w-full px-4 py-3 text-left text-[16px] text-[#1e1e1e] hover:bg-[#f3f4f6] transition-colors first:rounded-t-[10px] last:rounded-b-[10px]">{o}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="relative">
                <label className="block text-[16px] text-[#1e1e1e] tracking-[-0.64px] mb-[10px]">Guest Type</label>
                <div className="relative">
                  <button onClick={() => { setGuestTypeOpen(!guestTypeOpen); setEventTypeOpen(false); }}
                    className="w-full h-[46px] px-4 bg-white border border-[#d1d5db] rounded-[10px] text-left text-[16px] flex items-center justify-between hover:border-[#b5b5b5] transition-colors">
                    <span className={guestType ? 'text-[#1e1e1e]' : 'text-[#9ca3af]'}>{guestType || 'Select guest type'}</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={`transition-transform flex-shrink-0 ${guestTypeOpen ? 'rotate-180' : ''}`}>
                      <path d="M7 10L12 15L17 10" stroke="#1e1e1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  {guestTypeOpen && (
                    <div className="absolute z-50 mt-2 w-full bg-white border border-[#d1d5db] rounded-[10px] shadow-lg max-h-[300px] overflow-auto">
                      {guestTypeOptions.map((o) => (
                        <button key={o} onClick={() => { setGuestType(o); setGuestTypeOpen(false); }}
                          className="w-full px-4 py-3 text-left text-[16px] text-[#1e1e1e] hover:bg-[#f3f4f6] transition-colors first:rounded-t-[10px] last:rounded-b-[10px]">{o}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-[16px] text-[#1e1e1e] tracking-[-0.64px] mb-[10px]">Budget</label>
              <div className="flex items-center gap-[24px]">
                <div className="relative flex-shrink-0 w-[445px]">
                  <span className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[16px] text-[#1e1e1e] font-medium pointer-events-none">$</span>
                  <input type="text" value={budget} onChange={(e) => setBudget(e.target.value.replace(/[^0-9,]/g, ''))} placeholder="0"
                    className="w-full h-[46px] pl-[30px] pr-4 bg-white border border-[#d1d5db] rounded-[10px] text-[16px] text-[#1e1e1e] focus:outline-none focus:border-[#5B52E7] transition-colors" />
                </div>
                <a href="https://www.nowadays.ai/budget-estimator" target="_blank" rel="noopener noreferrer"
                  className="text-[16px] text-[#5B52E7] tracking-[-0.64px] underline hover:text-[#4842c7] transition-colors whitespace-nowrap">
                  Don't have a budget? Use the Budget Estimator →
                </a>
              </div>
            </div>

            {/* Goals */}
            <div>
              <label className="block text-[16px] text-[#1e1e1e] tracking-[-0.64px] mb-[10px]">
                Goals & Purpose — <span className="text-[#6b7280]">Write 1-2 sentences about what you hope to achieve</span>
              </label>
              <input type="text" value={goals} onChange={(e) => setGoals(e.target.value)}
                placeholder="e.g. Align the leadership team on Q3 strategy and strengthen cross-functional relationships."
                className="w-full h-[46px] px-4 bg-white border border-[#d1d5db] rounded-[10px] text-[16px] text-[#1e1e1e] focus:outline-none focus:border-[#5B52E7] transition-colors" />
            </div>
          </div>

          {error && <p className="mt-[16px] text-[13px] text-red-600">{error}</p>}
          {loading && <p className="mt-[16px] text-[13px] text-[#5B52E7]">Generating your exec memo, this takes about 15 seconds…</p>}

          <div className="flex justify-end mt-[46px]">
            <button onClick={handleOpenPDF} disabled={loading}
              className={`h-[52px] px-[32px] text-white text-[14px] font-semibold tracking-[-0.56px] rounded-[26px] border-2 border-white shadow-md transition-colors ${
                loading ? 'bg-[#9490f0] cursor-not-allowed' : 'bg-[#5B52E7] hover:bg-[#4842c7] cursor-pointer'
              }`}>
              {loading ? "Generating..." : "Open PDF summary"}
            </button>
          </div>
        </div>
      </div>

      {(eventTypeOpen || guestTypeOpen) && (
        <div className="fixed inset-0 z-40" onClick={() => { setEventTypeOpen(false); setGuestTypeOpen(false); }} />
      )}
    </div>
  );
}
