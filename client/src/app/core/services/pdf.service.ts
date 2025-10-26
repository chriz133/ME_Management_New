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
    // Position on screen but make it invisible
    element.style.position = 'fixed';
    element.style.left = '0';
    element.style.top = '0';
    element.style.zIndex = '-9999';
    element.style.visibility = 'hidden';
    
    document.body.appendChild(element);
    
    // Wait for images to load
    await this.waitForImagesToLoad(element);
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4', true);
      
      // Always use the captured canvas dimensions
      const imgWidth = 595;
      const imgHeight = 842;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      pdf.save(filename);
    } finally {
      document.body.removeChild(element);
    }
  }

  private async viewPdfFromElement(element: HTMLElement, isInvoice: boolean): Promise<void> {
    element.style.position = 'fixed';
    element.style.left = '0';
    element.style.top = '0';
    element.style.zIndex = '-9999';
    element.style.visibility = 'hidden';
    
    document.body.appendChild(element);
    
    await this.waitForImagesToLoad(element);
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4', true);
      
      const imgWidth = 595;
      const imgHeight = 842;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Open in new tab
      const pdfBlob = pdf.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      window.open(url, '_blank');
    } finally {
      document.body.removeChild(element);
    }
  }

  private async waitForImagesToLoad(element: HTMLElement): Promise<void> {
    const images = element.getElementsByTagName('img');
    const promises: Promise<void>[] = [];
    
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      if (!img.complete) {
        promises.push(
          new Promise((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve(); // Resolve even on error to not block
          })
        );
      }
    }
    
    await Promise.all(promises);
    // Give additional time for rendering
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  private createInvoiceHtmlElement(invoice: Invoice): HTMLElement {
    const container = document.createElement('div');
    container.className = 'main-two';

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
          font-family: Arial, sans-serif;
        }
        
        .content {
          margin: calc(20mm * 2);
          position: relative;
        }
        
        .header2 {
          position: relative;
          height: calc(95mm * 2);
        }
        
        .logo {
          position: absolute;
          width: calc(30mm * 2);
          height: auto;
          top: 0;
          left: calc(18mm * 2);
        }
        
        .info {
          position: absolute;
          width: calc(50mm * 2);
          top: calc(10mm * 2);
          right: 0;
          font-size: calc(3mm * 2);
          text-align: right;
        }
        
        .info p {
          margin: 0;
          line-height: calc(4mm * 2);
        }
        
        .info-line-break {
          height: calc(5mm * 2);
        }
        
        .customer {
          position: absolute;
          width: calc(50mm * 2);
          top: calc(65mm * 2);
          left: 0;
          font-size: calc(3mm * 2);
        }
        
        .customer p {
          margin: 0;
          line-height: calc(4mm * 2);
        }
        
        .contract {
          position: absolute;
          top: calc(80mm * 2);
          left: 0;
          font-weight: bold;
          font-size: calc(7mm * 2);
          margin: 0;
        }
        
        .invoice-info {
          position: absolute;
          border-bottom: black calc(1px * 2) solid;
          width: 100%;
          height: calc(12mm * 2);
          top: calc(89mm * 2);
          left: 0;
          font-size: calc(3mm * 2);
          font-weight: bold;
        }
        
        .contract-info-left {
          position: absolute;
          left: 0;
          top: 0;
          margin: 0;
        }
        
        .contract-info-middle {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: 0;
          margin: 0;
        }
        
        .contract-info-right {
          position: absolute;
          right: 0;
          top: 0;
          margin: 0;
        }
        
        .contract-info-worktime {
          position: absolute;
          left: 0;
          top: calc(7mm * 2);
          font-size: calc(4mm * 2);
          font-weight: normal;
          margin: 0;
        }
        
        .positions {
          position: relative;
        }
        
        .table-a {
          width: 100%;
          font-size: calc(3mm * 2);
          font-family: Arial, sans-serif;
          border-collapse: collapse;
          margin-bottom: calc(4mm * 2);
        }
        
        .tr-a td, .tr-a th {
          border: calc(1px * 2) solid #000000;
          text-align: left;
          padding: calc(1mm * 2);
        }
        
        .tr-a th {
          background-color: #cbcbcb;
          font-weight: bold;
        }
        
        .tr-a th:nth-child(1),
        .tr-a td:nth-child(1) {
          text-align: center;
          width: calc(6mm * 2);
        }
        
        .tr-a th:nth-child(2),
        .tr-a td:nth-child(2) {
          width: calc(90mm * 2);
        }
        
        .tr-a th:nth-child(3),
        .tr-a td:nth-child(3),
        .tr-a th:nth-child(4),
        .tr-a td:nth-child(4),
        .tr-a th:nth-child(5),
        .tr-a td:nth-child(5) {
          text-align: right;
        }
        
        .tr-a th:nth-child(4),
        .tr-a td:nth-child(4) {
          text-align: center;
        }
        
        .bill2 {
          position: relative;
          min-height: calc(30mm * 2);
          font-size: calc(3mm * 2);
        }
        
        .bill2-info {
          width: 100%;
          margin-bottom: calc(5mm * 2);
        }
        
        .bill2-right {
          float: right;
          width: calc(80mm * 2);
        }
        
        .bill-field {
          display: flex;
          justify-content: space-between;
          margin-bottom: calc(2mm * 2);
        }
        
        .bill-field p {
          margin: 0;
        }
        
        .footer {
          position: relative;
          display: flex;
          justify-content: space-between;
          margin-top: calc(10mm * 2);
          padding-top: calc(5mm * 2);
          font-size: calc(3mm * 2);
        }
        
        .footer > div {
          flex: 1;
        }
        
        .footer p {
          margin: calc(1mm * 2) 0;
          line-height: calc(4mm * 2);
        }
      </style>
      <div class="content">
        <div class="header2">
          <img class="logo" src="/assets/images/logo_v1.png" alt="Logo" crossorigin="anonymous" />
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
            <p class="bill2-info">
              ${invoice.type === 'D' ? 
                'Zahlbar nach Erhalt der Rechnung' : 
                'Es wird darauf hingewiesen, dass die Steuerschuld gem. § 19 Abs. 1a UStG auf den Leistungsempfänger übergeht'
              }
            </p>
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
                    <p>- Umsatzsteuer Anzahlung:</p>
                    <p>${this.formatCurrency(anzahlungMwst)}</p>
                  </div>
                ` : ''}
                <div class="bill-field" style="font-weight: bold; border-top: calc(1px * 2) solid #000; padding-top: calc(2mm * 2); margin-top: calc(2mm * 2);">
                  <p>${invoice.depositAmount > 0 ? 'Restbetrag:' : 'Betrag:'}</p>
                  <p>${this.formatCurrency(restbetrag)}</p>
                </div>
              ` : ''}
            </div>
            <div style="clear: both;"></div>
          </div>
        </div>
        
        <div class="footer">
          <div>
            <p><strong>Melchior-Erdbau</strong></p>
            <p>Schilterndorf 29</p>
            <p>9150 Bleiburg</p>
          </div>
          <div>
            <p>UID: ATU78017548</p>
            <p>Steuernummer: 576570535</p>
            <p>Inhaber: Melchior Hermann</p>
          </div>
          <div>
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
          font-family: Arial, sans-serif;
        }
        
        .content {
          margin: calc(20mm * 2);
          position: relative;
        }
        
        .header {
          position: relative;
          height: calc(90mm * 2);
        }
        
        .logo {
          position: absolute;
          width: calc(30mm * 2);
          height: auto;
          top: 0;
          left: calc(18mm * 2);
        }
        
        .info {
          position: absolute;
          width: calc(50mm * 2);
          top: calc(10mm * 2);
          right: 0;
          font-size: calc(3mm * 2);
          text-align: right;
        }
        
        .info p {
          margin: 0;
          line-height: calc(4mm * 2);
        }
        
        .info-line-break {
          height: calc(5mm * 2);
        }
        
        .customer {
          position: absolute;
          width: calc(50mm * 2);
          top: calc(60mm * 2);
          left: 0;
          font-size: calc(3mm * 2);
        }
        
        .customer p {
          margin: 0;
          line-height: calc(4mm * 2);
        }
        
        .contract {
          position: absolute;
          top: calc(75mm * 2);
          left: 0;
          font-weight: bold;
          font-size: calc(7mm * 2);
          margin: 0;
        }
        
        .contract-info {
          position: absolute;
          border-bottom: black calc(1px * 2) solid;
          width: 100%;
          height: calc(7.5mm * 2);
          top: calc(84mm * 2);
          left: 0;
          font-size: calc(3mm * 2);
          font-weight: bold;
        }
        
        .contract-info-left {
          position: absolute;
          left: 0;
          top: 0;
          margin: 0;
        }
        
        .contract-info-middle {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: 0;
          margin: 0;
        }
        
        .contract-info-right {
          position: absolute;
          right: 0;
          top: 0;
          margin: 0;
        }
        
        .positions {
          position: relative;
        }
        
        .table-a {
          width: 100%;
          font-size: calc(3mm * 2);
          font-family: Arial, sans-serif;
          border-collapse: collapse;
          margin-bottom: calc(4mm * 2);
        }
        
        .tr-a td, .tr-a th {
          border: calc(1px * 2) solid #000000;
          text-align: left;
          padding: calc(1mm * 2);
        }
        
        .tr-a th {
          background-color: #cbcbcb;
          font-weight: bold;
        }
        
        .tr-a th:nth-child(1),
        .tr-a td:nth-child(1) {
          text-align: center;
          width: calc(6mm * 2);
        }
        
        .tr-a th:nth-child(2),
        .tr-a td:nth-child(2) {
          width: calc(90mm * 2);
        }
        
        .tr-a th:nth-child(3),
        .tr-a td:nth-child(3),
        .tr-a th:nth-child(4),
        .tr-a td:nth-child(4),
        .tr-a th:nth-child(5),
        .tr-a td:nth-child(5) {
          text-align: right;
        }
        
        .tr-a th:nth-child(4),
        .tr-a td:nth-child(4) {
          text-align: center;
        }
        
        .bill {
          position: relative;
          min-height: calc(20mm * 2);
          font-size: calc(3mm * 2);
        }
        
        .bill-info {
          width: 100%;
          margin-bottom: calc(5mm * 2);
        }
        
        .bill-right {
          float: right;
          width: calc(60mm * 2);
        }
        
        .bill-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: calc(2mm * 2);
        }
        
        .bill-row p {
          margin: 0;
        }
        
        .bill-row.total {
          font-weight: bold;
          border-top: calc(1px * 2) solid #000;
          padding-top: calc(2mm * 2);
          margin-top: calc(2mm * 2);
        }
        
        .footer {
          position: relative;
          display: flex;
          justify-content: space-between;
          margin-top: calc(10mm * 2);
          padding-top: calc(5mm * 2);
          font-size: calc(3mm * 2);
          clear: both;
        }
        
        .footer > div {
          flex: 1;
        }
        
        .footer p {
          margin: calc(1mm * 2) 0;
          line-height: calc(4mm * 2);
        }
      </style>
      <div class="content">
        <div class="header">
          <img class="logo" src="/assets/images/logo_v1.png" alt="Logo" crossorigin="anonymous" />
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
            <p class="bill-info">Dieses Angebot ist 10 Tage lang gültig</p>
            <div class="bill-right">
              <div class="bill-row">
                <p>Nettobetrag:</p>
                <p>${this.formatCurrency(nettoBetrag)}</p>
              </div>
              <div class="bill-row">
                <p>zzgl. 20% MwSt.:</p>
                <p>${this.formatCurrency(mwst)}</p>
              </div>
              <div class="bill-row total">
                <p>Gesamtbetrag:</p>
                <p>${this.formatCurrency(gesamtBetrag)}</p>
              </div>
            </div>
            <div style="clear: both;"></div>
          </div>
        </div>
        
        <div class="footer">
          <div>
            <p><strong>Melchior-Erdbau</strong></p>
            <p>Schilterndorf 29</p>
            <p>9150 Bleiburg</p>
          </div>
          <div>
            <p>UID: ATU78017548</p>
            <p>Steuernummer: 576570535</p>
            <p>Inhaber: Melchior Hermann</p>
          </div>
          <div>
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
