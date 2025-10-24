import "../Styles/PositionScreen.css"
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
import PositionList from "../Datapages/PositionList";


function PositionScreen() {

    const navigate = useNavigate();


    return (
        <>
            <Sidebar data="contract"/>
            <div className="customer-main">
                <div className="customer-title">
                    <h2>Bereich: Positionen</h2>
                </div>
                <div className="customer-btn-panel">
                    <Link to="/contracts" className="customer-link">
                        <Button className="customer-btn" variant="contained">Zeige Alle Aufträge</Button>
                    </Link>
                    <Link to="/contracts/add" className="customer-link">
                        <Button className="customer-btn" variant="contained">Neuen Auftrag anlegen</Button>
                    </Link>
                    <Link to="/positions" className="customer-link">
                        <Button className="customer-btn" variant="contained">Zeige Alle Positionen</Button>
                    </Link>
                    <Link to="/positions/add" className="customer-link">
                        <Button className="customer-btn" variant="contained">Neue Position anlegen</Button>
                    </Link>
                </div>
                <div className="list-main">
                    <PositionList />
                </div>
            </div>
        </>
    )
}

export default PositionScreen;