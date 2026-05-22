// lib/jspdf.d.ts
// jspdf 4.x ships type declarations in its repo but not in the npm tarball.
// This minimal ambient declaration gives us the surface we use without
// pulling in the full types.

declare module "jspdf" {
  interface JsPDFOptions {
    orientation?: "p" | "portrait" | "l" | "landscape";
    unit?: "pt" | "mm" | "cm" | "in" | "px";
    format?: string | number[];
    compress?: boolean;
  }

  interface PageSize {
    getWidth(): number;
    getHeight(): number;
  }

  interface InternalApi {
    pageSize: PageSize;
    getNumberOfPages(): number;
  }

  class jsPDF {
    constructor(options?: JsPDFOptions);
    internal: InternalApi;
    setFillColor(r: number, g?: number, b?: number): jsPDF;
    setTextColor(r: number, g?: number, b?: number): jsPDF;
    setFont(family: string, style?: string): jsPDF;
    setFontSize(size: number): jsPDF;
    rect(x: number, y: number, w: number, h: number, style?: string): jsPDF;
    text(
      text: string | string[],
      x: number,
      y: number,
      options?: { align?: "left" | "center" | "right" | "justify" }
    ): jsPDF;
    setPage(pageNumber: number): jsPDF;
    getNumberOfPages(): number;
    save(filename: string): jsPDF;
  }

  export default jsPDF;
  export { jsPDF };
}
