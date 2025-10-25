import "../Styles/AddEditScreen.css"
import Sidebar from "../FunctionalComponents/Sidebar";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {
    Alert,
    Button, Checkbox,
    FormControlLabel,
    Radio,
    RadioGroup,
    Snackbar,
    TextField
} from "@mui/material";
import TableContainer from "@mui/material/TableContainer";
import * as React from "react";
import {useEffect, useState} from "react";
import {useNavigate, useParams, Link} from "react-router-dom";
import transactionDataService from "../Data/TransactionDataService";

function CustomerAddEditScreen() {
    const [transactionId, setTransactionId] = useState(null);
    const [amount, setAmount] = useState(null);
    const [description, setDescription] = useState(null);
    const [type, setType] = useState(null);
    const [date, setDate] = useState(null);
    const [medium, setMedium] = useState(null);

    const [title, setTitle] = useState(null);

    const [success, setSuccess] = useState(false);
    const [failed, setFailed] = useState(false);
    const [error, setError] = useState(false);

    const [multiMode, setMultiMode] = useState(false);

    const {id} = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        if (id){
            transactionDataService.getById(id).then(res => {
                const transaction = res.data;
                setTransactionId(transaction.transactionId);
                setAmount(transaction.amount);
                setDescription(transaction.description);
                setType(transaction.type);
                setDate(transaction.date);
                setMedium(transaction.medium);
                setTitle("bearbeiten");
            }).catch(res => {
                navigate(-1);
            })
        }
        else{
            setTitle("anlegen");
        }
    },[])

    let saving = false;

    const handleSubmit = () => {
        if (saving)
            return;

        if (description === null || amount === null ||
            type === null || date === null || medium === null){
            setFailed(true);
            setError(true);
            return;
        }

        const data = {
            description: description,
            amount: amount,
            type: type,
            date: date,
            medium: medium,
        }

        if (id) {
            // Update existing transaction
            transactionDataService.put(id, data).then(res => {
                setSuccess(true);
                saving = true;
            }).catch(res => {
                setFailed(true);
            })
        } else {
            // Create new transaction
            transactionDataService.post(data).then(res => {
                setSuccess(true);
                saving = true;
            }).catch(res => {
                setFailed(true);
            })
        }
    }

    const handleCloseSuccess = () => {
        setSuccess(false);
        if (!multiMode)
            navigate('/finances');

        navigate(0);
    }

    const handleCloseFailed = () => {
        setFailed(false);
    }

    return (
        <>
            <Sidebar data="finance" />
            <Snackbar open={success} autoHideDuration={multiMode ? 1000 : 6000} onClose={handleCloseSuccess}>
                <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
                    Transaktion erfolgreich {id ? 'aktualisiert' : 'angelegt'}!
                </Alert>
            </Snackbar>
            <Snackbar open={failed} autoHideDuration={multiMode ? 1000 : 6000} onClose={handleCloseFailed}>
                <Alert onClose={handleCloseFailed} severity="error" sx={{ width: '100%' }}>
                    Fehler beim {id ? 'Aktualisieren' : 'Anlegen'} der Transaktion!
                </Alert>
            </Snackbar>
            <div className="customer-main">
                <div className="customer-title">
                    <h2>Bereich: Transaktion {title}</h2>
                </div>
                <div className="customer-btn-panel">
                    <Link to="/finances" className="customer-link">
                        <Button className="customer-btn" variant="contained">Zeige Finanzen</Button>
                    </Link>
                </div>
                <div className="table-main">
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead sx={{ backgroundColor: '#454545' }}>
                                <TableRow>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell component="th" scope="row" className="cell-wrapper">
                                        <TableCell className="cell-title">Art</TableCell>
                                    </TableCell>
                                    <TableCell>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                            onChange={(e) => {setType(e.target.value)}}
                                        >
                                            <FormControlLabel value="i" checked={type === 'i'} control={<Radio />} label="Eingang" />
                                            <FormControlLabel value="o" checked={type === 'o'} control={<Radio />} label="Ausgang" />
                                        </RadioGroup>
                                    </TableCell>
                                    <TableCell className="cell-item" sx={error && type == null ? {width: '10%'} : {width: '0%'}}>
                                        <p style={{color: 'red', width: 'fit-content'}}>{(error && type == null) ? 'Feld darf nicht leer sein' : ''}</p>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row" className="cell-wrapper">
                                        <TableCell className="cell-title">Betrag</TableCell>
                                    </TableCell>
                                    <TableCell className="cell-item">
                                        <TextField type="number" size="small" className="cell-tfield" value={amount} onChange={(e) => setAmount(e.target.value)} />
                                    </TableCell>
                                    <TableCell className="cell-item" sx={error && amount == null ? {width: '10%'} : {width: '0%'}}>
                                        <p style={{color: 'red', width: 'fit-content'}}>{(error && amount == null) ? 'Feld darf nicht leer sein' : ''}</p>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row" className="cell-wrapper">
                                        <TableCell className="cell-title">Beschreibung</TableCell>
                                    </TableCell>
                                    <TableCell className="cell-item">
                                        <TextField type="text" size="small" className="cell-tfield" value={description} onChange={(e) => setDescription(e.target.value)} />
                                    </TableCell>
                                    <TableCell className="cell-item" sx={error && description == null ? {width: '10%'} : {width: '0%'}}>
                                        <p style={{color: 'red', width: 'fit-content'}}>{(error && description == null) ? 'Feld darf nicht leer sein' : ''}</p>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row" className="cell-wrapper">
                                        <TableCell className="cell-title">Datum</TableCell>
                                    </TableCell>
                                    <TableCell className="cell-item">
                                        <TextField type="date" size="small" className="cell-tfield" value={date} onChange={(e) => setDate(e.target.value)} />
                                    </TableCell>
                                    <TableCell className="cell-item" sx={error && date == null ? {width: '10%'} : {width: '0%'}}>
                                        <p style={{color: 'red', width: 'fit-content'}}>{(error && date == null) ? 'Feld darf nicht leer sein' : ''}</p>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row" className="cell-wrapper">
                                        <TableCell className="cell-title">Zahlungsmittel</TableCell>
                                    </TableCell>
                                    <TableCell>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                            onChange={(e) => {setMedium(e.target.value)}}
                                        >
                                            <FormControlLabel value="CARD" checked={medium === 'CARD'} control={<Radio />} label="Karte" />
                                            <FormControlLabel value="CASH" checked={medium === 'CASH'} control={<Radio />} label="Bar" />
                                        </RadioGroup>
                                    </TableCell>
                                    <TableCell className="cell-item" sx={error && medium == null ? {width: '20%'} : {width: '0%'}}>
                                        <p style={{color: 'red', width: 'fit-content'}}>{(error && medium == null) ? 'Feld darf nicht leer sein' : ''}</p>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row" className="cell-wrapper">
                                    </TableCell>
                                    <TableCell className="cell-item">
                                        <div className="control-field">
                                        <Button variant="contained" onClick={handleSubmit}>Speichern</Button>
                                        <FormControlLabel onChange={(e) => {setMultiMode(e.target.checked)}} control={<Checkbox />} label="Mehrere Transaktionen anlegen" labelPlacement="start" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </>
    )
}

export default CustomerAddEditScreen;