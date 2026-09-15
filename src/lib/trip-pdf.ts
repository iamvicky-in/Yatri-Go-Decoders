import { jsPDF } from "jspdf";
import type { TripPlan } from "./trip-engine";
import { formatINR, type Vendor } from "./yatri-data";

const MARGIN = 48;
const LINE = 15;

function rupees(n: number) {
  // jsPDF core fonts have no rupee glyph, so use INR in the document.
  return formatINR(n).replace("₹", "INR ");
}

export function downloadTripPlanPdf(plan: TripPlan, vendors: Vendor[] = []) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxWidth = pageWidth - MARGIN * 2;
  let y = MARGIN;

  function newPageIfNeeded(space = LINE) {
    if (y + space > pageHeight - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
  }

  function text(value: string, size = 10, style: "normal" | "bold" = "normal", gap = LINE) {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    const safe = value
      .replace(/\u20b9\s?/g, "INR ")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\u00d7/g, "x")
      .replace(/\u00b7/g, "|")
      .replace(/[\u2013\u2014]/g, "-")
      .replace(/[^\x00-\x7F]/g, " ");
    const lines = doc.splitTextToSize(safe, maxWidth) as string[];
    for (const line of lines) {
      newPageIfNeeded(gap);
      doc.text(line, MARGIN, y);
      y += gap;
    }
  }

  function rule(gap = 10) {
    newPageIfNeeded(gap);
    doc.setDrawColor(200);
    doc.line(MARGIN, y, pageWidth - MARGIN, y);
    y += gap;
  }

  // Header
  text("YATRI GO", 16, "bold", 20);
  text("Plan Smarter. Travel Better.", 9, "normal", 16);
  rule();

  text(plan.input.destination.toUpperCase(), 20, "bold", 26);
  text(
    `${plan.nights} nights / ${plan.days} days  ·  ${plan.input.travellers} travellers  ·  ${plan.input.startDate} to ${plan.input.endDate}`,
    10,
  );
  text(
    `Stay: ${plan.input.accommodation}  ·  Transport: ${plan.input.transport}  ·  Food: ${plan.input.food}`,
    10,
  );
  if (plan.input.interests.length) text(`Interests: ${plan.input.interests.join(", ")}`, 10);
  rule();

  // Budget
  text("Budget summary", 13, "bold", 20);
  const rows: Array<[string, number]> = [
    ["Total budget", plan.input.budget],
    ["Confirmed-price total", plan.total],
    ["Remaining buffer", Math.max(0, plan.remaining)],
    ["Accommodation", plan.budget.accommodation],
    ["Food", plan.budget.food],
    ["Transport", plan.budget.transport],
    ["Activities", plan.budget.activities],
    ["Contingency", plan.budget.contingency],
  ];
  for (const [label, amount] of rows) {
    newPageIfNeeded();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(label, MARGIN, y);
    doc.text(rupees(amount), pageWidth - MARGIN, y, { align: "right" });
    y += LINE;
  }
  rule();

  // Itinerary
  text("Day-by-day itinerary", 13, "bold", 20);
  for (const day of plan.itinerary) {
    newPageIfNeeded(40);
    text(`Day ${day.day} — ${day.title}`, 11, "bold", 17);
    for (const a of day.activities) {
      text(
        `${a.time}  ${a.title}  (${a.priceConfirmed ? rupees(a.cost) : "Price unavailable"})`,
        10,
        "normal",
        13,
      );
      if (a.note) text(`      ${a.note}`, 9, "normal", 12);
    }
    y += 6;
  }
  rule();

  // Vendor contacts
  const contacts = vendors.slice(0, 12);
  if (contacts.length) {
    text("Local verified contacts", 13, "bold", 20);
    for (const v of contacts) {
      text(`${v.name} — ${v.category}`, 10, "bold", 13);
      text(
        `      ${v.phone}  ·  ${v.area ? `${v.area}, ` : ""}${v.city}  ·  ${v.hours}`,
        9,
        "normal",
        13,
      );
    }
    rule();
  }

  // Emergency
  text("Emergency numbers (India)", 13, "bold", 20);
  text("All-in-one emergency: 112   ·   Ambulance: 108   ·   Police: 100   ·   Fire: 101", 10);
  text("Women helpline: 1091   ·   Tourist helpline: 1363   ·   Road accident: 1073", 10);
  y += 6;
  text(
    "Keep this file on your phone. It works fully offline and holds your plan, budget, contacts and emergency numbers.",
    9,
  );

  const name = `yatri-go-${plan.input.destination.toLowerCase().replace(/\s+/g, "-")}-plan.pdf`;
  doc.save(name);
}
