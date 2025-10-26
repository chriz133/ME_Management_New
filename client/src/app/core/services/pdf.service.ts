import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Invoice } from '../models/invoice.model';
import { Contract } from '../models/contract.model';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  constructor() {}

  /**
   * Generate PDF for an invoice
   */
  async generateInvoicePdf(invoice: Invoice): Promise<void> {
    const element = this.createInvoiceHtmlElement(invoice);
    await this.generatePdfFromElement(element, this.getInvoiceFilename(invoice), true);
  }

  /**
   * Generate PDF for a contract
   */
  async generateContractPdf(contract: Contract): Promise<void> {
    const element = this.createContractHtmlElement(contract);
    await this.generatePdfFromElement(element, this.getContractFilename(contract), false);
  }

  /**
   * View invoice PDF in new tab
   */
  async viewInvoicePdf(invoice: Invoice): Promise<void> {
    const element = this.createInvoiceHtmlElement(invoice);
    await this.viewPdfFromElement(element, true);
  }

  /**
   * View contract PDF in new tab
   */
  async viewContractPdf(contract: Contract): Promise<void> {
    const element = this.createContractHtmlElement(contract);
    await this.viewPdfFromElement(element, false);
  }

  private async generatePdfFromElement(element: HTMLElement, filename: string, isInvoice: boolean): Promise<void> {
    document.body.appendChild(element);
    
    // Reset zoom to 1 for accurate rendering
    const originalZoom = element.style.zoom;
    element.style.zoom = '1';
    
    try {
      const canvas = await html2canvas(element, {
        scale: 1,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4', true);
      
      if (isInvoice) {
        // Invoice: fixed size
        pdf.addImage(imgData, 'PNG', 0, 0, 595, 842);
      } else {
        // Contract: auto height - calculate based on canvas
        const imgHeight = (canvas.height * 595) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, 595, imgHeight);
      }
      
      pdf.save(filename);
    } finally {
      element.style.zoom = originalZoom;
      document.body.removeChild(element);
    }
  }

  private async viewPdfFromElement(element: HTMLElement, isInvoice: boolean): Promise<void> {
    document.body.appendChild(element);
    
    const originalZoom = element.style.zoom;
    element.style.zoom = '1';
    
    try {
      const canvas = await html2canvas(element, {
        scale: 1,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4', true);
      
      if (isInvoice) {
        pdf.addImage(imgData, 'PNG', 0, 0, 595, 842);
      } else {
        const imgHeight = (canvas.height * 595) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, 595, imgHeight);
      }
      
      // Open in new tab
      const pdfBlob = pdf.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      window.open(url, '_blank');
    } finally {
      element.style.zoom = originalZoom;
      document.body.removeChild(element);
    }
  }

  private createInvoiceHtmlElement(invoice: Invoice): HTMLElement {
    const container = document.createElement('div');
    container.className = 'main-two';
    container.style.position = 'absolute';
    container.style.left = '-99999px';
    container.style.top = '0';

    const logoPath = '/assets/images/logo_v1.png';
    
    const nettoBetrag = this.calculateInvoiceNetto(invoice);
    const mwst = invoice.type === 'D' ? nettoBetrag * 0.2 : 0;
    const anzahlungNetto = invoice.depositAmount ? (invoice.depositAmount / 1.2) : 0;
    const anzahlungMwst = invoice.depositAmount ? invoice.depositAmount - anzahlungNetto : 0;
    const restbetrag = invoice.type === 'D' ? nettoBetrag + mwst - invoice.depositAmount : nettoBetrag;

    container.innerHTML = `
      <style>
        .main-two {
          zoom: 0.5;
          width: calc(210mm * 2);
          height: calc(297mm * 2);
          border: black 2px solid;
          -webkit-print-color-adjust: exact;
          background-color: white;
        }
        
        .content {
          margin: calc(20mm * 2);
        }
        
        .header2 {
          height: calc(95mm * 2);
        }
        
        .logo {
          position: absolute;
          width: calc(2 * 30mm);
          left: calc(2 * 18mm);
        }
        
        .info {
          position: relative;
          width: calc(50mm * 2);
          height: calc(50mm * 2);
          top: calc(10mm * 2);
          left: calc(120mm * 2);
          font-size: calc(3mm * 2);
          text-align: right;
          margin: 0;
          padding: 0;
        }
        
        .info > p {
          margin: 0;
        }
        
        .info-line-break {
          height: calc(5mm * 2);
        }
        
        .customer {
          position: relative;
          height: calc(13mm * 2);
          width: calc(50mm * 2);
          top: calc(-15mm * 2);
          left: calc(0mm * 2);
          font-size: calc(3mm * 2);
        }
        
        .customer > p {
          margin: 0;
        }
        
        .contract {
          position: relative;
          left: calc(0mm * 2);
          top: calc(-2mm * 2);
          font-weight: bold;
          font-size: calc(7mm * 2);
        }
        
        .invoice-info {
          position: relative;
          border-bottom: black calc(1px * 2) solid;
          width: calc(170mm * 2);
          height: calc(12mm * 2);
          top: calc(-5mm * 2);
          left: calc(0mm * 2);
          font-size: calc(3mm * 2);
          font-weight: bold;
        }
        
        .contract-info-left {
          position: absolute;
          left: 0;
          top: calc(2 * -3mm);
          width: calc(2 * 50mm);
        }
        
        .contract-info-middle {
          position: absolute;
          top: calc(2 * -3mm);
          left: calc(2 * 60mm);
          width: calc(2 * 50mm);
          text-align: center;
        }
        
        .contract-info-right {
          position: absolute;
          top: calc(2 * -3mm);
          left: calc(2 * 120mm);
          width: calc(2 * 50mm);
          text-align: right;
        }
        
        .contract-info-worktime {
          position: absolute;
          margin-top: calc(2 * 7mm);
          font-size: calc(2 * 4mm);
          font-weight: normal;
          top: 0mm;
        }
        
        .positions {
          position: relative;
          height: calc(2 * 140mm);
          top: 0;
        }
        
        .table-a {
          font-size: calc(2 * 3mm);
          font-family: arial, sans-serif;
          border-collapse: collapse;
          width: 100%;
        }
        
        .tr-a > td, .tr-a > th {
          border: calc(2 * 1px) solid #000000;
          text-align: left;
          padding: calc(2 * 1mm);
        }
        
        .tr-a > th {
          background-color: #cbcbcb;
          font-weight: bold;
        }
        
        .tr-a > th:nth-child(1) {
          text-align: center;
          width: calc(2 * 6mm);
        }
        
        .tr-a > th:nth-child(2) {
          width: calc(2 * 90mm);
        }
        
        .tr-a > th:nth-child(3) {
          width: calc(2 * 22mm);
          text-align: right;
        }
        
        .tr-a > th:nth-child(4) {
          width: calc(2 * 20mm);
          text-align: center;
        }
        
        .tr-a > th:nth-child(5) {
          width: calc(2 * 22mm);
          text-align: right;
        }
        
        .tr-a > td:nth-child(1) {
          text-align: center;
        }
        
        .tr-a > td:nth-child(2) {
          text-align: left;
        }
        
        .tr-a > td:nth-child(3) {
          text-align: right;
        }
        
        .tr-a > td:nth-child(4) {
          text-align: center;
        }
        
        .tr-a > td:nth-child(5) {
          text-align: right;
        }
        
        .bill2 {
          margin-top: calc(2 * 4mm);
          height: calc(2 * 30mm);
          font-size: calc(2 * 3mm);
        }
        
        .bill2-info {
          position: relative;
          top: 0mm;
          width: 200mm;
          height: 10mm;
        }
        
        .bill2-right {
          position: relative;
          width: calc(2 * 60mm);
          left: calc(2 * 110mm);
          top: -18mm;
          height: 100%;
        }
        
        .bill-field {
          position: relative;
          left: 0;
          top: 0;
          width: 100%;
          height: calc(2 * 5mm);
          margin-top: calc(2 * -1mm);
          display: flex;
          justify-content: space-between;
          align-content: center;
          text-align: center;
        }
        
        .bill-field > p {
          position: relative;
          height: inherit;
          top: calc(2 * -1mm);
        }
        
        .footer {
          height: calc(2 * 20mm);
          display: flex;
        }
        
        .footer > div {
          position: relative;
          height: inherit;
          left: 0;
          width: 33.3%;
          text-align: left;
          font-size: calc(2 * 3mm);
        }
        
        .footer > div > p {
          position: relative;
          top: calc(2 * 2mm);
          margin: calc(2 * 1mm) !important;
        }
      </style>
      <div class="content">
        <div class="header2">
          <img class="logo" src="${logoPath}" />
          <div class="info">
            <p>Melchior Hermann</p>
            <p>Schilterndorf 29</p>
            <p>9150 Bleiburg</p>
            <p class="info-line-break"></p>
            <p>Telefon: 0676 / 6259929</p>
            <p class="info-line-break"></p>
            <p>E-Mail: office@melchior-erdbau.at</p>
            <p>Web: melchior-erdbau.at</p>
          </div>
          <div class="customer">
            <p>${invoice.customer?.firstname || ''} ${invoice.customer?.surname || ''}</p>
            <p>${invoice.customer?.address || ''} ${invoice.customer?.nr || ''}</p>
            <p>${invoice.customer?.plz || ''} ${invoice.customer?.city || ''}</p>
            ${invoice.customer?.uid ? `<p>${invoice.customer.uid}</p>` : ''}
          </div>
          <p class="contract">Rechnung</p>
          <div class="invoice-info">
            <p class="contract-info-left">Rechnung Nr. ${invoice.invoiceId}</p>
            <p class="contract-info-middle">Kunde Nr. ${invoice.customer?.customerId || ''}</p>
            <p class="contract-info-right">Datum: ${this.formatDate(invoice.createdAt)}</p>
            <p class="contract-info-worktime">Leistungszeitraum vom ${this.formatDate(invoice.startedAt)} bis zum ${this.formatDate(invoice.finishedAt)}</p>
          </div>
        </div>
        <div class="positions">
          <table class="table-a">
            <thead>
              <tr class="tr-a">
                <th>Pos</th>
                <th>Beschreibung</th>
                <th>Einzelpreis</th>
                <th>Anzahl</th>
                <th>Gesamtpreis</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.positions?.map((pos, index) => `
                <tr class="tr-a">
                  <td>${index + 1}</td>
                  <td>${pos.position?.text || ''}</td>
                  <td>${this.formatCurrency(pos.position?.price || 0)}</td>
                  <td>${pos.amount} ${pos.position?.unit || ''}</td>
                  <td>${this.formatCurrency(pos.lineTotal)}</td>
                </tr>
              `).join('') || ''}
            </tbody>
          </table>
          <div class="bill2">
            ${invoice.type === 'D' ? 
              '<p class="bill2-info">Zahlbar nach Erhalt der Rechnung</p>' : 
              '<p class="bill2-info">Es wird darauf hingewiesen, dass die Steuerschuld gem. § 19 Abs. 1a UStG auf den Leistungsempfänger übergeht</p>'
            }
            <div class="bill2-right">
              <div class="bill-field">
                <p style="font-weight: ${invoice.type === 'D' ? 'normal' : 'bold'};">Nettobetrag:</p>
                <p>${this.formatCurrency(nettoBetrag)}</p>
              </div>
              ${invoice.type === 'D' ? `
                <div class="bill-field">
                  <p>zzgl. 20% MwSt.:</p>
                  <p>${this.formatCurrency(mwst)}</p>
                </div>
                ${invoice.depositAmount > 0 ? `
                  <div class="bill-field">
                    <p>- Anzahlung vom ${this.formatDate(invoice.depositPaidOn)}:</p>
                    <p>${this.formatCurrency(anzahlungNetto)}</p>
                  </div>
                  <div class="bill-field">
                    <p>- Umsatzsteuer Anzahlung</p>
                    <p>${this.formatCurrency(anzahlungMwst)}</p>
                  </div>
                ` : ''}
                <div class="bill-field">
                  <p style="font-weight: bold;">${invoice.depositAmount > 0 ? 'Restbetrag:' : 'Betrag:'}</p>
                  <p>${this.formatCurrency(restbetrag)}</p>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
        <div class="footer">
          <div class="footer-left">
            <p>Melchior-Erdbau</p>
            <p>Schilterndorf 29</p>
            <p>9150 Bleiburg</p>
          </div>
          <div class="footer-middle">
            <p>UID: ATU78017548</p>
            <p>Steuernummer: 576570535</p>
            <p>Inhaber: Melchior Hermann</p>
          </div>
          <div class="footer-right">
            <p>Kärntner Sparkasse Bleiburg</p>
            <p>IBAN: AT142070604600433397</p>
            <p>BIC: KSPKAT2KXXX</p>
          </div>
        </div>
      </div>
    `;

    return container;
  }

  private createContractHtmlElement(contract: Contract): HTMLElement {
    const container = document.createElement('div');
    container.className = 'main-two';
    container.style.position = 'absolute';
    container.style.left = '-99999px';
    container.style.top = '0';

    const logoPath = '/assets/images/logo_v1.png';
    
    const nettoBetrag = this.calculateContractNetto(contract);
    const mwst = nettoBetrag * 0.2;
    const gesamtBetrag = nettoBetrag + mwst;

    container.innerHTML = `
      <style>
        .main-two {
          zoom: 0.5;
          width: calc(210mm * 2);
          height: calc(297mm * 2);
          border: black 2px solid;
          -webkit-print-color-adjust: exact;
          background-color: white;
        }
        
        .content {
          margin: calc(20mm * 2);
        }
        
        .header {
          height: calc(90mm * 2);
        }
        
        .logo {
          position: absolute;
          width: calc(2 * 30mm);
          left: calc(2 * 18mm);
        }
        
        .info {
          position: relative;
          width: calc(50mm * 2);
          height: calc(50mm * 2);
          top: calc(10mm * 2);
          left: calc(120mm * 2);
          font-size: calc(3mm * 2);
          text-align: right;
          margin: 0;
          padding: 0;
        }
        
        .info > p {
          margin: 0;
        }
        
        .info-line-break {
          height: calc(5mm * 2);
        }
        
        .customer {
          position: relative;
          height: calc(13mm * 2);
          width: calc(50mm * 2);
          top: calc(-15mm * 2);
          left: calc(0mm * 2);
          font-size: calc(3mm * 2);
        }
        
        .customer > p {
          margin: 0;
        }
        
        .contract {
          position: relative;
          left: calc(0mm * 2);
          top: calc(-2mm * 2);
          font-weight: bold;
          font-size: calc(7mm * 2);
        }
        
        .contract-info {
          position: relative;
          border-bottom: black calc(1px * 2) solid;
          width: calc(170mm * 2);
          height: calc(7.5mm * 2);
          top: calc(-5mm * 2);
          left: calc(0mm * 2);
          font-size: calc(3mm * 2);
          font-weight: bold;
        }
        
        .contract-info-left {
          position: absolute;
          left: 0;
          top: calc(2 * -3mm);
          width: calc(2 * 50mm);
        }
        
        .contract-info-middle {
          position: absolute;
          top: calc(2 * -3mm);
          left: calc(2 * 60mm);
          width: calc(2 * 50mm);
          text-align: center;
        }
        
        .contract-info-right {
          position: absolute;
          top: calc(2 * -3mm);
          left: calc(2 * 120mm);
          width: calc(2 * 50mm);
          text-align: right;
        }
        
        .positions {
          position: relative;
          height: calc(2 * 140mm);
          top: 0;
        }
        
        .table-a {
          font-size: calc(2 * 3mm);
          font-family: arial, sans-serif;
          border-collapse: collapse;
          width: 100%;
        }
        
        .tr-a > td, .tr-a > th {
          border: calc(2 * 1px) solid #000000;
          text-align: left;
          padding: calc(2 * 1mm);
        }
        
        .tr-a > th {
          background-color: #cbcbcb;
          font-weight: bold;
        }
        
        .tr-a > th:nth-child(1) {
          text-align: center;
          width: calc(2 * 6mm);
        }
        
        .tr-a > th:nth-child(2) {
          width: calc(2 * 90mm);
        }
        
        .tr-a > th:nth-child(3) {
          width: calc(2 * 22mm);
          text-align: right;
        }
        
        .tr-a > th:nth-child(4) {
          width: calc(2 * 20mm);
          text-align: center;
        }
        
        .tr-a > th:nth-child(5) {
          width: calc(2 * 22mm);
          text-align: right;
        }
        
        .tr-a > td:nth-child(1) {
          text-align: center;
        }
        
        .tr-a > td:nth-child(2) {
          text-align: left;
        }
        
        .tr-a > td:nth-child(3) {
          text-align: right;
        }
        
        .tr-a > td:nth-child(4) {
          text-align: center;
        }
        
        .tr-a > td:nth-child(5) {
          text-align: right;
        }
        
        .bill {
          margin-top: calc(2 * 4mm);
          height: calc(2 * 20mm);
          font-size: calc(2 * 3mm);
        }
        
        .bill > p:nth-child(1) {
          position: relative;
          top: calc(2 * 1mm);
          width: fit-content;
        }
        
        .bill > p:nth-child(2) {
          position: relative;
          top: calc(2 * -6mm);
          width: calc(2 * 25mm);
          left: calc(2 * 115mm);
        }
        
        .bill > p:nth-child(3) {
          position: relative;
          top: calc(2 * -9mm);
          width: calc(2 * 25mm);
          left: calc(2 * 115mm);
        }
        
        .bill > p:nth-child(4) {
          position: relative;
          font-weight: bold;
          top: calc(2 * -12mm);
          width: calc(2 * 25mm);
          left: calc(2 * 115mm);
        }
        
        .bill > p:nth-child(5) {
          position: relative;
          top: calc(2 * -27mm);
          width: calc(2 * 20mm);
          left: calc(2 * 149mm);
          text-align: right;
        }
        
        .bill > p:nth-child(6) {
          position: relative;
          top: calc(2 * -30mm);
          width: calc(2 * 20mm);
          left: calc(2 * 149mm);
          text-align: right;
        }
        
        .bill > p:nth-child(7) {
          position: relative;
          font-weight: bold;
          top: calc(2 * -33mm);
          width: calc(2 * 20mm);
          left: calc(2 * 149mm);
          text-align: right;
        }
        
        .footer {
          height: calc(2 * 20mm);
          display: flex;
        }
        
        .footer > div {
          position: relative;
          height: inherit;
          left: 0;
          width: 33.3%;
          text-align: left;
          font-size: calc(2 * 3mm);
        }
        
        .footer > div > p {
          position: relative;
          top: calc(2 * 2mm);
          margin: calc(2 * 1mm) !important;
        }
      </style>
      <div class="content">
        <div class="header">
          <img class="logo" src="${logoPath}" />
          <div class="info">
            <p>Melchior Hermann</p>
            <p>Schilterndorf 29</p>
            <p>9150 Bleiburg</p>
            <p class="info-line-break"></p>
            <p>Telefon: 0676 / 6259929</p>
            <p class="info-line-break"></p>
            <p>E-Mail: office@melchior-erdbau.at</p>
            <p>Web: melchior-erdbau.at</p>
          </div>
          <div class="customer">
            <p>${contract.customer?.firstname || ''} ${contract.customer?.surname || ''}</p>
            <p>${contract.customer?.address || ''} ${contract.customer?.nr || ''}</p>
            <p>${contract.customer?.plz || ''} ${contract.customer?.city || ''}</p>
          </div>
          <p class="contract">Angebot</p>
          <div class="contract-info">
            <p class="contract-info-left">Angebot Nr. ${contract.contractId}</p>
            <p class="contract-info-middle">Kunde Nr. ${contract.customer?.customerId || ''}</p>
            <p class="contract-info-right">Datum: ${this.formatDate(contract.createdAt)}</p>
          </div>
        </div>
        <div class="positions">
          <table class="table-a">
            <thead>
              <tr class="tr-a">
                <th>Pos</th>
                <th>Beschreibung</th>
                <th>Einzelpreis</th>
                <th>Anzahl</th>
                <th>Gesamtpreis</th>
              </tr>
            </thead>
            <tbody>
              ${contract.positions?.map((pos, index) => `
                <tr class="tr-a">
                  <td>${index + 1}</td>
                  <td>${pos.position?.text || ''}</td>
                  <td>${this.formatCurrency(pos.position?.price || 0)}</td>
                  <td>${pos.amount} ${pos.position?.unit || ''}</td>
                  <td>${this.formatCurrency((pos.amount || 0) * (pos.position?.price || 0))}</td>
                </tr>
              `).join('') || ''}
            </tbody>
          </table>
          <div class="bill">
            <p>Dieses Angebot ist 10 Tage lang gültig</p>
            <p>Nettobetrag:</p>
            <p>zzgl. 20% MwSt.:</p>
            <p>Gesamtbetrag:</p>
            <p>${this.formatCurrency(nettoBetrag)}</p>
            <p>${this.formatCurrency(mwst)}</p>
            <p>${this.formatCurrency(gesamtBetrag)}</p>
          </div>
        </div>
        <div class="footer">
          <div class="footer-left">
            <p>Melchior-Erdbau</p>
            <p>Schilterndorf 29</p>
            <p>9150 Bleiburg</p>
          </div>
          <div class="footer-middle">
            <p>UID: ATU78017548</p>
            <p>Steuernummer: 576570535</p>
            <p>Inhaber: Melchior Hermann</p>
          </div>
          <div class="footer-right">
            <p>Kärntner Sparkasse Bleiburg</p>
            <p>IBAN: AT142070604600433397</p>
            <p>BIC: KSPKAT2KXXX</p>
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
