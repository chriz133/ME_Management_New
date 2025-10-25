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


export default function PositionList() {
    const [data, setData] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://192.168.0.236:8080/positions").then(res => {
            setData(res.data);
            console.log(res.data);
        })
    }, []);


    return (
        <div className="list-main">
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead sx={{backgroundColor: '#454545' }}>
                        <TableRow>
                            <TableCell sx={{color: '#ffffff'}}>ID</TableCell>
                            <TableCell sx={{color: '#ffffff'}}>Text</TableCell>
                            <TableCell sx={{color: '#ffffff'}}>Einzelpreis</TableCell>
                            <TableCell sx={{color: '#ffffff'}}>Einheit</TableCell>
                            <TableCell sx={{color: '#ffffff'}} className="cell-btn">Funktionen</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((data) => (
                            <TableRow
                                key={data.positionId}
                                sx={{ '&:last-child td, &:last-child th': { border: 0, width: 0 },
                                    '&:nth-of-type(odd)' : {backgroundColor: '#d9d9d9'},
                                    height: 1}}
                            >
                                <TableCell component="th" scope="row">
                                    {data.positionId}
                                </TableCell>
                                <TableCell >{data.text}</TableCell>
                                <TableCell >{data.price}</TableCell>
                                <TableCell >{data.unit}</TableCell>
                                <TableCell className="cell-btn">
                                    {/*<Button sx={{marginRight: 1}} variant="contained" >Zeige Aufträge</Button>*/}
                                    <Button variant="contained" color="warning" onClick={() => navigate("/positions/edit/" + data.positionId)}>Bearbeiten</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}