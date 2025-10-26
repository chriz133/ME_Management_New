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
    const pdf = this.createInvoicePdf(invoice);
    pdf.save(this.getInvoiceFilename(invoice));
  }

  /**
   * Generate PDF for a contract
   */
  async generateContractPdf(contract: Contract): Promise<void> {
    const pdf = this.createContractPdf(contract);
    pdf.save(this.getContractFilename(contract));
  }

  /**
   * View invoice PDF in new tab
   */
  async viewInvoicePdf(invoice: Invoice): Promise<void> {
    const pdf = this.createInvoicePdf(invoice);
    const pdfBlob = pdf.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    window.open(url, '_blank');
  }

  /**
   * View contract PDF in new tab
   */
  async viewContractPdf(contract: Contract): Promise<void> {
    const pdf = this.createContractPdf(contract);
    const pdfBlob = pdf.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    window.open(url, '_blank');
  }

  private createInvoicePdf(invoice: Invoice): jsPDF {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const marginLeft = 20;
    const marginRight = 20;
    const contentWidth = pageWidth - marginLeft - marginRight;
    
    let yPos = 20;

    // Add logo (top left)
    try {
      const logoData = this.getLogoDataUrl();
      pdf.addImage(logoData, 'PNG', marginLeft, yPos, 30, 15); // 30mm width, 15mm height
    } catch (error) {
      console.error('Failed to load logo:', error);
    }

    // Company info (top right)
    pdf.setFontSize(10);
    pdf.text(this.COMPANY_INFO.name, pageWidth - marginRight, yPos, { align: 'right' });
    yPos += 5;
    pdf.text(this.COMPANY_INFO.address, pageWidth - marginRight, yPos, { align: 'right' });
    yPos += 5;
    pdf.text(this.COMPANY_INFO.city, pageWidth - marginRight, yPos, { align: 'right' });
    yPos += 8;
    pdf.text(`Telefon: ${this.COMPANY_INFO.phone}`, pageWidth - marginRight, yPos, { align: 'right' });
    yPos += 8;
    pdf.text(`E-Mail: ${this.COMPANY_INFO.email}`, pageWidth - marginRight, yPos, { align: 'right' });
    yPos += 5;
    pdf.text(`Web: ${this.COMPANY_INFO.web}`, pageWidth - marginRight, yPos, { align: 'right' });

    // Customer info (left side)
    yPos = 80;
    pdf.setFontSize(10);
    const customerName = `${invoice.customer?.firstname || ''} ${invoice.customer?.surname || ''}`.trim();
    pdf.text(customerName, marginLeft, yPos);
    yPos += 5;
    pdf.text(`${invoice.customer?.address || ''} ${invoice.customer?.nr || ''}`.trim(), marginLeft, yPos);
    yPos += 5;
    pdf.text(`${invoice.customer?.plz || ''} ${invoice.customer?.city || ''}`.trim(), marginLeft, yPos);
    if (invoice.customer?.uid) {
      yPos += 5;
      pdf.text(invoice.customer.uid, marginLeft, yPos);
    }

    // Title
    yPos = 110;
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Rechnung', marginLeft, yPos);

    // Invoice metadata
    yPos = 120;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Rechnung Nr. ${invoice.invoiceId}`, marginLeft, yPos);
    pdf.text(`Kunde Nr. ${invoice.customer?.customerId || ''}`, pageWidth / 2, yPos, { align: 'center' });
    pdf.text(`Datum: ${this.formatDate(invoice.createdAt)}`, pageWidth - marginRight, yPos, { align: 'right' });
    
    yPos += 7;
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Leistungszeitraum vom ${this.formatDate(invoice.startedAt)} bis zum ${this.formatDate(invoice.finishedAt)}`, marginLeft, yPos);

    // Draw line under header
    yPos += 2;
    pdf.line(marginLeft, yPos, pageWidth - marginRight, yPos);

    // Positions table - reduced gap from 8 to 5mm
    yPos += 5;
    this.drawInvoiceTable(pdf, invoice, marginLeft, yPos, contentWidth);

    return pdf;
  }

  private createContractPdf(contract: Contract): jsPDF {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const marginLeft = 20;
    const marginRight = 20;
    const contentWidth = pageWidth - marginLeft - marginRight;
    
    let yPos = 20;

    // Add logo (top left)
    try {
      const logoData = this.getLogoDataUrl();
      pdf.addImage(logoData, 'PNG', marginLeft, yPos, 30, 15); // 30mm width, 15mm height
    } catch (error) {
      console.error('Failed to load logo:', error);
    }

    // Company info (top right)
    pdf.setFontSize(10);
    pdf.text(this.COMPANY_INFO.name, pageWidth - marginRight, yPos, { align: 'right' });
    yPos += 5;
    pdf.text(this.COMPANY_INFO.address, pageWidth - marginRight, yPos, { align: 'right' });
    yPos += 5;
    pdf.text(this.COMPANY_INFO.city, pageWidth - marginRight, yPos, { align: 'right' });
    yPos += 8;
    pdf.text(`Telefon: ${this.COMPANY_INFO.phone}`, pageWidth - marginRight, yPos, { align: 'right' });
    yPos += 8;
    pdf.text(`E-Mail: ${this.COMPANY_INFO.email}`, pageWidth - marginRight, yPos, { align: 'right' });
    yPos += 5;
    pdf.text(`Web: ${this.COMPANY_INFO.web}`, pageWidth - marginRight, yPos, { align: 'right' });

    // Customer info (left side)
    yPos = 80;
    pdf.setFontSize(10);
    const customerName = `${contract.customer?.firstname || ''} ${contract.customer?.surname || ''}`.trim();
    pdf.text(customerName, marginLeft, yPos);
    yPos += 5;
    pdf.text(`${contract.customer?.address || ''} ${contract.customer?.nr || ''}`.trim(), marginLeft, yPos);
    yPos += 5;
    pdf.text(`${contract.customer?.plz || ''} ${contract.customer?.city || ''}`.trim(), marginLeft, yPos);

    // Title
    yPos = 105;
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Angebot', marginLeft, yPos);

    // Contract metadata
    yPos = 115;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Angebot Nr. ${contract.contractId}`, marginLeft, yPos);
    pdf.text(`Kunde Nr. ${contract.customer?.customerId || ''}`, pageWidth / 2, yPos, { align: 'center' });
    pdf.text(`Datum: ${this.formatDate(contract.createdAt)}`, pageWidth - marginRight, yPos, { align: 'right' });

    // Draw line under header
    yPos += 2;
    pdf.line(marginLeft, yPos, pageWidth - marginRight, yPos);

    // Positions table - reduced gap from 8 to 5mm
    yPos += 5;
    this.drawContractTable(pdf, contract, marginLeft, yPos, contentWidth);

    return pdf;
  }

  private drawInvoiceTable(pdf: jsPDF, invoice: Invoice, x: number, y: number, width: number): void {
    const colWidths = [15, 90, 25, 20, 25]; // Pos, Description, Price, Qty, Total
    let yPos = y;

    // Table header
    pdf.setFillColor(200, 200, 200);
    pdf.rect(x, yPos, width, 7, 'F');
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Pos', x + 2, yPos + 5);
    pdf.text('Beschreibung', x + colWidths[0] + 2, yPos + 5);
    pdf.text('Einzelpreis', x + colWidths[0] + colWidths[1] + colWidths[2], yPos + 5, { align: 'right' });
    pdf.text('Anzahl', x + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] / 2, yPos + 5, { align: 'center' });
    pdf.text('Gesamtpreis', x + width - 2, yPos + 5, { align: 'right' });

    yPos += 7;

    // Draw header border
    pdf.rect(x, y, width, 7);

    // Table rows
    pdf.setFont('helvetica', 'normal');
    invoice.positions?.forEach((pos, index) => {
      const rowHeight = 7;
      
      pdf.text((index + 1).toString(), x + colWidths[0] / 2, yPos + 5, { align: 'center' });
      pdf.text(pos.position?.text || '', x + colWidths[0] + 2, yPos + 5);
      pdf.text(this.formatCurrency(pos.position?.price || 0), x + colWidths[0] + colWidths[1] + colWidths[2], yPos + 5, { align: 'right' });
      pdf.text(`${pos.amount} ${pos.position?.unit || ''}`, x + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] / 2, yPos + 5, { align: 'center' });
      pdf.text(this.formatCurrency(pos.lineTotal), x + width - 2, yPos + 5, { align: 'right' });
      
      // Draw row border
      pdf.rect(x, yPos, width, rowHeight);
      yPos += rowHeight;
    });

    // Totals section
    yPos += 8; // Better spacing after table
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

    // Align totals with the info text baseline
    let totalsYPos = infoTextYPos;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', invoice.type === 'D' ? 'normal' : 'bold');
    pdf.text('Nettobetrag:', x + width - 60, totalsYPos);
    pdf.text(this.formatCurrency(nettoBetrag), x + width - 2, totalsYPos, { align: 'right' });
    totalsYPos += 5;

    if (invoice.type === 'D') {
      pdf.setFont('helvetica', 'normal');
      pdf.text('zzgl. 20% MwSt.:', x + width - 60, totalsYPos);
      pdf.text(this.formatCurrency(mwst), x + width - 2, totalsYPos, { align: 'right' });
      totalsYPos += 5;

      if (invoice.depositAmount > 0) {
        pdf.text(`- Anzahlung vom ${this.formatDate(invoice.depositPaidOn)}:`, x + width - 90, totalsYPos);
        pdf.text(this.formatCurrency(anzahlungNetto), x + width - 2, totalsYPos, { align: 'right' });
        totalsYPos += 5;

        pdf.text('- Umsatzsteuer Anzahlung:', x + width - 60, totalsYPos);
        pdf.text(this.formatCurrency(anzahlungMwst), x + width - 2, totalsYPos, { align: 'right' });
        totalsYPos += 5;
      }

      pdf.setFont('helvetica', 'bold');
      pdf.text(invoice.depositAmount > 0 ? 'Restbetrag:' : 'Betrag:', x + width - 60, totalsYPos);
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
    const colWidths = [15, 90, 25, 20, 25];
    let yPos = y;

    // Table header
    pdf.setFillColor(200, 200, 200);
    pdf.rect(x, yPos, width, 7, 'F');
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Pos', x + 2, yPos + 5);
    pdf.text('Beschreibung', x + colWidths[0] + 2, yPos + 5);
    pdf.text('Einzelpreis', x + colWidths[0] + colWidths[1] + colWidths[2], yPos + 5, { align: 'right' });
    pdf.text('Anzahl', x + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] / 2, yPos + 5, { align: 'center' });
    pdf.text('Gesamtpreis', x + width - 2, yPos + 5, { align: 'right' });

    yPos += 7;
    pdf.rect(x, y, width, 7);

    // Table rows
    pdf.setFont('helvetica', 'normal');
    contract.positions?.forEach((pos, index) => {
      const rowHeight = 7;
      
      pdf.text((index + 1).toString(), x + colWidths[0] / 2, yPos + 5, { align: 'center' });
      pdf.text(pos.position?.text || '', x + colWidths[0] + 2, yPos + 5);
      pdf.text(this.formatCurrency(pos.position?.price || 0), x + colWidths[0] + colWidths[1] + colWidths[2], yPos + 5, { align: 'right' });
      pdf.text(`${pos.amount} ${pos.position?.unit || ''}`, x + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] / 2, yPos + 5, { align: 'center' });
      pdf.text(this.formatCurrency((pos.amount || 0) * (pos.position?.price || 0)), x + width - 2, yPos + 5, { align: 'right' });
      
      pdf.rect(x, yPos, width, rowHeight);
      yPos += rowHeight;
    });

    // Totals
    yPos += 8; // Better spacing after table
    const nettoBetrag = this.calculateContractNetto(contract);
    const mwst = nettoBetrag * 0.2;
    const gesamtBetrag = nettoBetrag + mwst;

    const infoTextYPos = yPos; // Store starting position for alignment
    pdf.setFontSize(9);
    pdf.text('Dieses Angebot ist 10 Tage lang gültig', x, yPos);

    // Align totals with the info text baseline
    let totalsYPos = infoTextYPos;
    pdf.setFontSize(10);
    pdf.text('Nettobetrag:', x + width - 60, totalsYPos);
    pdf.text(this.formatCurrency(nettoBetrag), x + width - 2, totalsYPos, { align: 'right' });
    totalsYPos += 5;

    pdf.text('zzgl. 20% MwSt.:', x + width - 60, totalsYPos);
    pdf.text(this.formatCurrency(mwst), x + width - 2, totalsYPos, { align: 'right' });
    totalsYPos += 5;

    pdf.setFont('helvetica', 'bold');
    pdf.text('Gesamtbetrag:', x + width - 60, totalsYPos);
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

  private getLogoDataUrl(): string {
    // Base64 encoded logo - this is a simple approach
    // In a production environment, you might load this from the assets folder
    // For now, we'll return the path and jsPDF will handle loading it
    return '/assets/images/logo_v1.png';
  }
}
