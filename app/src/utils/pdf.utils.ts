// pdf.utils.ts

import PDFDocument from "pdfkit";
import fs from "fs";
import { TableData } from "./templates/reports/reports.templates";

/**
 * Draws a table using PDFKit.
 */
export function drawTable(
  doc: PDFKit.PDFDocument,
  table: TableData,
  options: {
    x?: number | undefined;
    y?: number | undefined;
    headerColor?: string | undefined;
    textColor?: string | undefined;
    rowGap?: number | undefined;
    headerFontSize?: number | undefined;
    bodyFontSize?: number | undefined;
  } = {}
) {
  const {
    x = 50,
    y = doc.y,
    headerColor = "#009688",
    textColor = "#000000",
    rowGap = 6,
    headerFontSize = 12,
    bodyFontSize = 10,
  } = options;

  const colWidths = table.columns.map((c) => c.width || 100);
  const totalWidth = colWidths.reduce((a, b) => a + b, 0);

  let currentY = y;

  // Header row
  doc.font("Helvetica-Bold").fontSize(headerFontSize).fillColor(headerColor);
  table.columns.forEach((col, i) => {
    doc.text(col.header, x + i * colWidths[i]!, currentY, {
      width: colWidths[i],
      align: col.align || "left",
    });
  });

  currentY += headerFontSize + rowGap;
  doc
    .moveTo(x, currentY - rowGap / 2)
    .lineTo(x + totalWidth, currentY - rowGap / 2)
    .strokeColor(headerColor)
    .stroke();

  // Rows
  doc.font("Helvetica").fontSize(bodyFontSize).fillColor(textColor);
  table.rows.forEach((row) => {
    table.columns.forEach((col, i) => {
      const value = row[col.key] ?? "";
      doc.text(String(value), x + i * colWidths[i]!, currentY, {
        width: colWidths[i],
        align: col.align || "left",
      });
    });
    currentY += bodyFontSize + rowGap;
  });

  return currentY;
}

/**
 * Generates a full PDF report file using a given template.
 */
export function generatePDFReport(
  template: ReturnType<(...args: any[]) => any>,
  branding?: {
    companyName?: string;
    logoPath?: string;
    primaryColor?: string;
  },
  outputPath = "report.pdf"
) {
  const doc = new PDFDocument({ margin: 40 });
  doc.pipe(fs.createWriteStream(outputPath));

  // --- Branding header ---
  if (branding?.logoPath) {
    try {
      doc.image(branding.logoPath, 40, 30, { width: 50 });
    } catch {}
  }

  doc
    .fillColor(branding?.primaryColor || "black")
    .fontSize(18)
    .text(branding?.companyName || "Report", 100, 40);
  doc.moveDown(2);

  // --- Title ---
  doc
    .fontSize(20)
    .fillColor("black")
    .text(template.header, { align: "center" });
  doc.moveDown();

  // --- Body ---
  if (template.body) {
    doc.fontSize(12).text(template.body);
    doc.moveDown();
  }

  // --- Table ---
  if (template.table) {
    drawTable(doc, template.table, {
      headerColor: branding?.primaryColor,
      x: 50,
      y: doc.y,
    });
  }

  // --- Footer ---
  doc.moveDown(2);
  if (template.footer) {
    doc
      .fontSize(10)
      .fillColor("gray")
      .text(template.footer, { align: "center" });
  }

  doc.end();
}
