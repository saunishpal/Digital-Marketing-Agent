import { jsPDF } from "jspdf";

export async function copyToClipboard(text: string) {
  await navigator.clipboard.writeText(text);
}

export function downloadTextAsPdf(title: string, content: string) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  const lines = doc.splitTextToSize(content, pageWidth - margin * 2);

  doc.setFontSize(16);
  doc.text(title, margin, 20);

  doc.setFontSize(11);

  let y = 30;
  lines.forEach((line: string) => {
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
    doc.text(line, margin, y);
    y += 6;
  });

  doc.save(`${title.toLowerCase().replace(/\s+/g, "-")}.pdf`);
}