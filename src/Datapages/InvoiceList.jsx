import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import "../Styles/List.css"
import {Button, Snackbar, Alert} from "@mui/material";
import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import '../Data/InvoiceDataService'
import invoiceDataService from "../Data/InvoiceDataService";
import DeleteConfirmDialog from "../FunctionalComponents/DeleteConfirmDialog";

export default function InvoiceList({customerId}) {
    const [data, setData] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [deleteFailed, setDeleteFailed] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        if (!customerId) {
            invoiceDataService.getAll().then(res => {
                setData(res.data);
            })
        }
        else {
            invoiceDataService.getByCustomerId(customerId).then(res => {
                console.log(res.data);
                setData(res.data);
            })
        }
    }

    const handleDeleteClick = (id) => {
        setDeleteItemId(id);
        setDeleteDialogOpen(true);
    }

    const handleDeleteConfirm = () => {
        invoiceDataService.deleteById(deleteItemId).then(res => {
            setDeleteSuccess(true);
            setDeleteDialogOpen(false);
            loadData();
        }).catch(err => {
            setDeleteFailed(true);
            setDeleteDialogOpen(false);
        });
    }

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setDeleteItemId(null);
    }


    return (
        <div className="list-main">
            <h2>Rechnungen</h2>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650}} aria-label="simple table">
                    <TableHead sx={{backgroundColor: '#454545' }}>
                        <TableRow>
                            <TableCell sx={{color: '#ffffff'}}>ID</TableCell>
                            <TableCell sx={{color: '#ffffff'}}>Kunde</TableCell>
                            <TableCell sx={{color: '#ffffff'}}>Erstellt Am</TableCell>
                            <TableCell align={"center"} sx={{color: '#ffffff'}}>Anzahl an Positionen</TableCell>
                            {/*<TableCell align={"center"} sx={{color: '#ffffff'}}>Gesamtsumme</TableCell>*/}
                            <TableCell align={"center"} sx={{color: '#ffffff'}}>Funktionen</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((data) => (
                            <TableRow
                                key={data.invoiceId}
                                sx={{ '&:last-child td, &:last-child th': { border: 0, width: 0 },
                                    '&:nth-of-type(odd)' : {backgroundColor: '#d9d9d9'},
                                    height: 1}}
                            >
                                <TableCell component="th" scope="row">
                                    {data.invoiceId}
                                </TableCell>
                                <TableCell >{data.customer.firstname + ' ' + data.customer.surname}</TableCell>
                                <TableCell >{data.createdAt}</TableCell>
                                <TableCell align={"center"}>{data.countPositions}</TableCell>
                                {/*<TableCell align={"center"}>{data.sumPrice.toFixed(2).replace('.', ',')} €</TableCell>*/}
                                <TableCell className="cell-btn">
                                    <Button variant="contained" color="info" onClick={() => navigate("/test2/" + data.invoiceId)}>Zeige Rechnung</Button>
                                    <Button variant="contained" color="warning" className="btn-edit" onClick={() => navigate("/invoices/edit/" + data.invoiceId)}>Bearbeiten</Button>
                                    <Button variant="contained" color="error" className="btn-edit" onClick={() => handleDeleteClick(data.invoiceId)}>Löschen</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Rechnung löschen"
                message="Möchten Sie diese Rechnung wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden."
            />

            <Snackbar open={deleteSuccess} autoHideDuration={3000} onClose={() => setDeleteSuccess(false)}>
                <Alert onClose={() => setDeleteSuccess(false)} severity="success" sx={{ width: '100%' }}>
                    Rechnung erfolgreich gelöscht!
                </Alert>
            </Snackbar>

            <Snackbar open={deleteFailed} autoHideDuration={3000} onClose={() => setDeleteFailed(false)}>
                <Alert onClose={() => setDeleteFailed(false)} severity="error" sx={{ width: '100%' }}>
                    Fehler beim Löschen der Rechnung!
                </Alert>
            </Snackbar>
        </div>
    );
}