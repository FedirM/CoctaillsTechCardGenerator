import { forwardRef, useImperativeHandle, useRef } from "react";
import type { Cocktail } from "@/types/cocktail";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

export interface PdfExportHandle {
  exportPdf: () => Promise<void>;
}

interface PdfExportProps {
  cocktails: Cocktail[];
}

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const LEFT_MARGIN_MM = 20;
const MARGIN_MM = 4;
const SCALE = 2;
const PX_PER_MM = 96 / 25.4;
const CONTENT_WIDTH_MM = A4_WIDTH_MM - LEFT_MARGIN_MM;
const CARD_WIDTH_PX = CONTENT_WIDTH_MM * PX_PER_MM;

const NO_IMAGE_PLACEHOLDER =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192">' +
      '<rect width="192" height="192" rx="8" fill="#f3f4f6"/>' +
      '<text x="96" y="100" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" fill="#9ca3af">No image</text>' +
      "</svg>"
  );

export const PdfExport = forwardRef<PdfExportHandle, PdfExportProps>(
  function PdfExport({ cocktails }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      exportPdf: async () => {
        const cards = cocktails.filter((c) => c.name.trim().length > 0);
        if (cards.length === 0) return;

        const container = containerRef.current;
        if (!container) return;

        container.style.display = "block";

        const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        let cursorY = MARGIN_MM;
        let isFirstCard = true;

        for (let i = 0; i < cards.length; i++) {
          const card = cards[i];
          const cardEl = container.querySelector<HTMLElement>(
            `[data-pdf-card="${card.id}"]`
          );
          if (!cardEl) continue;

          cardEl.style.width = `${CARD_WIDTH_PX}px`;
          cardEl.style.height = "auto";

          const canvas = await html2canvas(cardEl, {
            scale: SCALE,
            useCORS: true,
            logging: false,
            backgroundColor: "#ffffff",
          });

          const imgWidthMm = CONTENT_WIDTH_MM;
          const imgHeightMm = (canvas.height / canvas.width) * imgWidthMm;

          if (!isFirstCard && cursorY + imgHeightMm > A4_HEIGHT_MM - MARGIN_MM) {
            pdf.addPage();
            cursorY = MARGIN_MM;
          }

          if (isFirstCard) {
            isFirstCard = false;
          }

          const imgData = canvas.toDataURL("image/png");
          pdf.addImage(imgData, "PNG", LEFT_MARGIN_MM, cursorY, imgWidthMm, imgHeightMm);
          cursorY += imgHeightMm + MARGIN_MM;
        }

        container.style.display = "none";
        pdf.save("cocktails.pdf");
      },
    }));

    const exportable = cocktails.filter((c) => c.name.trim().length > 0);

    return (
      <div
        ref={containerRef}
        style={{
          display: "none",
          position: "absolute",
          left: "-9999px",
          top: 0,
        }}
      >
        {exportable.map((card) => (
          <div
            key={card.id}
            data-pdf-card={card.id}
            style={{
              display: "flex",
              gap: "20px",
              backgroundColor: "#ffffff",
              padding: "12px 16px",
              boxSizing: "border-box",
              overflow: "hidden",
              fontFamily: "system-ui, -apple-system, sans-serif",
              color: "#1a1a1a",
              borderBottom: "1px solid #e5e5e5",
            }}
          >
            <img
              src={card.image || NO_IMAGE_PLACEHOLDER}
              alt={card.name}
              style={{
                height: "192px",
                width: "192px",
                flexShrink: 0,
                borderRadius: "8px",
                objectFit: "cover",
              }}
            />
            <div style={{ display: "flex", flex: 1, flexDirection: "column", gap: "4px" }}>
              <h2 style={{ fontSize: "24px", fontWeight: 700, margin: 0 }}>
                {card.name}
              </h2>
              {(card.method || card.glass || card.ice) && (
                <p style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#333",
                  margin: "2px 0 4px",
                  letterSpacing: "0.3px",
                }}>
                  {[card.method, card.glass, card.ice]
                    .filter(Boolean)
                    .join("  ·  ")}
                </p>
              )}
              {card.description && (
                <p
                  style={{ fontSize: "14px", color: "#444", lineHeight: 1.6, margin: 0, padding: 0, whiteSpace: "pre-wrap" }}
                >
                  {card.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }
);
