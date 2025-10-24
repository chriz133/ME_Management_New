import "../Styles/ContractPage.css"
import logo from '../images/logo_v1.png'
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import contractDataService from "../Data/ContractDataService";
import contractPositionDataService from "../Data/ContractPositionDataService";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {Button} from "@mui/material";

export default function ContractPage(){
    const [contract, setContract] = useState();
    const [contractPositions, setContractPositions] = useState([]);
    const [customer, setCustomer] = useState([]);

    const {contractId} = useParams();

    useEffect(() => {
        fetchdata();
        async function fetchdata(){
            let contractid = -1;
            await contractDataService.getById(contractId).then(res => {
                setContract(res.data)
                contractid = res.data.contractId;
            })

            contractPositionDataService.getByContractId(contractid).then(res => {
                setContractPositions(res.data);
            })
        }
    }, [])

    const formatNumber = (number) => {
        return number.toFixed(2).replace('.', ',');
    }

    const printToPDF = () => {
        const input = document.getElementById('main1');

        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'pt', 'a4', false);
            pdf.addImage(imgData, 'PNG', 0, 0, 595, 0, undefined, false);

            const title = contract.contractId.toLocaleString('de-AT', {
                minimumIntegerDigits: 3
            }) + '_Rechnung_' + contract.customer.surname + '_' + contract.customer.firstname + "_" + contract.createdAt + '.pdf';
            pdf.save(title);
        })
    }

    const navigate = useNavigate();


    return(
        <>
            <Button color="warning" variant="contained" onClick={() => {navigate(-1);}} className="btn-save">Zurück</Button>
            <Button color="info" variant="contained" onClick={printToPDF} className="btn-save">Speichern</Button>
            <div className="main-two" id="main1">
            <div className="content">
                <div className="header">
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
                        <p>{contract && contract.customer.firstname + ' ' + contract.customer.surname}</p>
                        <p>{contract && contract.customer.address + ' ' + contract.customer.nr}</p>
                        <p>{contract && contract.customer.plz + ' ' + contract.customer.city}</p>
                    </div>
                    <p className="contract">Angebot</p>
                    <div className="contract-info">
                        <p className="contract-info-left">Angebot Nr. {contract && contract.contractId}</p>
                        <p className="contract-info-middle">Kunde Nr. {contract && contract.customer.customerId}</p>
                        <p className="contract-info-right">Datum: {contract && contract.createdAt}</p>
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
                        {contractPositions && contractPositions.map((data, index) => (
                            <tr className="tr-a" key={index+1}>
                                <td>{index+1}</td>
                                <td>{data.position.text}</td>
                                <td>{formatNumber(data.position.price)} €</td>
                                <td>{data.amount + ' ' + data.position.unit}</td>
                                <td>{formatNumber(data.amount* data.position.price)} €</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div className="bill">
                        <p>Dieses Angebot ist 10 Tage lang gültig</p>
                        <p>Nettobetrag:</p>
                        <p>zzgl. 20% MwSt.:</p>
                        <p>Gesamtbetrag:</p>
                        <p>{contract && formatNumber(contract.sumPrice)}€</p>
                        <p>{contract && formatNumber(contract.sumPrice * 0.2)}€</p>
                        <p>{contract && formatNumber(contract.sumPrice + (contract.sumPrice * 0.2))}€</p>
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