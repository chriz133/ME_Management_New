import "../Styles/AddEditScreen.css"
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


function PositionAddEditScreen() {
    const [positionId, setPositionId] = useState(null);
    const [text, setText] = useState(null);
    const [price, setPrice] = useState(null);
    const [unit, setUnit] = useState(null);

    const [title, setTitle] = useState(null);

    const {id} = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        if (id){
            axios.get("http://192.168.0.236:8080/positions/" + id).then(res => {
                const position = res.data;
                setPositionId(position.positionId);
                setText(position.text);
                setPrice(position.price);
                setUnit(position.unit);
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
        const data = {
            positionId: positionId,
            text: text,
            price: price,
            unit: unit,
        }

        console.log(data);

        axios.post("http://192.168.0.236:8080/positions", data).then(res =>{
            console.log(res);
            navigate("/positions");
        })
    }

    return (
        <>
            <Sidebar data="contract"/>
            <div className="customer-main">
                <div className="customer-title">
                    <h2>Bereich: Position {title}</h2>
                </div>
                <div className="customer-btn-panel">
                    <Link to="/positions" className="customer-link">
                        <Button className="customer-btn" variant="contained">Zeige Alle Positionen</Button>
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
                                        <TableCell className="cell-title">ID</TableCell>
                                    </TableCell>
                                    <TableCell className="cell-item">
                                        <TextField disabled="true" size="small" className="cell-tfield" value={positionId}/>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row" className="cell-wrapper">
                                        <TableCell className="cell-title">Text</TableCell>
                                    </TableCell>
                                    <TableCell className="cell-item">
                                        <TextField size="small" className="cell-tfield" value={text} onChange={(e) => setText(e.target.value)} />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row" className="cell-wrapper">
                                        <TableCell className="cell-title">Einzelpreis</TableCell>
                                    </TableCell>
                                    <TableCell className="cell-item">
                                        <TextField type="number" size="small" className="cell-tfield" value={price} onChange={(e) => setPrice(e.target.value)} />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row" className="cell-wrapper">
                                        <TableCell className="cell-title">Einheit</TableCell>
                                    </TableCell>
                                    <TableCell className="cell-item">
                                        <TextField type="text" size="small" className="cell-tfield" value={unit} onChange={(e) => setUnit(e.target.value)} />
                                    </TableCell>
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

export default PositionAddEditScreen;