import Sidebar from "../FunctionalComponents/Sidebar";
import {Link, useNavigate, useParams} from "react-router-dom";
import {
    Alert,
    Autocomplete,
    Button,
    Checkbox,
    FormControlLabel,
    Radio,
    RadioGroup,
    Snackbar,
    TextField
} from "@mui/material";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import * as React from "react";
import {useEffect, useState} from "react";
import axios from "axios";
import '../Styles/ContractAddEditScreen.css'
import invoiceDataService from "../Data/InvoiceDataService";
import positionDataService from "../Data/PositionDataService";
import invoicePositionDataService from "../Data/InvoicePositionDataService";
import customerDataService from "../Data/CustomerDataService";
import contractPositionDataService from "../Data/ContractPositionDataService";
import contractDataService from "../Data/ContractDataService";

export default function ContractAddEditScreen(){

//region Parameter
const [customer, setCustomer] = useState()
const [customers, setCustomers] = useState([]);
const [contracts, setContracts] = useState([]);
const [contract, setContract] = useState();
const[invoice, setInvoice] = useState();
const [items, setItems] = useState([]);
const [error, setError] = useState(false);
const [success, setSuccess] = useState(false);
const [failed, setFailed] = useState(false);
//endregion

//region Rechnungsparameter
const [startedAt, setStartedAt] = useState();
const [finishedAt, setFinishedAt] = useState();
const [depositAmount, setDepositAmount] = useState();
const [depositPaidOn, setDepositPaidOn] = useState();
const [type, setType] = useState('D');
const [deposit, setDeposit] = useState(true);
//endregion


let id = -1;

const navigate = useNavigate();

const {contractId, invoiceId} = useParams();

const [deleteList, setDeleteList] = useState([]);

// var index = 0;

// Reihe der Positionen löschen
const deleteItem = (idx) => {
    setItems((prevItems) => {
        const newItems = [];
        for (let i = 0; i < prevItems.length; i++) {
            if (i !== idx) {
                newItems.push(prevItems[i]);
                continue;
            }

            if (prevItems[i].positionId !== null){
                setDeleteList((pre) => [...pre, prevItems[i]]);
            }
        }
        return newItems;
    })

}

const item = () => {
    return {
        positionId: null,
        contractPositionId: null,
        text: null,
        amount: null,
        unit: null,
        price: null
    }
}

// Bei Speicherung
const handleSubmit = async () => {
    let saveFailed = false;

    if (!(customer || (contract && !invoiceId) || (!contract && invoiceId))) {
        saveFailed = true;
        return;
    }

    if (startedAt === null || finishedAt === null || depositAmount === null || depositPaidOn === null){
        setError(true);
        setFailed(true);
        return;
    }

    let invoice_field = {
            invoiceId: invoiceId,
            customer: customer,
            startedAt: startedAt,
            finishedAt: finishedAt,
            depositAmount: depositAmount,
            depositPaidOn: depositPaidOn,
            type: type
    }

    await invoiceDataService.post(invoice_field).then(res => {
        invoice_field = res.data;
    }).catch(res => {
        saveFailed = true;
    })

    for (let i = 0; i < items.length; i++) {
        let position = {
            positionId: null,
            text: items[i].text,
            price: items[i].price,
            unit: items[i].unit
        }
        if (invoiceId)
            position.positionId = items[i].positionId;

        await positionDataService.post(position).then(res => {
            position = res.data;
        }).catch(res => {
            saveFailed = true;
        })

        let invoicePosition = {
            invoicePositionId: items[i].invoicePositionId,
            amount: items[i].amount,
            position: position,
            invoice: invoice_field
        }

        await invoicePositionDataService.post(invoicePosition).catch(res => {saveFailed = true;});
    }


    for (let i = 0; i < deleteList.length; i++) {
        await positionDataService.deleteById(deleteList[i].positionId).catch(res => {saveFailed = true;});
    }

    if (saveFailed){
        setFailed(true);
        setError(true);
        return;
    }

    // navigate('/invoices/' + customer.customerId);
    setSuccess(true);
}

// Informationen laden abhängig von Übergabeparameter
useEffect(async () => {
    // Bei edit mit RechnungsId
    if (invoiceId){
        await invoicePositionDataService.getByInvoiceId(invoiceId).then(res => {
            setType(res.data[0].invoice.type);
            setCustomer(res.data[0].invoice.customer);
            setInvoice(res.data[0].invoice);
            setStartedAt(res.data[0].invoice.startedAt);
            setFinishedAt(res.data[0].invoice.finishedAt);
            setDepositAmount(res.data[0].invoice.depositAmount);
            setDepositPaidOn(res.data[0].invoice.depositPaidOn);
            if (res.data[0].invoice.depositAmount <= 0){
                setDeposit(false);
                console.log(depositAmount);
            }
            for (let i = 0; i < res.data.length; i++){
                const it = item();
                it.positionId = res.data[i].position.positionId;
                it.invoicePositionId = res.data[i].invoicePositionId;
                it.text = res.data[i].position.text;
                it.amount = res.data[i].amount;
                it.unit = res.data[i].position.unit;
                it.price = res.data[i].position.price;
                setItems((prevState) => [...prevState, it]);
            }
        })
        return;
    }

    // Ohne Vorlage
    if (!contractId) {
        setItems([item()]);

        customerDataService.getAll().then(res => {
            setCustomers(res.data);
        })

        contractDataService.getAll().then(res => {
            setContracts(res.data);
        })

        return
    }

    // Bei übergabe von einer AuftragsId
    if (contractId){
        contractPositionDataService.getByContractId(contractId).then(res => {
            for (let i = 0; i < res.data.length; i++) {
                const it = item();
                it.contractPositionId = res.data[i].contractPositionId;
                it.text = res.data[i].position.text;
                it.amount = res.data[i].amount;
                it.unit = res.data[i].position.unit;
                it.price = res.data[i].position.price;
                setItems((prevState) => [...prevState, it]);
            }
        })
    }

    contractDataService.getById(contractId).then(res => {
        setCustomer(res.data.customer);
        setContract(res.data);
    })
},[])

// Positionen laden bei auswöhlen eines Auftrages
useEffect(() => {
    if (invoiceId || !contract || contractId) {
        return
    }
    setItems([]);

    fetchData();
    async function fetchData() {
        if (contract == -1){
            setItems((prev) => [...prev, item()]);
            return;
        }

        let cps;
        await contractPositionDataService.getByContractId(contract.contractId).then(res => {
            for (let i = 0; i < res.data.length; i++) {
                const it = item();
                it.positionId = res.data[i].position.positionId;
                it.contractPositionId = res.data[i].contractPositionId;
                it.text = res.data[i].position.text;
                it.amount = res.data[i].amount;
                it.unit = res.data[i].position.unit;
                it.price = res.data[i].position.price;
                setItems((prevState) => [...prevState, it]);
            }
        })
    }
}, [contract])

// Nur Aufträge vom ausgwewählten Kuden laden
useEffect(() => {
    if (!customer)
        return

    contractDataService.getByCustomerId(customer.customerId).then(res => {
        setContracts(res.data);
    })
}, [customer])


const handleCloseSuccess = () => {
    setSuccess(false);
    navigate('/invoices/' + customer.customerId);
}

const handleCloseFailed = () => {
    setFailed(false);
}

const getContracts = () => {
    let obj = [{label: 'Ohne Auftrag fortfahren', id: 0}];

    contracts.map((data, index) => {
        obj.push({label: '(' + data.contractId + ') ' + data.createdAt, id: index+1});
    })

    console.log(obj);
    return obj;

}

const handleType = (e) => {
    console.log(e);
    setType(e);
    if (e === 'B'){
        setDeposit(false);
        setDepositAmount(0);
        setDepositPaidOn('1111-11-11')
    }
    else setDeposit(true);
}

return (
    <>
        <Sidebar data="invoice"/>
        <Snackbar open={success} autoHideDuration={6000} onClose={handleCloseSuccess}>
            <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
                Rechnung erfolgreich angelegt!
            </Alert>
        </Snackbar>
        <Snackbar open={failed} autoHideDuration={6000} onClose={handleCloseFailed}>
            <Alert onClose={handleCloseFailed} severity="error" sx={{ width: '100%' }}>
                Fehler beim anlegen der Rechnung!
            </Alert>
        </Snackbar>
        <Snackbar open={success} autoHideDuration={6000} onClose={handleCloseSuccess}>
            <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
                Rechnung erfolgreich angelegt!
            </Alert>
        </Snackbar>
        <Snackbar open={failed} autoHideDuration={6000} onClose={handleCloseFailed}>
            <Alert onClose={handleCloseFailed} severity="error" sx={{ width: '100%' }}>
                Fehler beim anlegen der Rechnung!
            </Alert>
        </Snackbar>
        <div className="customer-main">
            {/*Header*/}
            <div className="customer-title">
                <h2>Bereich: Rechnungen</h2>
            </div>
            <div className="customer-btn-panel">
                <Link to="/invoices" className="customer-link">
                    <Button className="customer-btn" variant="contained">Zeige Alle Rechnungen</Button>
                </Link>
            </div>

            <div className="list-main">
                {/*Customer Selector*/}
                {customer ?
                    <div className="list-main">
                        <h2>Kunde</h2>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead sx={{backgroundColor: '#454545' }}>
                                    <TableRow>
                                        <TableCell sx={{color: '#ffffff'}}>ID</TableCell>
                                        <TableCell sx={{color: '#ffffff'}}>Vorname</TableCell>
                                        <TableCell sx={{color: '#ffffff'}}>Nachname</TableCell>
                                        {(!contractId && !invoiceId) && <TableCell align={"center"} sx={{color: '#ffffff'}}>Funktionen</TableCell>}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow
                                        key={customer.customerId}
                                    >
                                        <TableCell component="th" scope="row">
                                            {customer.customerId}
                                        </TableCell>
                                        <TableCell >{customer.firstname}</TableCell>
                                        <TableCell >{customer.surname}</TableCell>
                                        {(!contractId && !invoiceId) && <TableCell align={"center"} sx={{ width: 150 }}>
                                            <Button variant={"contained"} onClick={() => {setCustomer(null); setContract(null)}}>Ändern</Button>
                                        </TableCell>}
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div> :
                    <div className="list-main">
                        <h2>Kunde auswählen</h2>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableBody>
                                    <TableRow>
                                        <TableCell sx={{ width: 1200 }} component="th" scope="row">
                                            <Autocomplete
                                                disablePortal
                                                id="combo-box-demo"
                                                options={customers.map((data, index) => {
                                                    return {label: '(' + data.customerId + ') ' + data.firstname + ' ' + data.surname, id: index}
                                                })}
                                                renderInput={(params) => <TextField {...params} label="Kunde" />}
                                                onChange={(event, obj) => id = obj.id}
                                            />
                                        </TableCell>
                                        <TableCell align={"center"}>
                                            <Button fullWidth={true} variant={"contained"} onClick={() => {setCustomer(customers[id])}}>Fertig</Button>
                                        </TableCell>
                                        {error && <p style={{color: 'red'}}>Kunden auswählen!</p>}
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                }
                {/*Contract Selector*/}
                {!contract && customer && !invoiceId ?
                    <div className="list-main">
                        <h2>Auftrag auswählen</h2>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableBody>
                                    <TableRow>
                                        <TableCell sx={{ width: 1200 }} component="th" scope="row">
                                            <Autocomplete
                                                disablePortal
                                                id="combo-box-demo"
                                                options={getContracts()}
                                                    // contracts.map((data, index) => {
                                                    //     return {label: '(' + data.contractId + ') ' + data.createdAt, id: index}
                                                    // })}
                                                renderInput={(params) => <TextField {...params} label="Auftrag" />}
                                                onChange={(event, obj) => id = obj.id}
                                            />
                                        </TableCell>
                                        <TableCell align={"center"}>
                                            <Button fullWidth={true} variant={"contained"} onClick={() => {id === 0 ? setContract(-1) : setContract(contracts[id-1])}}>Fertig</Button>
                                        </TableCell>
                                        {/*{error && <p style={{color: 'red'}}>Kunden auswählen!</p>}*/}
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>:
                    (contract && customer &&
                    <div className="list-main">
                            <h2>Auftrag</h2>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead sx={{backgroundColor: '#454545' }}>
                                        <TableRow>
                                            <TableCell sx={{color: '#ffffff'}}>ID</TableCell>
                                            <TableCell sx={{color: '#ffffff'}}>Erstellt am</TableCell>
                                            <TableCell sx={{color: '#ffffff'}}>Anzahl Positionen</TableCell>
                                            {!contractId && <TableCell align={"center"} sx={{color: '#ffffff'}}>Funktionen</TableCell>}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow
                                            key={Math.random()}
                                        >

                                            <TableCell component="th" scope="row">
                                                {contract !== -1 ? contract.contractId : 'Keinen Auftrag ausgewählt'}
                                            </TableCell>
                                            <TableCell >
                                                {contract !== -1 ? contract.createdAt : ''}
                                            </TableCell>
                                            <TableCell >
                                                {contract !== -1 ? contract.countPositions : ''}
                                            </TableCell>

                                            {!contractId && <TableCell align={"center"} sx={{ width: 150 }}>
                                                <Button variant={"contained"} onClick={() => setContract(null)}>Ändern</Button>
                                            </TableCell>}
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                )}
                {customer && (contract || invoice) &&
                    <div>
                        {/*Liste für Parameter der Rechnung*/}
                        <div className="list-main">
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
                                        {/*        <TextField disabled="true" size="small" className="cell-tfield" value={invoiceId}/>*/}
                                        {/*    </TableCell>*/}
                                        {/*</TableRow>*/}
                                        <TableRow>
                                            <TableCell component="th" scope="row" className="cell-wrapper">
                                                <TableCell className="cell-title">Art</TableCell>
                                            </TableCell>
                                            <TableCell>
                                                <RadioGroup
                                                    row
                                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                                    name="row-radio-buttons-group"
                                                    onChange={(e) => {handleType(e.target.value);}}
                                                >
                                                    <FormControlLabel value="D" checked={type === 'D'} control={<Radio />} label="Dienstleistung" />
                                                    <FormControlLabel value="B" checked={type === 'B'} control={<Radio />} label="Bauleistung" />
                                                </RadioGroup>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row" className="cell-wrapper">
                                                <TableCell className="cell-title">Startdatum</TableCell>
                                            </TableCell>
                                            <TableCell className="cell-item">
                                                <TextField type="date" size="small" className="cell-tfield" value={startedAt} onChange={(e) => setStartedAt(e.target.value)}/>
                                            </TableCell>
                                            <TableCell className="cell-item" sx={error && startedAt == null ? {width: '10%'} : {width: '0%'}}>
                                                <p style={{color: 'red', width: 'fit-content'}}>{(error && startedAt == null) ? 'Feld darf nicht leer sein' : ''}</p>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row" className="cell-wrapper">
                                                <TableCell className="cell-title">Fertigstellungsdatum</TableCell>
                                            </TableCell>
                                            <TableCell className="cell-item">
                                                <TextField type="date" size="small" className="cell-tfield" value={finishedAt} onChange={(e) => setFinishedAt(e.target.value)} />
                                            </TableCell>
                                            <TableCell className="cell-item" sx={error && finishedAt == null ? {width: '10%'} : {width: '0%'}}>
                                                <p style={{color: 'red', width: 'fit-content'}}>{(error && finishedAt == null) ? 'Feld darf nicht leer sein' : ''}</p>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row" className="cell-wrapper">
                                                <TableCell className="cell-title">Anzahlung</TableCell>
                                            </TableCell>
                                            <TableCell className="cell-item">
                                                <Checkbox checked={deposit} onChange={(e) => {setDeposit(e.target.checked); if (!e.target.checked) {setDepositAmount(0); setDepositPaidOn('1111-11-11')}}}/>
                                            </TableCell>
                                        </TableRow>
                                        {deposit &&
                                            <>
                                        <TableRow>
                                            <TableCell component="th" scope="row" className="cell-wrapper">
                                                <TableCell className="cell-title">Anzahlungssumme</TableCell>
                                            </TableCell>
                                            <TableCell className="cell-item">
                                                <TextField type="number" size="small" className="cell-tfield" value={depositAmount} onChange={(e) => setDepositAmount(parseFloat(e.target.value))} />
                                            </TableCell>
                                            <TableCell className="cell-item" sx={error && depositAmount == null ? {width: '10%'} : {width: '0%'}}>
                                                <p style={{color: 'red', width: 'fit-content'}}>{(error && depositAmount == null) ? 'Feld darf nicht leer sein' : ''}</p>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row" className="cell-wrapper">
                                                <TableCell className="cell-title">Anzahlungsdatum</TableCell>
                                            </TableCell>
                                            <TableCell className="cell-item">
                                                <TextField type="date" size="small" className="cell-tfield" value={depositPaidOn} onChange={(e) => setDepositPaidOn(e.target.value)} />
                                            </TableCell>
                                            <TableCell className="cell-item" sx={error && depositPaidOn == null ? {width: '10%'} : {width: '0%'}}>
                                                <p style={{color: 'red', width: 'fit-content'}}>{(error && depositPaidOn == null) ? 'Feld darf nicht leer sein' : ''}</p>
                                            </TableCell>
                                        </TableRow>
                                            </>}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                        {/*Liste der Positionen*/}
                        <div className="list-main">
                        <h2>Positionen</h2>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead sx={{backgroundColor: '#454545' }}>
                                    <TableRow>
                                        <TableCell sx={{color: '#ffffff'}}>Bezeichnung</TableCell>
                                        <TableCell align={"center"} sx={{color: '#ffffff'}}>Anzahl</TableCell>
                                        <TableCell align={"center"} sx={{color: '#ffffff'}}>Einheit</TableCell>
                                        <TableCell align={"center"} sx={{color: '#ffffff'}}>Einzelpreis</TableCell>
                                        <TableCell align={"center"} sx={{color: '#ffffff'}}>Gesamtpreis</TableCell>
                                        <TableCell align={"center"} sx={{color: '#ffffff'}}>Funktionen</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {items.map((data, idx) => {
                                        return <TableRow
                                            key={Math.random()}
                                        >
                                            <TableCell component="th" scope="row">
                                                <TextField size="small" className="cell-tfield" placeholder="Beispielleistung 1" defaultValue={data.text} onChange={(e) => {data.text = e.target.value}} />
                                            </TableCell>
                                            <TableCell align={"center"} className="cell-small">
                                                <TextField type="number" size="small" className="cell-tfield" placeholder="1" defaultValue={data.amount} onChange={(e) => {data.amount = e.target.value}} />
                                            </TableCell>

                                            <TableCell component="th" scope="row">
                                                <Autocomplete
                                                    disablePortal
                                                    // id="combo-box-demo"
                                                    id="flat-demo"
                                                    freeSolo
                                                    size="small"
                                                    options={[{label:'Pauschal', id: 0}, {label: 'm³', id: 1}, {label:'Tage', id: 2}, {label:'Stück', id: 3}, {label:'Tonnen', id: 4}, {label:'lfm', id: 5}, {label:'Stunden', id: 6}]}
                                                    defaultValue={data.unit}
                                                    renderInput={(params) => <TextField {...params} label="Einheit" />}
                                                    onKeyUp={e => {data.unit = e.target.value}}
                                                    onChange={(event, obj) => data.unit = obj.label}
                                                />
                                            </TableCell>

                                            {/*<TableCell align={"center"} className="cell-medium">*/}
                                            {/*    <TextField size="small" className="cell-tfield" placeholder="Stunden" defaultValue={data.unit} onChange={(e) => {data.unit = e.target.value}} />*/}
                                            {/*</TableCell>*/}
                                            <TableCell align={"center"} className="cell-sm-md">
                                                <TextField type="number" size="small" className="cell-tfield" placeholder="0" defaultValue={data.price} onChange={(e) => {data.price = e.target.value}} />
                                            </TableCell>
                                            <TableCell align={"center"} className="cell-sm-md">
                                                <TextField  inputProps={{ readOnly: true}} size="small" className="cell-tfield" placeholder="0" value={data.amount * data.price} />
                                            </TableCell>
                                            <TableCell align={"center"} sx={{width: 80}}>
                                                <Button variant={"contained"} color={"error"} onClick={() => deleteItem(idx)}>Löschen</Button>
                                            </TableCell>
                                        </TableRow>
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Button variant={"contained"} className="btn-add" onClick={() => {setItems([...items, item()])}}>Neue Position einfügen</Button>
                        <Button variant={"contained"} color={"warning"} className="btn-add" onClick={() => handleSubmit()}>Speichern</Button>
                    </div>
                </div>}
            </div>
        </div>
    </>
)
}