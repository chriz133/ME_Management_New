import "../Styles/ContractScreen.css"
import Sidebar from "../FunctionalComponents/Sidebar";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {Button, TextField} from "@mui/material";
import TableContainer from "@mui/material/TableContainer";
import * as React from "react";
import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate, useParams, Link} from "react-router-dom";
import ContractList from "../Datapages/ContractList";
import customerDataService from "../Data/CustomerDataService";


function ContractScreen() {

    const [customer, setCustomer] = useState();

    const navigate = useNavigate();

    const {customerId} = useParams();


    useEffect(() => {
        if (!customerId)
            return;

        customerDataService.getById(customerId).then(res => {
            setCustomer(res.data);
        })
        // axios.get('http://192.168.0.236:8080/customers/' + customerId).then((res) => {
        //     console.log(res.data);
        //     setCustomer(res.data);
        // })
    }, [])

    return (
        <>
            <Sidebar data="contract"/>
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
                    {/*<Link to="/positions" className="customer-link">*/}
                    {/*    <Button className="customer-btn" variant="contained">Zeige Alle Positionen</Button>*/}
                    {/*</Link>*/}
                    {/*<Link to="/positions/add" className="customer-link">*/}
                    {/*    <Button className="customer-btn" variant="contained">Neue Position anlegen</Button>*/}
                    {/*</Link>*/}
                </div>
                <div className="list-main">
                    {customer &&
                        <div className="list-main">
                            <h2>Kunde</h2>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead sx={{backgroundColor: '#454545' }}>
                                        <TableRow>
                                            <TableCell sx={{color: '#ffffff'}}>ID</TableCell>
                                            <TableCell sx={{color: '#ffffff'}}>Vorname</TableCell>
                                            <TableCell sx={{color: '#ffffff'}}>Nachname</TableCell>
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
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>}
                    <ContractList customerId={customerId ? customerId : null}/>
                </div>
            </div>
        </>
    )
}

export default ContractScreen;