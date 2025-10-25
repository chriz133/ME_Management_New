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
import positionDataService from "../Data/PositionDataService";
import DeleteConfirmDialog from "../FunctionalComponents/DeleteConfirmDialog";


export default function PositionList() {
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
        positionDataService.getAll().then(res => {
            setData(res.data);
        })
    }

    const handleDeleteClick = (id) => {
        setDeleteItemId(id);
        setDeleteDialogOpen(true);
    }

    const handleDeleteConfirm = () => {
        positionDataService.deleteById(deleteItemId).then(res => {
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
                                    <Button variant="contained" color="error" className="btn-edit" onClick={() => handleDeleteClick(data.positionId)}>Löschen</Button>
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
                title="Position löschen"
                message="Möchten Sie diese Position wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden."
            />

            <Snackbar open={deleteSuccess} autoHideDuration={3000} onClose={() => setDeleteSuccess(false)}>
                <Alert onClose={() => setDeleteSuccess(false)} severity="success" sx={{ width: '100%' }}>
                    Position erfolgreich gelöscht!
                </Alert>
            </Snackbar>

            <Snackbar open={deleteFailed} autoHideDuration={3000} onClose={() => setDeleteFailed(false)}>
                <Alert onClose={() => setDeleteFailed(false)} severity="error" sx={{ width: '100%' }}>
                    Fehler beim Löschen der Position!
                </Alert>
            </Snackbar>
        </div>
    );
}