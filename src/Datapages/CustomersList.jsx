import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import "../Styles/List.css"
import {Button} from "@mui/material";
import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import customerDataService from "../Data/CustomerDataService";


export default function CustomerList() {
    const [data, setData] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        customerDataService.getAll().then(res => {
            setData(res.data);
        })
    }, []);


    return (
        <div className="list-main">
            <h2>Kunden</h2>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead sx={{backgroundColor: '#454545' }}>
                        <TableRow>
                            <TableCell sx={{color: '#ffffff', width: '3%'}}>ID</TableCell>
                            <TableCell sx={{color: '#ffffff'}}>Vorname</TableCell>
                            <TableCell sx={{color: '#ffffff'}}>Nachname</TableCell>
                            <TableCell sx={{color: '#ffffff'}}>PLZ</TableCell>
                            <TableCell sx={{color: '#ffffff', width: '10%'}}>Stadt</TableCell>
                            <TableCell sx={{color: '#ffffff', width: '13%'}}>Adresse</TableCell>
                            <TableCell sx={{color: '#ffffff', width: '5%'}}>Nr.</TableCell>
                            <TableCell sx={{color: '#ffffff', width: '10%'}} align="center">UID</TableCell>
                            <TableCell sx={{color: '#ffffff'}}>Funktionen</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((data) => (
                            <TableRow
                                key={data.customerId}
                                sx={{ '&:last-child td, &:last-child th': { border: 0, width: 0 },
                                    '&:nth-of-type(odd)' : {backgroundColor: '#d9d9d9'},
                                    height: 1}}
                            >
                                <TableCell component="th" scope="row">
                                    {data.customerId}
                                </TableCell>
                                <TableCell >{data.firstname}</TableCell>
                                <TableCell >{data.surname}</TableCell>
                                <TableCell>{data.plz}</TableCell>
                                <TableCell>{data.city}</TableCell>
                                <TableCell>{data.address}</TableCell>
                                <TableCell>{data.nr}</TableCell>
                                <TableCell align={"center"}>{data.uid !== null ? data.uid: 'X'}</TableCell>
                                <TableCell>
                                    <Button sx={{marginRight: 1}} variant="contained" onClick={() => navigate("/contracts/" + data.customerId)}>Zeige Aufträge</Button>
                                    <Button variant="contained" color="warning" onClick={() => navigate("/customers/edit/" + data.customerId)}>Bearbeiten</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}