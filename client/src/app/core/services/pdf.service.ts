import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { Invoice } from '../models/invoice.model';
import { Contract } from '../models/contract.model';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  private readonly COMPANY_INFO = {
    name: 'Melchior Hermann',
    address: 'Schilterndorf 29',
    city: '9150 Bleiburg',
    phone: '0676 / 6259929',
    email: 'office@melchior-erdbau.at',
    web: 'melchior-erdbau.at',
    uid: 'ATU78017548',
    taxNumber: '576570535',
    owner: 'Melchior Hermann',
    bank: 'Kärntner Sparkasse Bleiburg',
    iban: 'AT142070604600433397',
    bic: 'KSPKAT2KXXX'
  };

  constructor() {}

  /**
   * Generate PDF for an invoice
   */
  async generateInvoicePdf(invoice: Invoice): Promise<void> {
    const pdf = await this.createInvoicePdf(invoice);
    pdf.save(this.getInvoiceFilename(invoice));
  }

  /**
   * Generate PDF for a contract
   */
  async generateContractPdf(contract: Contract): Promise<void> {
    const pdf = await this.createContractPdf(contract);
    pdf.save(this.getContractFilename(contract));
  }

  /**
   * View invoice PDF in new tab
   */
  async viewInvoicePdf(invoice: Invoice): Promise<void> {
    const pdf = await this.createInvoicePdf(invoice);
    const pdfBlob = pdf.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    window.open(url, '_blank');
  }

  /**
   * View contract PDF in new tab
   */
  async viewContractPdf(contract: Contract): Promise<void> {
    const pdf = await this.createContractPdf(contract);
    const pdfBlob = pdf.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    window.open(url, '_blank');
  }

  private async createInvoicePdf(invoice: Invoice): Promise<jsPDF> {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const marginLeft = 20;
    const marginRight = 20;
    const contentWidth = pageWidth - marginLeft - marginRight;
    
    let yPos = 20;

    // Add logo (top left) - load as base64
    this.addLogoToPdf(pdf, marginLeft, yPos, 30, 15);

    // Company info (top right) - reduced font size from 10 to 9
    pdf.setFontSize(9);
    pdf.text(this.COMPANY_INFO.name, pageWidth - marginRight, yPos, { align: 'right' });
    yPos += 4;
    pdf.text(this.COMPANY_INFO.address, pageWidth - marginRight, yPos, { align: 'right' });
    yPos += 4;
    pdf.text(this.COMPANY_INFO.city, pageWidth - marginRight, yPos, { align: 'right' });
    yPos += 7;
    pdf.text(`Telefon: ${this.COMPANY_INFO.phone}`, pageWidth - marginRight, yPos, { align: 'right' });
    yPos += 7;
    pdf.text(`E-Mail: ${this.COMPANY_INFO.email}`, pageWidth - marginRight, yPos, { align: 'right' });
    yPos += 4;
    pdf.text(`Web: ${this.COMPANY_INFO.web}`, pageWidth - marginRight, yPos, { align: 'right' });

    // Customer info (left side) - moved higher from 80 to 65
    yPos = 65;
    pdf.setFontSize(9);
    const customerName = `${invoice.customer?.firstname || ''} ${invoice.customer?.surname || ''}`.trim();
    pdf.text(customerName, marginLeft, yPos);
    yPos += 4;
    pdf.text(`${invoice.customer?.address || ''} ${invoice.customer?.nr || ''}`.trim(), marginLeft, yPos);
    yPos += 4;
    pdf.text(`${invoice.customer?.plz || ''} ${invoice.customer?.city || ''}`.trim(), marginLeft, yPos);
    if (invoice.customer?.uid) {
      yPos += 4;
      pdf.text(invoice.customer.uid, marginLeft, yPos);
    }

    // Title - reduced from 18 to 14
    yPos = 95;
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Rechnung', marginLeft, yPos);

    // Invoice metadata - reduced font from 10 to 9
    yPos = 105;
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Rechnung Nr. ${invoice.invoiceId}`, marginLeft, yPos);
    pdf.text(`Kunde Nr. ${invoice.customer?.customerId || ''}`, pageWidth / 2, yPos, { align: 'center' });
    pdf.text(`Datum: ${this.formatDate(invoice.createdAt)}`, pageWidth - marginRight, yPos, { align: 'right' });
    
    yPos += 6;
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Leistungszeitraum vom ${this.formatDate(invoice.startedAt)} bis zum ${this.formatDate(invoice.finishedAt)}`, marginLeft, yPos);

    // Draw line under header - using 0.5mm line width (matching 2px at scale in old CSS)
    yPos += 2;
    pdf.setLineWidth(0.5);
    pdf.setDrawColor(0, 0, 0);
    pdf.line(marginLeft, yPos, pageWidth - marginRight, yPos);

    // Positions table - reduced gap from 8 to 5mm
    yPos += 5;
    this.drawInvoiceTable(pdf, invoice, marginLeft, yPos, contentWidth);

    return pdf;
  }

  private async createContractPdf(contract: Contract): Promise<jsPDF> {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const marginLeft = 20;
    const marginRight = 20;
    const contentWidth = pageWidth - marginLeft - marginRight;
    
    let yPos = 20;

    // Add logo (top left) - load as base64
    await this.addLogoToPdf(pdf, marginLeft, yPos, 30, 15);

    // Company info (top right) - reduced font size from 10 to 9
    pdf.setFontSize(9);
    pdf.text(this.COMPANY_INFO.name, pageWidth - marginRight, yPos, { align: 'right' });
    yPos += 4;
    pdf.text(this.COMPANY_INFO.address, pageWidth - marginRight, yPos, { align: 'right' });
    yPos += 4;
    pdf.text(this.COMPANY_INFO.city, pageWidth - marginRight, yPos, { align: 'right' });
    yPos += 7;
    pdf.text(`Telefon: ${this.COMPANY_INFO.phone}`, pageWidth - marginRight, yPos, { align: 'right' });
    yPos += 7;
    pdf.text(`E-Mail: ${this.COMPANY_INFO.email}`, pageWidth - marginRight, yPos, { align: 'right' });
    yPos += 4;
    pdf.text(`Web: ${this.COMPANY_INFO.web}`, pageWidth - marginRight, yPos, { align: 'right' });

    // Customer info (left side) - moved higher from 80 to 65
    yPos = 65;
    pdf.setFontSize(9);
    const customerName = `${contract.customer?.firstname || ''} ${contract.customer?.surname || ''}`.trim();
    pdf.text(customerName, marginLeft, yPos);
    yPos += 4;
    pdf.text(`${contract.customer?.address || ''} ${contract.customer?.nr || ''}`.trim(), marginLeft, yPos);
    yPos += 4;
    pdf.text(`${contract.customer?.plz || ''} ${contract.customer?.city || ''}`.trim(), marginLeft, yPos);

    // Title - reduced from 18 to 14
    yPos = 90;
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Angebot', marginLeft, yPos);

    // Contract metadata - reduced font from 10 to 9
    yPos = 100;
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Angebot Nr. ${contract.contractId}`, marginLeft, yPos);
    pdf.text(`Kunde Nr. ${contract.customer?.customerId || ''}`, pageWidth / 2, yPos, { align: 'center' });
    pdf.text(`Datum: ${this.formatDate(contract.createdAt)}`, pageWidth - marginRight, yPos, { align: 'right' });

    // Draw line under header - using 0.5mm line width (matching 2px at scale in old CSS)
    yPos += 2;
    pdf.setLineWidth(0.5);
    pdf.setDrawColor(0, 0, 0);
    pdf.line(marginLeft, yPos, pageWidth - marginRight, yPos);

    // Positions table - reduced gap from 8 to 5mm
    yPos += 5;
    this.drawContractTable(pdf, contract, marginLeft, yPos, contentWidth);

    return pdf;
  }

  private drawInvoiceTable(pdf: jsPDF, invoice: Invoice, x: number, y: number, width: number): void {
    const colWidths = [12, 90, 22, 20, 22]; // Adjusted to match old CSS
    let yPos = y;

    // Table header - use #cbcbcb background color (203, 203, 203)
    pdf.setFillColor(203, 203, 203);
    pdf.setDrawColor(0, 0, 0); // Black borders
    pdf.setLineWidth(0.5); // Thicker border to match old CSS (2px at scale)
    pdf.rect(x, yPos, width, 6, 'FD'); // Fill and Draw
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    
    // Pos column - centered
    pdf.text('Pos', x + colWidths[0] / 2, yPos + 4, { align: 'center' });
    // Description - left aligned
    pdf.text('Beschreibung', x + colWidths[0] + 2, yPos + 4);
    // Einzelpreis - right aligned
    pdf.text('Einzelpreis', x + colWidths[0] + colWidths[1] + colWidths[2] - 2, yPos + 4, { align: 'right' });
    // Anzahl - centered
    pdf.text('Anzahl', x + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] / 2, yPos + 4, { align: 'center' });
    // Gesamtpreis - right aligned
    pdf.text('Gesamtpreis', x + width - 2, yPos + 4, { align: 'right' });

    yPos += 6;

    // Draw individual cell borders for each row
    pdf.setFont('helvetica', 'normal');
    invoice.positions?.forEach((pos, index) => {
      const rowHeight = 6;
      let colX = x;
      
      // Draw all cell borders
      pdf.rect(colX, yPos, colWidths[0], rowHeight); // Pos column
      pdf.text((index + 1).toString(), colX + colWidths[0] / 2, yPos + 4, { align: 'center' });
      
      colX += colWidths[0];
      pdf.rect(colX, yPos, colWidths[1], rowHeight); // Description column
      pdf.text(pos.position?.text || '', colX + 2, yPos + 4);
      
      colX += colWidths[1];
      pdf.rect(colX, yPos, colWidths[2], rowHeight); // Price column
      pdf.text(this.formatCurrency(pos.position?.price || 0), colX + colWidths[2] - 2, yPos + 4, { align: 'right' });
      
      colX += colWidths[2];
      pdf.rect(colX, yPos, colWidths[3], rowHeight); // Quantity column
      pdf.text(`${pos.amount} ${pos.position?.unit || ''}`, colX + colWidths[3] / 2, yPos + 4, { align: 'center' });
      
      colX += colWidths[3];
      pdf.rect(colX, yPos, colWidths[4], rowHeight); // Total column
      pdf.text(this.formatCurrency(pos.lineTotal), colX + colWidths[4] - 2, yPos + 4, { align: 'right' });
      
      yPos += rowHeight;
    });

    // Totals section - improved spacing
    yPos += 4; // Reduced spacing after table
    const nettoBetrag = this.calculateInvoiceNetto(invoice);
    const mwst = invoice.type === 'D' ? nettoBetrag * 0.2 : 0;
    const anzahlungNetto = invoice.depositAmount ? (invoice.depositAmount / 1.2) : 0;
    const anzahlungMwst = invoice.depositAmount ? invoice.depositAmount - anzahlungNetto : 0;
    const restbetrag = invoice.type === 'D' ? nettoBetrag + mwst - invoice.depositAmount : nettoBetrag;

    const infoTextYPos = yPos; // Store starting position for alignment

    if (invoice.type !== 'D') {
      pdf.setFontSize(9);
      pdf.text('Es wird darauf hingewiesen, dass die Steuerschuld gem. § 19 Abs. 1a UStG', x, yPos);
      yPos += 4;
      pdf.text('auf den Leistungsempfänger übergeht', x, yPos);
    } else {
      pdf.setFontSize(9);
      pdf.text('Zahlbar nach Erhalt der Rechnung', x, yPos);
    }

    // Align totals with the info text baseline - increased gap
    let totalsYPos = infoTextYPos;
    pdf.setFontSize(9);
    pdf.setFont('helvetica', invoice.type === 'D' ? 'normal' : 'bold');
    pdf.text('Nettobetrag:', x + width - 55, totalsYPos); // More space (was -60, now -55)
    pdf.text(this.formatCurrency(nettoBetrag), x + width - 2, totalsYPos, { align: 'right' });
    totalsYPos += 4;

    if (invoice.type === 'D') {
      pdf.setFont('helvetica', 'normal');
      pdf.text('zzgl. 20% MwSt.:', x + width - 55, totalsYPos); // More space
      pdf.text(this.formatCurrency(mwst), x + width - 2, totalsYPos, { align: 'right' });
      totalsYPos += 4;

      if (invoice.depositAmount > 0) {
        pdf.text(`- Anzahlung vom ${this.formatDate(invoice.depositPaidOn)}:`, x + width - 95, totalsYPos); // More space for date
        pdf.text(this.formatCurrency(anzahlungNetto), x + width - 2, totalsYPos, { align: 'right' });
        totalsYPos += 4;

        pdf.text('- Umsatzsteuer Anzahlung:', x + width - 70, totalsYPos); // More space
        pdf.text(this.formatCurrency(anzahlungMwst), x + width - 2, totalsYPos, { align: 'right' });
        totalsYPos += 4;
      }

      pdf.setFont('helvetica', 'bold');
      pdf.text(invoice.depositAmount > 0 ? 'Restbetrag:' : 'Betrag:', x + width - 55, totalsYPos);
      pdf.text(this.formatCurrency(restbetrag), x + width - 2, totalsYPos, { align: 'right' });
    }

    // Footer
    yPos = 270;
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    
    const col1X = x;
    const col2X = x + (width / 3);
    const col3X = x + (width / 3) * 2;

    pdf.text('Melchior-Erdbau', col1X, yPos);
    pdf.text(`UID: ${this.COMPANY_INFO.uid}`, col2X, yPos);
    pdf.text(this.COMPANY_INFO.bank, col3X, yPos);
    yPos += 4;
    
    pdf.text(this.COMPANY_INFO.address, col1X, yPos);
    pdf.text(`Steuernummer: ${this.COMPANY_INFO.taxNumber}`, col2X, yPos);
    pdf.text(`IBAN: ${this.COMPANY_INFO.iban}`, col3X, yPos);
    yPos += 4;
    
    pdf.text(this.COMPANY_INFO.city, col1X, yPos);
    pdf.text(`Inhaber: ${this.COMPANY_INFO.owner}`, col2X, yPos);
    pdf.text(`BIC: ${this.COMPANY_INFO.bic}`, col3X, yPos);
  }

  private drawContractTable(pdf: jsPDF, contract: Contract, x: number, y: number, width: number): void {
    const colWidths = [12, 90, 22, 20, 22]; // Match invoice table
    let yPos = y;

    // Table header - use #cbcbcb background color (203, 203, 203)
    pdf.setFillColor(203, 203, 203);
    pdf.setDrawColor(0, 0, 0); // Black borders
    pdf.setLineWidth(0.5); // Thicker border to match old CSS
    pdf.rect(x, yPos, width, 6, 'FD'); // Fill and Draw
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    
    // Pos column - centered
    pdf.text('Pos', x + colWidths[0] / 2, yPos + 4, { align: 'center' });
    // Description - left aligned
    pdf.text('Beschreibung', x + colWidths[0] + 2, yPos + 4);
    // Einzelpreis - right aligned
    pdf.text('Einzelpreis', x + colWidths[0] + colWidths[1] + colWidths[2] - 2, yPos + 4, { align: 'right' });
    // Anzahl - centered
    pdf.text('Anzahl', x + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] / 2, yPos + 4, { align: 'center' });
    // Gesamtpreis - right aligned
    pdf.text('Gesamtpreis', x + width - 2, yPos + 4, { align: 'right' });

    yPos += 6;

    // Draw individual cell borders for each row
    pdf.setFont('helvetica', 'normal');
    contract.positions?.forEach((pos, index) => {
      const rowHeight = 6;
      let colX = x;
      
      // Draw all cell borders
      pdf.rect(colX, yPos, colWidths[0], rowHeight); // Pos column
      pdf.text((index + 1).toString(), colX + colWidths[0] / 2, yPos + 4, { align: 'center' });
      
      colX += colWidths[0];
      pdf.rect(colX, yPos, colWidths[1], rowHeight); // Description column
      pdf.text(pos.position?.text || '', colX + 2, yPos + 4);
      
      colX += colWidths[1];
      pdf.rect(colX, yPos, colWidths[2], rowHeight); // Price column
      pdf.text(this.formatCurrency(pos.position?.price || 0), colX + colWidths[2] - 2, yPos + 4, { align: 'right' });
      
      colX += colWidths[2];
      pdf.rect(colX, yPos, colWidths[3], rowHeight); // Quantity column
      pdf.text(`${pos.amount} ${pos.position?.unit || ''}`, colX + colWidths[3] / 2, yPos + 4, { align: 'center' });
      
      colX += colWidths[3];
      pdf.rect(colX, yPos, colWidths[4], rowHeight); // Total column
      pdf.text(this.formatCurrency((pos.amount || 0) * (pos.position?.price || 0)), colX + colWidths[4] - 2, yPos + 4, { align: 'right' });
      
      yPos += rowHeight;
    });

    // Totals - improved spacing
    yPos += 4; // Reduced spacing after table
    const nettoBetrag = this.calculateContractNetto(contract);
    const mwst = nettoBetrag * 0.2;
    const gesamtBetrag = nettoBetrag + mwst;

    const infoTextYPos = yPos; // Store starting position for alignment
    pdf.setFontSize(9);
    pdf.text('Dieses Angebot ist 10 Tage lang gültig', x, yPos);

    // Align totals with the info text baseline - increased gap
    let totalsYPos = infoTextYPos;
    pdf.setFontSize(9);
    pdf.text('Nettobetrag:', x + width - 55, totalsYPos); // More space
    pdf.text(this.formatCurrency(nettoBetrag), x + width - 2, totalsYPos, { align: 'right' });
    totalsYPos += 4;

    pdf.text('zzgl. 20% MwSt.:', x + width - 55, totalsYPos); // More space
    pdf.text(this.formatCurrency(mwst), x + width - 2, totalsYPos, { align: 'right' });
    totalsYPos += 4;

    pdf.setFont('helvetica', 'bold');
    pdf.text('Gesamtbetrag:', x + width - 55, totalsYPos); // More space
    pdf.text(this.formatCurrency(gesamtBetrag), x + width - 2, totalsYPos, { align: 'right' });

    // Footer
    yPos = 270;
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    
    const col1X = x;
    const col2X = x + (width / 3);
    const col3X = x + (width / 3) * 2;

    pdf.text('Melchior-Erdbau', col1X, yPos);
    pdf.text(`UID: ${this.COMPANY_INFO.uid}`, col2X, yPos);
    pdf.text(this.COMPANY_INFO.bank, col3X, yPos);
    yPos += 4;
    
    pdf.text(this.COMPANY_INFO.address, col1X, yPos);
    pdf.text(`Steuernummer: ${this.COMPANY_INFO.taxNumber}`, col2X, yPos);
    pdf.text(`IBAN: ${this.COMPANY_INFO.iban}`, col3X, yPos);
    yPos += 4;
    
    pdf.text(this.COMPANY_INFO.city, col1X, yPos);
    pdf.text(`Inhaber: ${this.COMPANY_INFO.owner}`, col2X, yPos);
    pdf.text(`BIC: ${this.COMPANY_INFO.bic}`, col3X, yPos);
  }

  private calculateInvoiceNetto(invoice: Invoice): number {
    if (!invoice.positions) return 0;
    return invoice.positions.reduce((sum, pos) => sum + pos.lineTotal, 0);
  }

  private calculateContractNetto(contract: Contract): number {
    if (!contract.positions) return 0;
    return contract.positions.reduce((sum, pos) => {
      const price = pos.position?.price || 0;
      return sum + (pos.amount * price);
    }, 0);
  }

  private formatCurrency(amount: number): string {
    return amount.toFixed(2).replace('.', ',') + ' €';
  }

  private formatDate(date: Date | string | undefined): string {
    if (!date) return '-';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  }

  private getInvoiceFilename(invoice: Invoice): string {
    const invoiceNum = String(invoice.invoiceId).padStart(3, '0');
    const surname = invoice.customer?.surname || 'Unknown';
    const firstname = invoice.customer?.firstname || '';
    const date = this.formatDate(invoice.createdAt).replace(/\./g, '-');
    return `${invoiceNum}_Rechnung_${surname}_${firstname}_${date}.pdf`;
  }

  private getContractFilename(contract: Contract): string {
    const contractNum = String(contract.contractId).padStart(3, '0');
    const surname = contract.customer?.surname || 'Unknown';
    const firstname = contract.customer?.firstname || '';
    const date = this.formatDate(contract.createdAt).replace(/\./g, '-');
    return `${contractNum}_Angebot_${surname}_${firstname}_${date}.pdf`;
  }

  /**
   * Load image and convert to base64 data URL
   */
  private loadImageAsDataUrl(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous'; // Handle CORS
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/png');
          resolve(dataUrl);
        } else {
          reject(new Error('Failed to get canvas context'));
        }
      };
      
      img.onerror = (error) => {
        console.error('Failed to load image:', error);
        reject(new Error(`Failed to load image: ${path}`));
      };
      
      img.src = path;
    });
  }

  /**
   * Add logo to PDF by loading it as base64 first
   */
  private async addLogoToPdf(pdf: jsPDF, x: number, y: number, width: number, height: number): Promise<void> {
    try {
      // Load logo from assets and convert to base64
      const logoDataUrl = await this.loadImageAsDataUrl('assets/images/logo_v1.png');
      pdf.addImage(logoDataUrl, 'PNG', x, y, width, height);
    } catch (error) {
      console.error('Failed to load logo:', error);
      // Draw a placeholder rectangle if logo fails to load
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.2);
      pdf.rect(x, y, width, height);
    }
  }
}
