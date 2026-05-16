"use client";

import { useRef } from "react";
import { Download } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";

const VISITOR_FORM_URL = "https://enthronement-assembly-ontario.vercel.app/";
const SVG_SIZE = 512;
const EXPORT_SIZE = 2048;

export default function AdminQrPage() {
  const qrRef = useRef<HTMLDivElement>(null);

  function getQrSvg() {
    const svg = qrRef.current?.querySelector("svg");

    if (!svg) {
      throw new Error("QR code SVG was not found.");
    }

    const clone = svg.cloneNode(true) as SVGElement;
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.setAttribute("width", String(EXPORT_SIZE));
    clone.setAttribute("height", String(EXPORT_SIZE));

    return new XMLSerializer().serializeToString(clone);
  }

  function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function downloadSvg() {
    const svgText = getQrSvg();
    downloadBlob(
      new Blob([svgText], { type: "image/svg+xml;charset=utf-8" }),
      "enthronement-assembly-visitor-qr.svg",
    );
  }

  function downloadPng() {
    const svgText = getQrSvg();
    const svgBlob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = EXPORT_SIZE;
      canvas.height = EXPORT_SIZE;

      const context = canvas.getContext("2d");
      if (!context) {
        URL.revokeObjectURL(svgUrl);
        return;
      }

      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, EXPORT_SIZE, EXPORT_SIZE);
      context.drawImage(image, 0, 0, EXPORT_SIZE, EXPORT_SIZE);
      URL.revokeObjectURL(svgUrl);

      canvas.toBlob((blob) => {
        if (blob) {
          downloadBlob(blob, "enthronement-assembly-visitor-qr.png");
        }
      }, "image/png");
    };

    image.src = svgUrl;
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
      <section className="w-full max-w-3xl rounded-3xl bg-white p-6 text-center shadow-[var(--shadow-lg)] sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-gold-deep)]">
          Enthronement Assembly Ontario
        </p>
        <h1 className="mt-3 text-3xl font-extrabold text-[var(--color-secondary)] sm:text-4xl">
          Visitor Form QR Code
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--color-body)] sm:text-base">
          Print-ready QR code for the first-time visitor form. Error correction is set to
          Level H for easier scanning on small church connect cards.
        </p>

        <div className="mx-auto mt-8 w-full max-w-[560px] rounded-3xl border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-md)] sm:p-6">
          <div ref={qrRef} className="mx-auto flex justify-center">
            <QRCodeSVG
              value={VISITOR_FORM_URL}
              size={SVG_SIZE}
              level="H"
              marginSize={4}
              bgColor="#ffffff"
              fgColor="#1a0521"
              title="Enthronement Assembly Ontario visitor form QR code"
              className="h-auto w-full max-w-[512px]"
            />
          </div>
        </div>

        <p className="mx-auto mt-5 max-w-xl break-words text-sm text-[var(--color-muted)]">
          {VISITOR_FORM_URL}
        </p>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button type="button" variant="gold" size="lg" onClick={downloadSvg}>
            <Download className="h-5 w-5" />
            Download SVG
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={downloadPng}>
            <Download className="h-5 w-5" />
            Download PNG
          </Button>
        </div>
      </section>
    </main>
  );
}
