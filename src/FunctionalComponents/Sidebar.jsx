import logo from "../images/logo_v1.png";
import {Button, Typography, Box} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArticleIcon from '@mui/icons-material/Article';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LogoutIcon from '@mui/icons-material/Logout';
import "../Styles/Sidebar.css"
import {useEffect, useState} from "react";
import authService from "../Data/AuthService";

function Sidebar({data}){
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
    }, []);

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

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

            <Box className="sidebar-user-info">
                {user && user.displayName && (
                    <Typography variant="body2" className="user-name">
                        {user.displayName}
                    </Typography>
                )}
                {user && user.role && (
                    <Typography variant="caption" className="user-role">
                        {user.role}
                    </Typography>
                )}
                <Button 
                    variant="outlined" 
                    color="error" 
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                    className="logout-btn"
                    fullWidth
                >
                    Abmelden
                </Button>
            </Box>

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