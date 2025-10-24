import "../Styles/InfoScreen.css"
import Sidebar from "../FunctionalComponents/Sidebar";

function InfoScreen() {

    return(
        <div>
            <Sidebar />
            <div className="main">
                <div className="info-wrapper">
                    <h1 className="info-h1">MELCHIOR-ERDBAU</h1>
                    <h2 className="info-h2">MANAGEMENT-SYSTEM</h2>
                    <h2 className="info-h1">V 0.1</h2>
                </div>
            </div>
        </div>
    );
}

export default InfoScreen;