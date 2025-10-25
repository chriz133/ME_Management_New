import "../Styles/AddEditScreen.css"
import Sidebar from "../FunctionalComponents/Sidebar";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {Alert, Button, Snackbar, TextField} from "@mui/material";
import TableContainer from "@mui/material/TableContainer";
import * as React from "react";
import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate, useParams, Link} from "react-router-dom";
import customerDataService from "../Data/CustomerDataService";


function CustomerAddEditScreen() {
    const [customerId, setCustomerId] = useState(null);
    const [firstname, setFirstname] = useState(null);
    const [surname, setSurname] = useState(null);
    const [plz, setPlz] = useState(null);
    const [city, setCity] = useState(null);
    const [address, setAddress] = useState(null);
    const [nr, setNr] = useState(null);
    const [uid, setUid] = useState(null);

    const [title, setTitle] = useState(null);

    const [success, setSuccess] = useState(false);
    const [failed, setFailed] = useState(false);
    const [error, setError] = useState(false);

    const {userId} = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        if (userId){
            customerDataService.getById(userId).then(res => {
                const customer = res.data;
                setCustomerId(customer.customerId);
                setFirstname(customer.firstname);
                setSurname(customer.surname);
                setPlz(customer.plz);
                setCity(customer.city);
                setAddress(customer.address);
                setNr(customer.nr);
                setUid(customer.uid);
                setTitle("bearbeiten");
            }).catch(res => {
                navigate(-1);
            })

        }
        else{
            setTitle("anlegen");
        }
    },[])

    const handleSubmit = () => {

        if (firstname === null || surname === null || plz === null ||
            city === null || address === null || nr === null){
            setError(true);
            setFailed(true);
            return;
        }

        const data = {
            firstname: firstname,
            surname: surname,
            plz: plz,
            city: city,
            address: address,
            nr: nr,
            uid: uid
        }

        if (userId) {
            // Update existing customer
            customerDataService.put(userId, data).then(res => {
                setSuccess(true);
            }).catch(res => {
                setFailed(true);
            })
        } else {
            // Create new customer
            customerDataService.post(data).then(res => {
                setSuccess(true);
            }).catch(res => {
                setFailed(true);
            })
        }
    }

    const handleCloseSuccess = () => {
        setSuccess(false);
        navigate("/customers");
    }

    const handleCloseFailed = () => {
        setFailed(false);
    }

    return (
        <>
            <Sidebar data="customer" />
            <Snackbar open={success} autoHideDuration={6000} onClose={handleCloseSuccess}>
                <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
                    Kunde erfolgreich {userId ? 'aktualisiert' : 'angelegt'}!
                </Alert>
            </Snackbar>
            <Snackbar open={failed} autoHideDuration={6000} onClose={handleCloseFailed}>
                <Alert onClose={handleCloseFailed} severity="error" sx={{ width: '100%' }}>
                    Fehler beim {userId ? 'Aktualisieren' : 'Anlegen'} des Kunden!
                </Alert>
            </Snackbar>
            <div className="customer-main">
                <div className="customer-title">
                    <h2>Bereich: Kunden {title}</h2>
                </div>
                <div className="customer-btn-panel">
                    <Link to="/customers" className="customer-link">
                        <Button className="customer-btn" variant="contained">Zeige Alle Kunden</Button>
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
                                {/*<TableRow>*/}
                                {/*    <TableCell component="th" scope="row" className="cell-wrapper">*/}
                                {/*        <TableCell className="cell-title">ID</TableCell>*/}
                                {/*    </TableCell>*/}
                                {/*    <TableCell className="cell-item">*/}
                                {/*        <TextField disabled="true" size="small" className="cell-tfield" value={customerId}/>*/}
                                {/*    </TableCell>*/}
                                {/*</TableRow>*/}
                                <TableRow>
                                    <TableCell component="th" scope="row" className="cell-wrapper">
                                        <TableCell className="cell-title">Vorname</TableCell>
                                    </TableCell>
                                    <TableCell className="cell-item">
                                        <TextField size="small" className="cell-tfield" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
                                    </TableCell>
                                    <TableCell className="cell-item" sx={error && firstname == null ? {width: '20%'} : {width: '0%'}}>
                                        <p style={{color: 'red', width: 'fit-content'}}>{(error && firstname === null) ? 'Feld darf nicht leer sein' : ''}</p>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row" className="cell-wrapper">
                                        <TableCell className="cell-title">Nachname</TableCell>
                                    </TableCell>
                                    <TableCell className="cell-item">
                                        <TextField size="small" className="cell-tfield" value={surname} onChange={(e) => setSurname(e.target.value)} />
                                    </TableCell>
                                    <TableCell className="cell-item" sx={error && surname == null ? {width: '20%'} : {width: '0%'}}>
                                        <p style={{color: 'red', width: 'fit-content'}}>{(error && surname === null) ? 'Feld darf nicht leer sein' : ''}</p>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row" className="cell-wrapper">
                                        <TableCell className="cell-title">PLZ</TableCell>
                                    </TableCell>
                                    <TableCell className="cell-item">
                                        <TextField type="number" size="small" className="cell-tfield" value={plz} onChange={(e) => setPlz(e.target.value)} />
                                    </TableCell>
                                    <TableCell className="cell-item" sx={error && plz == null ? {width: '20%'} : {width: '0%'}}>
                                        <p style={{color: 'red', width: 'fit-content'}}>{(error && plz === null) ? 'Feld darf nicht leer sein' : ''}</p>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row" className="cell-wrapper">
                                        <TableCell className="cell-title">Stadt</TableCell>
                                    </TableCell>
                                    <TableCell className="cell-item">
                                        <TextField size="small" className="cell-tfield" value={city} onChange={(e) => setCity(e.target.value)} />
                                    </TableCell>
                                    <TableCell className="cell-item" sx={error && city == null ? {width: '20%'} : {width: '0%'}}>
                                        <p style={{color: 'red', width: 'fit-content'}}>{(error && city === null) ? 'Feld darf nicht leer sein' : ''}</p>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row" className="cell-wrapper">
                                        <TableCell className="cell-title">Adresse</TableCell>
                                    </TableCell>
                                    <TableCell className="cell-item">
                                        <TextField size="small" className="cell-tfield" value={address} onChange={(e) => setAddress(e.target.value)} />
                                    </TableCell>
                                    <TableCell className="cell-item" sx={error && address == null ? {width: '20%'} : {width: '0%'}}>
                                        <p style={{color: 'red', width: 'fit-content'}}>{(error && address === null) ? 'Feld darf nicht leer sein' : ''}</p>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row" className="cell-wrapper">
                                        <TableCell className="cell-title">Nr.</TableCell>
                                    </TableCell>
                                    <TableCell className="cell-item">
                                        <TextField type="number" size="small" className="cell-tfield" value={nr} onChange={(e) => setNr(e.target.value)} />
                                    </TableCell>
                                    <TableCell className="cell-item" sx={error && nr == null ? {width: '20%'} : {width: '0%'}}>
                                        <p style={{color: 'red', width: 'fit-content'}}>{(error && nr === null) ? 'Feld darf nicht leer sein' : ''}</p>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row" className="cell-wrapper">
                                        <TableCell className="cell-title">UID</TableCell>
                                    </TableCell>
                                    <TableCell className="cell-item">
                                        <TextField type="text" size="small" placeholder="Optional" className="cell-tfield" value={uid} onChange={(e) => setUid(e.target.value)} />
                                    </TableCell>
                                    <TableCell className="cell-item" sx={{width: '0%'}}></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row" className="cell-wrapper">
                                    </TableCell>
                                    <TableCell className="cell-item">
                                        <Button variant="contained" onClick={handleSubmit}>Speichern</Button>
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