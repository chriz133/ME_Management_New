import "../Styles/ContractPage.css"
import logo from '../images/logo_v1.png'
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import invoiceDataService from "../Data/InvoiceDataService";
import invoicePositionDataService from "../Data/InvoicePositionDataService";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {Button} from "@mui/material";

export default function ContractPage(){
    const [invoice, setInvoice] = useState();
    const [invoicePositions, setInvoicePositions] = useState([]);

    const {invoiceId} = useParams();

    useEffect(() => {
        fetchdata();
        async function fetchdata(){
            invoiceDataService.getById(invoiceId).then(res => {
                console.log(res.data);
                setInvoice(res.data)
            })

            invoicePositionDataService.getByInvoiceId(invoiceId).then(res => {
                setInvoicePositions(res.data);
            })
        }
    }, [])

    const formatNumber = (number) => {
        return number.toFixed(2).replace('.', ',');
    }

    const printToPDF = () => {
        const input = document.getElementById('main1');

        // Aktuellen Zoom-Wert speichern
        const originalZoom = input.style.zoom;

        // Zoom auf 1 setzen
        input.style.zoom = 1;

        // PDF-Generierung starten
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'pt', 'a4', true);
            pdf.addImage(imgData, 'PNG', 0, 0, 595, 842);

            const title = invoice.invoiceId.toLocaleString('de-AT', {
                minimumIntegerDigits: 3
            }) + '_Rechnung_' + invoice.customer.surname + '_' + invoice.customer.firstname + "_" + invoice.createdAt + '.pdf';
            pdf.save(title);

            // Zoom zurücksetzen
            input.style.zoom = originalZoom;
        });
    };


    const navigate = useNavigate();

    return(
        <>
            <Button color="warning" variant="contained" onClick={() => {navigate(-1);}} className="btn-save">Zurück</Button>
            <Button color="info" variant="contained" onClick={printToPDF} className="btn-save">Speichern</Button>
            <div className="main-two" id="main1">
            <div className="content">
                <div className="header2">
                    <img className="logo" src={logo} />
                    <div className="info">
                        {/*<p>Melchior-Erdbau</p>*/}
                        <p>Melchior Hermann</p>
                        <p>Schilterndorf 29</p>
                        <p>9150 Bleiburg</p>
                        <p className="info-line-break"></p>
                        <p>Telefon: 0676 / 6259929</p>
                        <p className="info-line-break"></p>
                        <p>E-Mail: office@melchior-erdbau.at</p>
                        <p>Web: melchior-erdbau.at</p>
                    </div>
                    <div className="customer">
                        <p>{invoice && invoice.customer.firstname + ' ' + invoice.customer.surname}</p>
                        <p>{invoice && invoice.customer.address + ' ' + invoice.customer.nr}</p>
                        <p>{invoice && invoice.customer.plz + ' ' + invoice.customer.city}</p>
                        <p>{(invoice && invoice.customer.uid !== null) && invoice.customer.uid}</p>
                    </div>
                    <p className="contract">Rechnung</p>
                    <div className="invoice-info">
                        <p className="contract-info-left">Rechnung Nr. {invoice && invoice.invoiceId}</p>
                        <p className="contract-info-middle">Kunde Nr. {invoice && invoice.customer.customerId}</p>
                        <p className="contract-info-right">Datum: {invoice && invoice.createdAt}</p>
                        <p className="contract-info-worktime">{invoice && 'Leistungszeitraum vom ' + invoice.startedAtFormatted + ' bis zum ' + invoice.finishedAtFormatted}</p>
                    </div>
                </div>
                <div className="positions">
                    <table className="table-a">
                        <thead>
                        <tr className="tr-a">
                            <th>Pos</th>
                            <th>Beschreibung</th>
                            <th>Einzelpreis</th>
                            <th>Anzahl</th>
                            <th>Gesamtpreis</th>

                        </tr>
                        </thead>
                        <tbody>
                        {invoicePositions && invoicePositions.map((data, index) => (
                            <tr className="tr-a" key={index+1}>
                                <td>{index+1}</td>
                                <td>{data.position.text}</td>
                                <td>{formatNumber(data.position.price)} €</td>
                                <td>{data.amount + ' ' + data.position.unit}</td>
                                <td>{formatNumber(data.amount * data.position.price)} €</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div className="bill2">
                        {(invoice && invoice.type === 'D') ?
                            <p className='bill2-info'>Zahlbar nach Erhalt der Rechnung</p> :
                            <p className='bill2-info'>Es wird darauf hingewiesen, dass die Steuerschuld gem. § 19 Abs. 1a UStG auf den Leistungsempfänger übergeht</p>
                        }
                        <div className="bill2-right">
                            <div className='bill-field'>
                                <p style={{fontWeight: (invoice && invoice.type === "D") ? 'normal' : 'bold'}}>Nettobetrag:</p>
                                <p>{invoice && formatNumber(invoice.sumPrice)}€</p>
                            </div>
                            {invoice && invoice.type === 'D' &&
                                <>
                            <div className='bill-field'>
                                <p>zzgl. 20% MwSt.:</p>
                                <p>{invoice && formatNumber(invoice.sumPrice * 0.2)}€</p>
                            </div>
                            {invoice && invoice.depositAmount != 0 &&
                            <><div className='bill-field'>
                                <p>{invoice && '- Anzahlung vom ' + invoice.depositPaidOnFormatted + ':'}</p>
                                <p>{invoice && formatNumber((invoice.depositAmount/120)*100)}€</p>
                            </div>
                            <div className='bill-field'>
                                <p>- Umsatzsteuer Anzahlung</p>
                                <p>{invoice && formatNumber(invoice.depositAmount - (invoice.depositAmount/120)*100)}€</p>
                            </div></>}
                            <div className='bill-field'>
                                <p style={{fontWeight: 'bold'}}>{invoice && invoice.depositAmount != 0 ? 'Restbetrag:' : 'Betrag:'}</p>
                                <p>{invoice && formatNumber(invoice.sumPrice + (invoice.sumPrice * 0.2) - invoice.depositAmount)}€</p>
                            </div>
                            </>}
                            {/*<p>Nettobetrag:</p> /!*2*!/*/}
                        </div>
                            {/*<p>Nettobetrag:</p> /!*2*!/*/}
                            {/*<p>zzgl. 20% MwSt.:</p> /!*3*!/*/}
                            {/*<p>{invoice && '- Anzahlung vom ' + invoice.depositPaidOnFormatted + ':'}</p>*/}
                            {/*<p>- Umsatzsteuer Anzahlung</p>*/}
                            {/*<p>Restbetrag:</p> /!*4*!/*/}
                            {/*<p>{invoice && formatNumber(invoice.sumPrice)}€</p> /!*5*!/*/}
                            {/*<p>{invoice && formatNumber(invoice.sumPrice * 0.2)}€</p> /!*6*!/*/}
                            {/*<p>{invoice && formatNumber((invoice.depositAmount/120)*100)}€</p>*/}
                            {/*<p>{invoice && formatNumber(invoice.depositAmount - (invoice.depositAmount/120)*100)}€</p>*/}
                            {/*<p>{invoice && formatNumber(invoice.sumPrice + (invoice.sumPrice * 0.2) - invoice.depositAmount)}€</p> /!*7*!/*/}
                    </div>
                </div>
                <div className="footer">
                    <div className="footer-left">
                        <p>Melchior-Erdbau</p>
                        <p>Schilterndorf 29</p>
                        <p>9150 Bleiburg</p>
                    </div>
                    <div className="footer-middle">
                        <p>UID: ATU78017548</p>
                        <p>Steuernummer: 576570535</p>
                        <p>Inhaber: Melchior Hermann</p>
                    </div>
                    <div className="footer-right">
                        <p>Kärntner Sparkasse Bleiburg</p>
                        <p>IBAN: AT142070604600433397</p>
                        <p>BIC: KSPKAT2KXXX</p>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}