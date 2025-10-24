import Sidebar from "../FunctionalComponents/Sidebar";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Alert, Autocomplete, Button, Snackbar, TextField} from "@mui/material";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import ContractList from "../Datapages/ContractList";
import * as React from "react";
import {useEffect, useState} from "react";
import axios from "axios";
import '../Styles/ContractAddEditScreen.css'
import infoScreen from "./InfoScreen";
import contractDataService from "../Data/ContractDataService";
import positionDataService from "../Data/PositionDataService";
import contractPositionDataService from "../Data/ContractPositionDataService";
import customerDataService from "../Data/CustomerDataService";

export default function ContractAddEditScreen(){
    const [customer, setCustomer] = useState()
    const [customers, setCustomers] = useState([]);
    const [items, setItems] = useState([]);
    const [error, setError] = useState(false);
    const [deleteList, setDeleteList] = useState([]);

    const [success, setSuccess] = useState(false);
    const [failed, setFailed] = useState(false);

    let id = -1;

    const navigate = useNavigate();

    const {contractId} = useParams();

    // var index = 0;

    const deleteItem = (idx) => {
        setItems((prevItems) => {
            const newItems = [];
            for (let i = 0; i < prevItems.length; i++) {
                if (i !== idx) {
                    newItems.push(prevItems[i]);
                    continue
                }

                if (prevItems[i].positionId != null) {
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

    const handleSubmit = async () => {
        if (!customer) {
            setError(true);
            setFailed(true);
            return;
        }

        let contract
        if (!contractId) {
            contract = {
                customer: customer,
                contractAccepted: false
            }
            await contractDataService.post(contract).then(res => {
                contract = {
                    contractId: res.data.contractId,
                    customer: res.data.customer,
                    accepted: res.data.contractAccepted,
                    createdAt: res.data.createdAt,
                }
            }).catch(res => {
                setFailed(true);
            })
        }
        else{
            contractDataService.getById(contractId).then(res => {
                contract = res.data;
            }).catch(res => {
                setFailed(true);
            })
        }



        for (let i = 0; i < items.length; i++) {
            let position = {
                positionId: items[i].positionId,
                text: items[i].text,
                price: items[i].price,
                unit: items[i].unit
            }

            await positionDataService.post(position).then(res => {
                position = res.data;
            }).catch(res => {
                setFailed(true);
            })

            let contractPosition = {
                contractPositionId: items[i].contractPositionId,
                amount: items[i].amount,
                position: position,
                contract: contract
            }

            await contractPositionDataService.post(contractPosition).then(res => {
                console.log(res.data);
            }).catch(res => {
                setFailed(true);
            })
        }

        for (let i = 0; i < deleteList.length; i++) {
            await positionDataService.deleteById(deleteList[i].positionId).catch(res => {
                setFailed(true);
            });
        }

        navigate('/contracts/' + customer.customerId);
    }


    useEffect(() => {
        if (!contractId) {
            setItems([item()]);

            customerDataService.getAll().then(res => {
                setCustomers(res.data);
            })
            // axios.get('http://192.168.0.236:8080/customers').then((res) => {
            //     setCustomers(res.data);
            // })
            return
        }
        if (contractId){
            console.log(contractId)
            contractPositionDataService.getByContractId(contractId).then(res => {
                for (let i = 0; i < res.data.length; i++) {
                    let it = item();
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

        contractDataService.getById(contractId).then(res => {
            setCustomer(res.data.customer);
        })
    },[])

    const handleCloseSuccess = () => {
        setSuccess(false);
        navigate('/finances');
    }

    const handleCloseFailed = () => {
        setFailed(false);
    }


    return (
        <>
            <Sidebar data="contract"/>
            <Snackbar open={success} autoHideDuration={6000} onClose={handleCloseSuccess}>
                <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
                    Auftrag erfolgreich angelegt!
                </Alert>
            </Snackbar>
            <Snackbar open={failed} autoHideDuration={6000} onClose={handleCloseFailed}>
                <Alert onClose={handleCloseFailed} severity="error" sx={{ width: '100%' }}>
                    Fehler beim anlegen des Auftrages!
                </Alert>
            </Snackbar>
            <div className="customer-main">
                <div className="customer-title">
                    <h2>Bereich: Aufträge</h2>
                </div>
                <div className="customer-btn-panel">
                    <Link to="/contracts" className="customer-link">
                        <Button className="customer-btn" variant="contained">Zeige Alle Aufträge</Button>
                    </Link>
                    <Link to="/contracts/add" className="customer-link">
                        <Button className="customer-btn" variant="contained">Neuen Auftrag anlegen</Button>
                    </Link>
                </div>
                <div className="list-main">
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
                                            {!contractId && <TableCell align={"center"} sx={{color: '#ffffff'}}>Funktionen</TableCell>}
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
                                            {!contractId && <TableCell align={"center"} sx={{ width: 150 }}>
                                                <Button variant={"contained"} onClick={() => setCustomer(null)}>Ändern</Button>
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
                                                <Button fullWidth={true} variant={"contained"} onClick={() => {console.log(id); setCustomer(customers[id])}}>Fertig</Button>
                                            </TableCell>
                                            {error && <p style={{color: 'red'}}>Kunden auswählen!</p>}
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    }

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
                                            key={idx}
                                        >
                                            <TableCell component="th" scope="row">
                                                <TextField size="small" className="cell-tfield" placeholder="Beispielleistung 1" defaultValue={data.text} onChange={(e) => {data.text = e.target.value}} />
                                            </TableCell>
                                            <TableCell align={"center"} className="cell-small">
                                                <TextField type="number" size="small" className="cell-tfield" placeholder="1" defaultValue={data.amount} onChange={(e) => {data.amount = e.target.value; setItems(prevState => [...prevState])}} />
                                            </TableCell>
                                            <TableCell align={"center"} className="cell-medium">
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
                                                {/*<TextField size="small" className="cell-tfield" placeholder="Stunden" defaultValue={data.unit} onChange={(e) => {data.unit = e.target.value}} />*/}
                                            </TableCell>
                                            <TableCell align={"center"} className="cell-sm-md">
                                                <TextField type="number" size="small" className="cell-tfield" placeholder="0" defaultValue={data.price} onChange={(e) => {data.price = e.target.value; setItems(prevState => [...prevState])}} />
                                            </TableCell>
                                            <TableCell align={"center"} className="cell-sm-md">
                                                <TextField  inputProps={{ readOnly: true}} size="small" className="cell-tfield" placeholder="0" value={data.price * data.amount} />
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
                </div>
            </div>

        </>
    )
}