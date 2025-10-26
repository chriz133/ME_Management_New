import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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

  private readonly A4_WIDTH = 595;
  private readonly A4_HEIGHT = 842;
  private readonly MAX_POSITIONS_PER_PAGE = 15;

  constructor() {}

  /**
   * Generate PDF for an invoice
   */
  async generateInvoicePdf(invoice: Invoice): Promise<void> {
    const element = this.createInvoiceHtmlElement(invoice);
    await this.generatePdfFromElement(element, this.getInvoiceFilename(invoice));
  }

  /**
   * Generate PDF for a contract
   */
  async generateContractPdf(contract: Contract): Promise<void> {
    const element = this.createContractHtmlElement(contract);
    await this.generatePdfFromElement(element, this.getContractFilename(contract));
  }

  /**
   * View invoice PDF in new tab
   */
  async viewInvoicePdf(invoice: Invoice): Promise<void> {
    const element = this.createInvoiceHtmlElement(invoice);
    await this.viewPdfFromElement(element);
  }

  /**
   * View contract PDF in new tab
   */
  async viewContractPdf(contract: Contract): Promise<void> {
    const element = this.createContractHtmlElement(contract);
    await this.viewPdfFromElement(element);
  }

  private async generatePdfFromElement(element: HTMLElement, filename: string): Promise<void> {
    document.body.appendChild(element);
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4', true);
      
      const imgWidth = this.A4_WIDTH;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      if (imgHeight <= this.A4_HEIGHT) {
        // Single page
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      } else {
        // Multiple pages
        let heightLeft = imgHeight;
        let position = 0;
        
        while (heightLeft > 0) {
          if (position > 0) {
            pdf.addPage();
          }
          
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= this.A4_HEIGHT;
          position -= this.A4_HEIGHT;
        }
      }
      
      pdf.save(filename);
    } finally {
      document.body.removeChild(element);
    }
  }

  private async viewPdfFromElement(element: HTMLElement): Promise<void> {
    document.body.appendChild(element);
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4', true);
      
      const imgWidth = this.A4_WIDTH;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      if (imgHeight <= this.A4_HEIGHT) {
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      } else {
        let heightLeft = imgHeight;
        let position = 0;
        
        while (heightLeft > 0) {
          if (position > 0) {
            pdf.addPage();
          }
          
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= this.A4_HEIGHT;
          position -= this.A4_HEIGHT;
        }
      }
      
      // Open in new tab
      const pdfBlob = pdf.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      window.open(url, '_blank');
    } finally {
      document.body.removeChild(element);
    }
  }

  private createInvoiceHtmlElement(invoice: Invoice): HTMLElement {
    const container = document.createElement('div');
    container.style.width = '595px';
    container.style.padding = '40px';
    container.style.backgroundColor = 'white';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.fontSize = '10pt';
    container.style.position = 'absolute';
    container.style.left = '-9999px';

    const nettoBetrag = this.calculateInvoiceNetto(invoice);
    const mwst = invoice.type === 'D' ? nettoBetrag * 0.2 : 0;
    const anzahlungNetto = invoice.depositAmount ? (invoice.depositAmount / 1.2) : 0;
    const anzahlungMwst = invoice.depositAmount ? invoice.depositAmount - anzahlungNetto : 0;
    const restbetrag = invoice.type === 'D' ? nettoBetrag + mwst - invoice.depositAmount : nettoBetrag;

    container.innerHTML = `
      <style>
        .invoice-pdf { width: 100%; }
        .invoice-pdf table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .invoice-pdf th, .invoice-pdf td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
        .invoice-pdf th { background-color: #f5f5f5; font-weight: bold; }
        .invoice-pdf .text-right { text-align: right; }
        .invoice-pdf .header { margin-bottom: 30px; }
        .invoice-pdf .logo { width: 150px; margin-bottom: 20px; }
        .invoice-pdf .company-info { margin-bottom: 20px; line-height: 1.6; }
        .invoice-pdf .customer-info { margin-bottom: 20px; }
        .invoice-pdf .invoice-title { font-size: 18pt; font-weight: bold; margin: 20px 0; }
        .invoice-pdf .invoice-meta { margin-bottom: 20px; font-size: 9pt; }
        .invoice-pdf .totals { margin-top: 20px; text-align: right; }
        .invoice-pdf .totals-row { display: flex; justify-content: flex-end; margin: 5px 0; }
        .invoice-pdf .totals-label { margin-right: 20px; min-width: 200px; text-align: right; }
        .invoice-pdf .totals-value { min-width: 100px; text-align: right; font-weight: bold; }
        .invoice-pdf .footer { margin-top: 40px; display: flex; justify-content: space-between; font-size: 8pt; border-top: 1px solid #ddd; padding-top: 20px; }
        .invoice-pdf .footer-section { flex: 1; }
      </style>
      <div class="invoice-pdf">
        <div class="header">
          <img src="/assets/images/logo_v1.png" class="logo" />
          <div class="company-info">
            <div><strong>${this.COMPANY_INFO.name}</strong></div>
            <div>${this.COMPANY_INFO.address}</div>
            <div>${this.COMPANY_INFO.city}</div>
            <div>Telefon: ${this.COMPANY_INFO.phone}</div>
            <div>E-Mail: ${this.COMPANY_INFO.email}</div>
            <div>Web: ${this.COMPANY_INFO.web}</div>
          </div>
        </div>

        <div class="customer-info">
          <div><strong>${invoice.customer?.fullName || ''}</strong></div>
          <div>${invoice.customer?.address || ''} ${invoice.customer?.nr || ''}</div>
          <div>${invoice.customer?.plz || ''} ${invoice.customer?.city || ''}</div>
          ${invoice.customer?.uid ? `<div>UID: ${invoice.customer.uid}</div>` : ''}
        </div>

        <div class="invoice-title">Rechnung</div>

        <div class="invoice-meta">
          <div>Rechnung Nr. ${invoice.invoiceId}</div>
          <div>Kunde Nr. ${invoice.customer?.customerId || ''}</div>
          <div>Datum: ${this.formatDate(invoice.createdAt)}</div>
          <div>Leistungszeitraum vom ${this.formatDate(invoice.startedAt)} bis zum ${this.formatDate(invoice.finishedAt)}</div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 50px;">Pos</th>
              <th>Beschreibung</th>
              <th class="text-right" style="width: 100px;">Einzelpreis</th>
              <th class="text-right" style="width: 80px;">Anzahl</th>
              <th class="text-right" style="width: 100px;">Gesamtpreis</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.positions?.map((pos, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${pos.position?.text || ''}</td>
                <td class="text-right">${this.formatCurrency(pos.position?.price || 0)}</td>
                <td class="text-right">${pos.amount} ${pos.position?.unit || ''}</td>
                <td class="text-right">${this.formatCurrency(pos.lineTotal)}</td>
              </tr>
            `).join('') || ''}
          </tbody>
        </table>

        <div class="totals">
          ${invoice.type === 'D' ? 
            '<div style="margin-bottom: 10px; font-size: 9pt;">Zahlbar nach Erhalt der Rechnung</div>' : 
            '<div style="margin-bottom: 10px; font-size: 9pt;">Es wird darauf hingewiesen, dass die Steuerschuld gem. § 19 Abs. 1a UStG auf den Leistungsempfänger übergeht</div>'
          }
          <div class="totals-row">
            <div class="totals-label" style="font-weight: ${invoice.type === 'D' ? 'normal' : 'bold'};">Nettobetrag:</div>
            <div class="totals-value">${this.formatCurrency(nettoBetrag)}</div>
          </div>
          ${invoice.type === 'D' ? `
            <div class="totals-row">
              <div class="totals-label">zzgl. 20% MwSt.:</div>
              <div class="totals-value">${this.formatCurrency(mwst)}</div>
            </div>
            ${invoice.depositAmount > 0 ? `
              <div class="totals-row">
                <div class="totals-label">- Anzahlung vom ${this.formatDate(invoice.depositPaidOn)}:</div>
                <div class="totals-value">${this.formatCurrency(anzahlungNetto)}</div>
              </div>
              <div class="totals-row">
                <div class="totals-label">- Umsatzsteuer Anzahlung:</div>
                <div class="totals-value">${this.formatCurrency(anzahlungMwst)}</div>
              </div>
            ` : ''}
            <div class="totals-row" style="font-size: 12pt; margin-top: 10px; border-top: 1px solid #000; padding-top: 10px;">
              <div class="totals-label">${invoice.depositAmount > 0 ? 'Restbetrag:' : 'Betrag:'}:</div>
              <div class="totals-value">${this.formatCurrency(restbetrag)}</div>
            </div>
          ` : ''}
        </div>

        <div class="footer">
          <div class="footer-section">
            <div><strong>${this.COMPANY_INFO.name}</strong></div>
            <div>${this.COMPANY_INFO.address}</div>
            <div>${this.COMPANY_INFO.city}</div>
          </div>
          <div class="footer-section">
            <div>UID: ${this.COMPANY_INFO.uid}</div>
            <div>Steuernummer: ${this.COMPANY_INFO.taxNumber}</div>
            <div>Inhaber: ${this.COMPANY_INFO.owner}</div>
          </div>
          <div class="footer-section">
            <div>${this.COMPANY_INFO.bank}</div>
            <div>IBAN: ${this.COMPANY_INFO.iban}</div>
            <div>BIC: ${this.COMPANY_INFO.bic}</div>
          </div>
        </div>
      </div>
    `;

    return container;
  }

  private createContractHtmlElement(contract: Contract): HTMLElement {
    const container = document.createElement('div');
    container.style.width = '595px';
    container.style.padding = '40px';
    container.style.backgroundColor = 'white';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.fontSize = '10pt';
    container.style.position = 'absolute';
    container.style.left = '-9999px';

    const nettoBetrag = this.calculateContractNetto(contract);
    const mwst = nettoBetrag * 0.2;
    const gesamtBetrag = nettoBetrag + mwst;

    container.innerHTML = `
      <style>
        .contract-pdf { width: 100%; }
        .contract-pdf table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .contract-pdf th, .contract-pdf td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
        .contract-pdf th { background-color: #f5f5f5; font-weight: bold; }
        .contract-pdf .text-right { text-align: right; }
        .contract-pdf .header { margin-bottom: 30px; }
        .contract-pdf .logo { width: 150px; margin-bottom: 20px; }
        .contract-pdf .company-info { margin-bottom: 20px; line-height: 1.6; }
        .contract-pdf .customer-info { margin-bottom: 20px; }
        .contract-pdf .contract-title { font-size: 18pt; font-weight: bold; margin: 20px 0; }
        .contract-pdf .contract-meta { margin-bottom: 20px; font-size: 9pt; }
        .contract-pdf .totals { margin-top: 20px; text-align: right; }
        .contract-pdf .totals-row { display: flex; justify-content: flex-end; margin: 5px 0; }
        .contract-pdf .totals-label { margin-right: 20px; min-width: 200px; text-align: right; }
        .contract-pdf .totals-value { min-width: 100px; text-align: right; font-weight: bold; }
        .contract-pdf .footer { margin-top: 40px; display: flex; justify-content: space-between; font-size: 8pt; border-top: 1px solid #ddd; padding-top: 20px; }
        .contract-pdf .footer-section { flex: 1; }
      </style>
      <div class="contract-pdf">
        <div class="header">
          <img src="/assets/images/logo_v1.png" class="logo" />
          <div class="company-info">
            <div><strong>${this.COMPANY_INFO.name}</strong></div>
            <div>${this.COMPANY_INFO.address}</div>
            <div>${this.COMPANY_INFO.city}</div>
            <div>Telefon: ${this.COMPANY_INFO.phone}</div>
            <div>E-Mail: ${this.COMPANY_INFO.email}</div>
            <div>Web: ${this.COMPANY_INFO.web}</div>
          </div>
        </div>

        <div class="customer-info">
          <div><strong>${contract.customer?.fullName || ''}</strong></div>
          <div>${contract.customer?.address || ''} ${contract.customer?.nr || ''}</div>
          <div>${contract.customer?.plz || ''} ${contract.customer?.city || ''}</div>
          ${contract.customer?.uid ? `<div>UID: ${contract.customer.uid}</div>` : ''}
        </div>

        <div class="contract-title">Angebot</div>

        <div class="contract-meta">
          <div>Angebot Nr. ${contract.contractId}</div>
          <div>Kunde Nr. ${contract.customer?.customerId || ''}</div>
          <div>Datum: ${this.formatDate(contract.createdAt)}</div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 50px;">Pos</th>
              <th>Beschreibung</th>
              <th class="text-right" style="width: 100px;">Einzelpreis</th>
              <th class="text-right" style="width: 80px;">Anzahl</th>
              <th class="text-right" style="width: 100px;">Gesamtpreis</th>
            </tr>
          </thead>
          <tbody>
            ${contract.positions?.map((pos, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${pos.position?.text || ''}</td>
                <td class="text-right">${this.formatCurrency(pos.position?.price || 0)}</td>
                <td class="text-right">${pos.amount} ${pos.position?.unit || ''}</td>
                <td class="text-right">${this.formatCurrency((pos.amount || 0) * (pos.position?.price || 0))}</td>
              </tr>
            `).join('') || ''}
          </tbody>
        </table>

        <div class="totals">
          <div style="margin-bottom: 10px; font-size: 9pt;">Dieses Angebot ist 10 Tage lang gültig</div>
          <div class="totals-row">
            <div class="totals-label">Nettobetrag:</div>
            <div class="totals-value">${this.formatCurrency(nettoBetrag)}</div>
          </div>
          <div class="totals-row">
            <div class="totals-label">zzgl. 20% MwSt.:</div>
            <div class="totals-value">${this.formatCurrency(mwst)}</div>
          </div>
          <div class="totals-row" style="font-size: 12pt; margin-top: 10px; border-top: 1px solid #000; padding-top: 10px;">
            <div class="totals-label">Gesamtbetrag:</div>
            <div class="totals-value">${this.formatCurrency(gesamtBetrag)}</div>
          </div>
        </div>

        <div class="footer">
          <div class="footer-section">
            <div><strong>${this.COMPANY_INFO.name}</strong></div>
            <div>${this.COMPANY_INFO.address}</div>
            <div>${this.COMPANY_INFO.city}</div>
          </div>
          <div class="footer-section">
            <div>UID: ${this.COMPANY_INFO.uid}</div>
            <div>Steuernummer: ${this.COMPANY_INFO.taxNumber}</div>
            <div>Inhaber: ${this.COMPANY_INFO.owner}</div>
          </div>
          <div class="footer-section">
            <div>${this.COMPANY_INFO.bank}</div>
            <div>IBAN: ${this.COMPANY_INFO.iban}</div>
            <div>BIC: ${this.COMPANY_INFO.bic}</div>
          </div>
        </div>
      </div>
    `;

    return container;
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
}
