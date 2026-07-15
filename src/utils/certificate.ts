import { jsPDF } from "jspdf";

interface CertificateData {
  name: string;
  email: string;
  iqScore: number;
  correctCount: number;
  timeTakenString: string;
  classification: string;
  percentile: number;
  date: string;
  certificateId: string;
}

export function generateCertificatePDF(data: CertificateData) {
  // A4 Landscape is 297mm x 210mm
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4"
  });

  const width = 297;
  const height = 210;

  // 1. Luxurious Ivory Paper Background
  doc.setFillColor(253, 252, 247); // Cream/Ivory #FDFCF7
  doc.rect(0, 0, width, height, "F");

  // Colors for the Premium Academic Theme
  const charcoalRGB = { r: 30, g: 41, b: 59 }; // #1E293B - Obsidian Text
  const goldRGB = { r: 197, g: 160, b: 89 };   // #C5A059 - Antique Gold Accents
  const slateRGB = { r: 100, g: 116, b: 139 }; // #64748B - Muted Text

  // Main primary theme color mapping based on performance tier
  let themeColorRGB = goldRGB; // Default Gold
  let textOnThemeColor = { r: 255, g: 255, b: 255 }; // White text on badge by default

  if (data.iqScore >= 160) {
    themeColorRGB = { r: 109, g: 40, b: 217 }; // Deep Amethyst (Genius)
  } else if (data.iqScore >= 145) {
    themeColorRGB = { r: 51, g: 65, b: 85 };    // Premium Charcoal/Platinum (Highly Gifted)
  } else if (data.iqScore >= 130) {
    themeColorRGB = { r: 180, g: 120, b: 10 };  // Antique Gold (Gifted)
  } else if (data.iqScore >= 115) {
    themeColorRGB = { r: 29, g: 78, b: 216 };   // Royal Sapphire (Superior)
  } else {
    themeColorRGB = { r: 30, g: 58, b: 138 };   // Executive Navy (Above Average/Average)
  }

  // 2. Subtle Background watermark pattern "NE" (Academic Monogram)
  doc.setTextColor(245, 240, 228); // Faint golden-cream watermark
  doc.setFont("times", "italic");
  doc.setFontSize(8);
  for (let y = 15; y < height; y += 35) {
    for (let x = 15; x < width; x += 35) {
      doc.text("NE", x, y);
    }
  }

  // 3. Outer border (1.5mm classic gold line, 8mm from edges)
  doc.setDrawColor(goldRGB.r, goldRGB.g, goldRGB.b);
  doc.setLineWidth(1.5);
  doc.rect(8, 8, width - 16, height - 16, "D");

  // 4. Inner border (0.5mm deep slate line, 11mm from edges)
  doc.setDrawColor(charcoalRGB.r, charcoalRGB.g, charcoalRGB.b);
  doc.setLineWidth(0.4);
  doc.rect(11, 11, width - 22, height - 22, "D");

  // 5. Draw small gold diamonds between outer and inner borders (spacing ~20mm)
  doc.setFillColor(goldRGB.r, goldRGB.g, goldRGB.b);
  const drawDiamond = (cx: number, cy: number, size: number) => {
    doc.triangle(cx, cy - size, cx - size, cy, cx + size, cy, "F");
    doc.triangle(cx, cy + size, cx - size, cy, cx + size, cy, "F");
  };

  for (let x = 20; x < width - 20; x += 25) {
    drawDiamond(x, 9.5, 1.2);
    drawDiamond(x, height - 9.5, 1.2);
  }
  for (let y = 20; y < height - 20; y += 25) {
    drawDiamond(9.5, y, 1.2);
    drawDiamond(width - 9.5, y, 1.2);
  }

  // 6. Traditional Academic Corner Ornaments
  const drawCornerOrnament = (cx: number, cy: number, dx: number, dy: number) => {
    doc.setLineWidth(0.8);
    doc.setDrawColor(goldRGB.r, goldRGB.g, goldRGB.b);
    // Outer bracket
    doc.line(cx, cy, cx + dx * 15, cy);
    doc.line(cx, cy, cx, cy + dy * 15);
    // Inner slate offset bracket
    doc.setDrawColor(charcoalRGB.r, charcoalRGB.g, charcoalRGB.b);
    doc.line(cx + dx * 3, cy + dy * 3, cx + dx * 12, cy + dy * 3);
    doc.line(cx + dx * 3, cy + dy * 3, cx + dx * 3, cy + dy * 12);
  };

  drawCornerOrnament(14, 14, 1, 1); // Top Left
  drawCornerOrnament(width - 14, 14, -1, 1); // Top Right
  drawCornerOrnament(14, height - 14, 1, -1); // Bottom Left
  drawCornerOrnament(width - 14, height - 14, -1, -1); // Bottom Right

  // 7. Logo Header centered
  const centerX = width / 2;
  
  // "NEURAL EDGE" text in premium serif font
  doc.setTextColor(charcoalRGB.r, charcoalRGB.g, charcoalRGB.b);
  doc.setFont("times", "bold");
  doc.setFontSize(26);
  doc.text("NEURAL   EDGE", centerX, 25, { align: "center" });

  // Thin gold dividing line below logo
  doc.setDrawColor(goldRGB.r, goldRGB.g, goldRGB.b);
  doc.setLineWidth(0.5);
  doc.line(centerX - 45, 29, centerX + 45, 29);

  // Sub-badge: CERTIFICATE OF COGNITIVE ACHIEVEMENT
  doc.setTextColor(themeColorRGB.r, themeColorRGB.g, themeColorRGB.b);
  doc.setFont("times", "bold");
  doc.setFontSize(10.5);
  doc.text("C E R T I F I C A T E   O F   C O G N I T I V E   A C H I E V E M E N T", centerX, 35, { align: "center" });

  doc.setTextColor(slateRGB.r, slateRGB.g, slateRGB.b);
  doc.setFont("times", "normal");
  doc.setFontSize(8.5);
  doc.text("Elite Intelligence Assessment • Globally Standardized Protocol", centerX, 40, { align: "center" });

  // Decorative element (line + gold diamond + line)
  doc.setDrawColor(goldRGB.r, goldRGB.g, goldRGB.b);
  doc.line(centerX - 15, 45, centerX - 3, 45);
  drawDiamond(centerX, 45, 1.5);
  doc.line(centerX + 3, 45, centerX + 15, 45);

  // 8. Recipient details
  doc.setTextColor(charcoalRGB.r, charcoalRGB.g, charcoalRGB.b);
  doc.setFont("times", "italic");
  doc.setFontSize(11);
  doc.text("This is to certify that", centerX, 55, { align: "center" });

  // Full Name with elegant gold shadow/glow effect
  doc.setFont("times", "bold");
  doc.setFontSize(28);
  doc.setTextColor(goldRGB.r, goldRGB.g, goldRGB.b); // Soft gold shadow shift
  doc.text(data.name.toUpperCase(), centerX + 0.5, 67 + 0.5, { align: "center" });
  doc.setTextColor(charcoalRGB.r, charcoalRGB.g, charcoalRGB.b); // Main text
  doc.text(data.name.toUpperCase(), centerX, 67, { align: "center" });

  // Recipient Description
  doc.setTextColor(slateRGB.r, slateRGB.g, slateRGB.b);
  doc.setFont("times", "normal");
  doc.setFontSize(10);
  doc.text("has successfully completed the comprehensive cognitive assessment, demonstrating exceptional", centerX, 76, { align: "center" });
  doc.text("intellectual capabilities and reasoning proficiency, achieving a certified score of:", centerX, 81, { align: "center" });

  // HUGE IQ SCORE (Centered with gold under-shadow)
  doc.setFont("times", "bold");
  doc.setFontSize(72);
  doc.setTextColor(goldRGB.r, goldRGB.g, goldRGB.b); // Shadow
  doc.text(data.iqScore.toString(), centerX + 0.8, 107 + 0.8, { align: "center" });
  doc.setTextColor(themeColorRGB.r, themeColorRGB.g, themeColorRGB.b); // Main
  doc.text(data.iqScore.toString(), centerX, 107, { align: "center" });

  doc.setFont("times", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(slateRGB.r, slateRGB.g, slateRGB.b);
  doc.text("CERTIFIED IQ SCORE", centerX, 113, { align: "center" });

  // 9. Classification Badge Area
  const badgeWidth = 72;
  const badgeHeight = 9;
  const badgeX = centerX - badgeWidth / 2;
  const badgeY = 119;
  
  // Filled Rounded Rect for the badge
  doc.setFillColor(themeColorRGB.r, themeColorRGB.g, themeColorRGB.b);
  doc.rect(badgeX, badgeY, badgeWidth, badgeHeight, "F");

  // Badge Text
  doc.setTextColor(textOnThemeColor.r, textOnThemeColor.g, textOnThemeColor.b);
  doc.setFont("times", "bold");
  doc.setFontSize(11);
  doc.text(`✦ ${data.classification.toUpperCase()} ✦`, centerX, badgeY + 6.5, { align: "center" });

  // Percentile subtitle
  doc.setTextColor(charcoalRGB.r, charcoalRGB.g, charcoalRGB.b);
  doc.setFont("times", "italic");
  doc.setFontSize(9.5);
  doc.text(`Placing the candidate in the top ${data.percentile}% of the global population.`, centerX, 135, { align: "center" });


  // 10. Lower Section: Premium Seal & Illustrated Signature
  const colY = 154;
  const sealX = 85;
  const sigX = 212;

  // --- DRAW THE PREMIUM GOLD SEAL ---
  doc.setDrawColor(goldRGB.r, goldRGB.g, goldRGB.b);
  doc.setLineWidth(0.6);
  
  // Spikes for the star seal
  const numSpikes = 32;
  const rOuter = 15;
  const rInner = 12.5;
  for (let i = 0; i < numSpikes; i++) {
    const angle1 = (i * 2 * Math.PI) / numSpikes;
    const angle2 = ((i + 0.5) * 2 * Math.PI) / numSpikes;
    const x1 = sealX + rOuter * Math.cos(angle1);
    const y1 = colY + rOuter * Math.sin(angle1);
    const x2 = sealX + rInner * Math.cos(angle2);
    const y2 = colY + rInner * Math.sin(angle2);
    const angle3 = ((i + 1) * 2 * Math.PI) / numSpikes;
    const x3 = sealX + rOuter * Math.cos(angle3);
    const y3 = colY + rOuter * Math.sin(angle3);
    
    doc.setFillColor(goldRGB.r, goldRGB.g, goldRGB.b);
    doc.triangle(sealX, colY, x1, y1, x2, y2, "F");
    doc.triangle(sealX, colY, x2, y2, x3, y3, "F");
  }

  // Inner background circle of the seal
  doc.setFillColor(253, 252, 247); // Cream background
  doc.circle(sealX, colY, 11.5, "F");
  
  // Double gold borders inside seal
  doc.setDrawColor(goldRGB.r, goldRGB.g, goldRGB.b);
  doc.setLineWidth(0.4);
  doc.circle(sealX, colY, 10.5, "D");
  doc.circle(sealX, colY, 9, "D");

  // Text inside the seal
  doc.setTextColor(goldRGB.r, goldRGB.g, goldRGB.b);
  doc.setFont("times", "bold");
  doc.setFontSize(5.5);
  doc.text("NEURAL EDGE", sealX, colY - 2.5, { align: "center" });
  doc.setFontSize(7.5);
  doc.text("OFFICIAL", sealX, colY + 1.5, { align: "center" });
  doc.setFontSize(4.5);
  doc.text("★ SEAL ★", sealX, colY + 5, { align: "center" });

  // --- DRAW THE ILLUSTRATED CURSIVE SIGNATURE ---
  doc.setDrawColor(29, 78, 216); // Premium Royal Blue Ink
  doc.setLineWidth(0.6);
  
  const sX = sigX - 18;
  const sY = colY + 1;

  // J
  doc.line(sX, sY, sX + 4, sY - 12);
  doc.line(sX + 4, sY - 12, sX - 3, sY - 10);
  doc.line(sX, sY, sX - 3, sY + 3);
  doc.line(sX - 3, sY + 3, sX + 6, sY);
  
  // a
  doc.line(sX + 6, sY, sX + 9, sY - 3);
  doc.line(sX + 9, sY - 3, sX + 11, sY);
  doc.line(sX + 11, sY, sX + 11, sY - 4);
  doc.line(sX + 11, sY - 4, sX + 13, sY);

  // m
  doc.line(sX + 13, sY, sX + 15, sY - 4);
  doc.line(sX + 15, sY - 4, sX + 17, sY);
  doc.line(sX + 17, sY, sX + 19, sY - 4);
  doc.line(sX + 19, sY - 4, sX + 21, sY);
  doc.line(sX + 21, sY, sX + 23, sY - 4);
  doc.line(sX + 23, sY - 4, sX + 25, sY);

  // e
  doc.line(sX + 25, sY, sX + 27, sY - 3);
  doc.line(sX + 27, sY - 3, sX + 29, sY);

  // s
  doc.line(sX + 29, sY, sX + 31, sY - 3);
  doc.line(sX + 31, sY - 3, sX + 33, sY - 1);
  doc.line(sX + 33, sY - 1, sX + 35, sY);

  // Dynamic ink flourishes
  doc.line(sX + 30, sY, sX - 4, sY + 2);
  doc.line(sX - 4, sY + 2, sX + 38, sY + 0.5);

  // Clean printed underline and details
  doc.setDrawColor(slateRGB.r, slateRGB.g, slateRGB.b);
  doc.setLineWidth(0.25);
  doc.line(sigX - 25, colY + 5.5, sigX + 25, colY + 5.5);

  doc.setTextColor(charcoalRGB.r, charcoalRGB.g, charcoalRGB.b);
  doc.setFont("times", "bold");
  doc.setFontSize(8.5);
  doc.text("James", sigX, colY + 9.5, { align: "center" });
  
  doc.setTextColor(slateRGB.r, slateRGB.g, slateRGB.b);
  doc.setFont("times", "italic");
  doc.setFontSize(7.5);
  doc.text("NeuralEdge CEO & Founder", sigX, colY + 13.5, { align: "center" });


  // 11. Separation and elegant footer (properly positioned to avoid overlap)
  doc.setDrawColor(goldRGB.r, goldRGB.g, goldRGB.b);
  doc.setLineWidth(0.3);
  doc.line(15, height - 21, width - 15, height - 21);

  doc.setTextColor(slateRGB.r, slateRGB.g, slateRGB.b);
  doc.setFont("times", "normal");
  doc.setFontSize(8);
  doc.text(`Credential ID: ${data.certificateId}`, 15, height - 15);
  doc.text(`Assessment Date: ${data.date}`, centerX, height - 15, { align: "center" });
  doc.text("Verification Protocol: neuraledge.io/verify", width - 75, height - 15);


  // Save the document
  doc.save(`NeuralEdge_IQ_Certificate_${data.certificateId}.pdf`);
}

