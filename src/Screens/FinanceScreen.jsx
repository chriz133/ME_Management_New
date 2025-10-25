import Sidebar from "../FunctionalComponents/Sidebar";
import * as React from "react";
import '../Styles/FinanceScreen.css'
import {Link, useNavigate, useParams} from "react-router-dom";
import {Button, TextField} from "@mui/material";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {useEffect, useState} from "react";
import transactionDataService from "../Data/TransactionDataService";

function FinanceScreen() {
    const [data, setData] = useState([]);
    const [date, setDate] = useState(null);
    const [income, setIncome] = useState(0);
    const [outcome, setOutcome] = useState(0);

    const {dateParam} = useParams();

    const navigate = useNavigate();

    const formatNumber = (number) => {return number.toLocaleString('de-AT', {minimumIntegerDigits: 2, timeZone: 'Austria/Klagenfurt'})}

    useEffect(() => {
        if (!dateParam){
            const currentDate = new Date();
            setDate(currentDate.getFullYear() + '-' + formatNumber(currentDate.getMonth() + 1));
            return;
        }

        setDate(dateParam);

    }, [])

    useEffect(() => {
        if (date !== null){
            const dateText = date.split('-');
            transactionDataService.getByMonthYear(Number(dateText[1]), Number(dateText[0])).then(res => setData(res.data));

        }
    }, [date])

    useEffect(() => {
        let inCome = 0;
        let outCome = 0;

        data.forEach(d => {

            console.log(d);
            if (d.type === 'i'){
                inCome += d.amount;
            }
            else if (d.type === 'o'){
                outCome += d.amount;
            }
        })

        setIncome(inCome);
        setOutcome(outCome);
    }, [data])

    const months = ['Jänner','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember']

    const getDate = () => {
        const dateText = date.toLocaleString().split('-');
        return months[dateText[1] -1] + ' ' + dateText[0];
    }

    return(
        <>
            <Sidebar data="finance"/>
            <div className="customers-main">
                <div className="customers-title">
                    <h2>Bereich: Finanzen</h2>
                </div>
                <div className="customers-btn-panel">
                    <Link to="/finances/add" className="customers-link">
                        <Button className="customers-btn" variant="contained" >Neue Transaktion anlegen</Button>
                    </Link>
                </div>

                {/*<div className="customers-field">*/}
                <div className="finance-container">
                    <div className="finance-header">
                        <p>{date && getDate() + ' (' + data.length + ' Transaktionen)'}</p>
                        <TextField sx={{width: '30%'}} type="month" size="small" className="cell-tfield" value={date} onChange={(e) => {navigate('/finances/' + e.target.value); window.location.reload()}} />
                    </div>
                    <div className="finance-overview">
                        <div className="finance-field">
                            <ArrowUpwardIcon className="finance-icon in" />
                            <p>Einnahmen</p>
                            <h3>{'€ ' + income.toFixed(2).replace('.', ',')}</h3>
                        </div>
                        <div className="finance-field">
                            <p>Ausgaben</p>
                            <h3>{'€ ' + outcome.toFixed(2).replace('.', ',')}</h3>
                            <ArrowDownwardIcon className="finance-icon out" />
                        </div>
                        <div className={(income - outcome) >= 0 ? 'finance-field plus' : 'finance-field minus'}>
                            <p>Bilanz</p>
                            <h3>{'€ ' + (income - outcome).toFixed(2).replace('.', ',')}</h3>
                            <AttachMoneyIcon className="finance-icon bill-icon" />
                        </div>
                    </div>
                </div>
                <div className="list-main finance-list">
                    <h1>Einnahmen & Ausgaben</h1>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead sx={{backgroundColor: '#454545' }}>
                                <TableRow>
                                    <TableCell sx={{color: '#ffffff'}} align='right'>Betrag</TableCell>
                                    <TableCell sx={{color: '#ffffff'}} align='left'>Beschreibung</TableCell>
                                    <TableCell sx={{color: '#ffffff'}} align='center'>Datum</TableCell>
                                    <TableCell sx={{color: '#ffffff'}} align='center'>Bar/Karte</TableCell>
                                    <TableCell sx={{color: '#ffffff'}} align='center'>Funktionen</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.length > 0 ? data.map((data) => (
                                    <TableRow className={data.type === 'i' ? 'table-in' : 'table-out'}
                                        key={data.transactionId}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0, width: 0 },
                                            '&:nth-of-type(odd)' : {backgroundColor: '#d9d9d9'},
                                            height: 1}}
                                    >
                                        <TableCell component="th" scope="row" align='right'>
                                            {data.amount + '€'}
                                        </TableCell>
                                        <TableCell align='left'>{data.description}</TableCell>
                                        <TableCell align='center'>{data.dateFormatted}</TableCell>
                                        <TableCell align='center'>{data.medium === 'CARD' ? 'Karte' : 'Bar'}</TableCell>
                                        <TableCell sx={{width: '15%'}} align='center'>
                                            <Button variant="contained" color="info" size="small" onClick={() => navigate("/finances/edit/" + data.transactionId)}>Bearbeiten</Button>
                                        </TableCell>
                                    </TableRow>
                                )):
                                <TableRow>
                                    <TableCell>
                                        Keine Daten verfügbar
                                    </TableCell>
                                </TableRow>}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </>
    )
}

export default FinanceScreen;