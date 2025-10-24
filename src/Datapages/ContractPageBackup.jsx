import "../Styles/ContractPage.css"
import logo from '../images/logo_v1.png'
import {useEffect} from "react";
import axios from "axios";

export default function ContractPage({contractId}){

    useEffect(() => {
        axios.get("http://192.168.0.236:8080/contracts/" + contractId).then(res => {
            console.log(res.data);
        })
    }, [])


    return(
        <div className="main-two">
            <div className="content">
                <div className="header">
                    <img className="logo" src={logo} />
                    <div className="info">
                        <p>Melchior-Erdbau</p>
                        <p>Schilterndorf 29</p>
                        <p>9150 Bleiburg</p>
                        <p className="info-line-break"></p>
                        <p>Telefon: 0676 / 6259929</p>
                        <p className="info-line-break"></p>
                        <p>E-Mail: office@melchior-erdbau.at</p>
                        <p>Web: melchior-erdbau.at</p>
                    </div>
                    <div className="customer">
                        <p>Max Mustermann</p>
                        <p>Musterstr. 12</p>
                        <p>Musterhausen</p>
                    </div>
                    <p className="contract">Angebot</p>
                    <div className="contract-info">
                        <p className="contract-info-left">Angebot Nr. 1234</p>
                        <p className="contract-info-middle">Kunde Nr. 1001</p>
                        <p className="contract-info-right">Datum: 08.04.2022</p>
                    </div>
                </div>
                <div className="positions">
                    <table className="table-a">
                        <tr className="tr-a">
                            <th>Pos</th>
                            <th>Beschreibung</th>
                            <th>Einzelpreis</th>
                            <th>Anzahl</th>
                            <th>Gesamtpreis</th>

                        </tr>
                        <tr className="tr-a">
                            <td>1</td>
                            <td>Beispieldienstleistung</td>
                            <td>69,00 €</td>
                            <td>2,5 Stunden</td>
                            <td>172,50 €</td>
                        </tr>
                        <tr className="tr-a">
                            <td>1</td>
                            <td>Beispieldienstleistung</td>
                            <td>69,00 €</td>
                            <td>2,5 Stunden</td>
                            <td>172,50 €</td>
                        </tr>
                        <tr className="tr-a">
                            <td>1</td>
                            <td>Beispieldienstleistung</td>
                            <td>69,00 €</td>
                            <td>2,5 Stunden</td>
                            <td>172,50 €</td>
                        </tr>
                        <tr className="tr-a">
                            <td>1</td>
                            <td>Beispieldienstleistung</td>
                            <td>69,00 €</td>
                            <td>2,5 Stunden</td>
                            <td>172,50 €</td>
                        </tr>
                        <tr className="tr-a">
                            <td>1</td>
                            <td>Beispieldienstleistung</td>
                            <td>69,00 €</td>
                            <td>2,5 Stunden</td>
                            <td>172,50 €</td>
                        </tr>
                        <tr className="tr-a">
                            <td>1</td>
                            <td>Beispieldienstleistung</td>
                            <td>69,00 €</td>
                            <td>2,5 Stunden</td>
                            <td>172,50 €</td>
                        </tr>
                        <tr className="tr-a">
                            <td>1</td>
                            <td>Beispieldienstleistung</td>
                            <td>69,00 €</td>
                            <td>2,5 Stunden</td>
                            <td>172,50 €</td>
                        </tr>
                        <tr className="tr-a">
                            <td>1</td>
                            <td>Beispieldienstleistung</td>
                            <td>69,00 €</td>
                            <td>2,5 Stunden</td>
                            <td>172,50 €</td>
                        </tr>
                        <tr className="tr-a">
                            <td>1</td>
                            <td>Beispieldienstleistung</td>
                            <td>69,00 €</td>
                            <td>2,5 Stunden</td>
                            <td>172,50 €</td>
                        </tr>

                    </table>
                    <div className="bill">
                        <p>Dieses Angebot ist 4 Wochen lang gültig</p>
                        <p>Nettobetrag:</p>
                        <p>zzgl. 20% MwSt.:</p>
                        <p>Gesamtbetrag:</p>
                        <p>301,50€</p>
                        <p>57,29€</p>
                        <p>358,79€</p>
                    </div>
                </div>
                <div className="footer">

                </div>
            </div>
        </div>
    )
}