import "../Styles/CustomersScreen.css"
import {useState} from "react";
import {Button} from "@mui/material";
import {Link} from "react-router-dom";
import CustomerList from "../Datapages/CustomersList";
import Sidebar from "../FunctionalComponents/Sidebar";

function CustomersScreen() {

    return (
        <>
            <Sidebar data="customer"/>
            <div className="customers-main">
                <div className="customers-title">
                    <h2>Bereich: Kunden</h2>
                </div>
                <div className="customers-btn-panel">
                    <Link to="/customers/add" className="customers-link">
                    <Button className="customers-btn" variant="contained" >Neuen Kunden anlegen</Button>
                    </Link>
                </div>

                <div className="customers-field">
                    <CustomerList />
                </div>

            </div>
        </>
    )
}

export default CustomersScreen;