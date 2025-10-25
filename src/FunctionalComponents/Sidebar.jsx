import logo from "../images/logo_v1.png";
import {Button} from "@mui/material";
import {Link} from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArticleIcon from '@mui/icons-material/Article';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import "../Styles/Sidebar.css"
import {useEffect, useState} from "react";

function Sidebar({data}){

    const MyButton = (link, text, key, icon) => {
        return <Link to={"/" + link} className="info-link">
            <Button className={data === key ? "info-btn clicked" : "info-btn"} variant="contained">
                <div className="label">
                    {icon}
                    <a>{text}</a>
                </div>
            </Button>
        </Link>
    }

    return(
        <div className="sidebar">
            <div className="title">
                <Link to="/">
                    <img className="info-img" src={logo} />
                </Link>
            </div>
            {MyButton('customers', 'Kunden', 'customer', <AccountCircleIcon/>)}
            {MyButton('contracts', 'Aufträge', 'contract', <ArticleIcon/>)}
            {MyButton('invoices', 'Rechnungen', 'invoice', <CreditCardIcon/>)}
            {MyButton('finances', 'Finanzen', 'finance', <AttachMoneyIcon/>)}

            {/*{MyButton('customers', 'Kunden', 'customer')}*/}
            {/*<Link to="/customers" className="info-link">*/}
            {/*    <Button className={data === 'customer' ? "info-btn clicked" : "info-btn"} variant="contained">*/}
            {/*        <div className="label">*/}
            {/*            <AccountCircleIcon />*/}
            {/*            <a>Kunden</a>*/}
            {/*        </div>*/}
            {/*    </Button>*/}
            {/*</Link>*/}
            {/*<Link to="/contracts" className="info-link">*/}
            {/*    <Button className={data === 'contract' ? "info-btn clicked" : "info-btn"} variant="contained">*/}
            {/*        <div className="label">*/}
            {/*            <ArticleIcon />*/}
            {/*            <a>Aufträge</a>*/}
            {/*        </div>*/}
            {/*    </Button>*/}
            {/*</Link>*/}
        </div>
    )
}

export default Sidebar;