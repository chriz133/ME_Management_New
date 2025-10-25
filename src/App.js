import './Styles/App.css';
import {useState, useEffect} from "react";
import InfoScreen from "./Screens/InfoScreen";
import CustomersScreen from "./Screens/CustomersScreen";
import {HashRouter as Router, Routes, Route, } from "react-router-dom";
import CustomerAddEditScreen from "./Screens/CustomerAddEditScreen";
import ContractScreen from "./Screens/ContractScreen";
import ContractPage from "./Datapages/ContractPage";
import PositionScreen from "./Screens/PositionScreen";
import PositionAddEditScreen from "./Screens/PositionAddEditScreen";
import ContractAddEditScreen from "./Screens/ContractAddEditScreen";
import InvoiceScreen from "./Screens/InvoiceScreen";
import InvoicePage from "./Datapages/InvoicePage";
import InvoiceAddEditScreen from "./Screens/InvoiceAddEditScreen";
import FinanceScreen from "./Screens/FinanceScreen";
import TransactionAddEditScreen from "./Screens/TransactionAddEditScreen";


function App() {

  return (
    <div>
        <Router>
            <Routes>
                <Route exact path="/" element={<InfoScreen />} />
                <Route exact path="/customers" element={<CustomersScreen />} />
                <Route exact path="/customers/add" element={<CustomerAddEditScreen />} />
                <Route exact path="/customers/edit/:userId" element={<CustomerAddEditScreen />} />
                <Route exact path="/contracts" element={<ContractScreen />} />
                <Route exact path="/contracts/:customerId" element={<ContractScreen />} />
                <Route exact path="/contracts/add" element={<ContractAddEditScreen />} />
                <Route exact path="/contracts/edit/:contractId" element={<ContractAddEditScreen />} />
                <Route exact path="/positions" element={<PositionScreen />} />
                <Route exact path="/positions/add" element={<PositionAddEditScreen />} />
                <Route exact path="/positions/edit/:id" element={<PositionAddEditScreen />} />
                <Route exact path="/invoices" element={<InvoiceScreen />} />
                <Route exact path="/invoices/:customerId" element={<InvoiceScreen />} />
                <Route exact path="/invoices/add" element={<InvoiceAddEditScreen />} />
                <Route exact path="/invoices/add/:contractId" element={<InvoiceAddEditScreen />} />
                <Route exact path="/invoices/edit/:invoiceId" element={<InvoiceAddEditScreen />} />
                <Route exact path="/finances" element={<FinanceScreen />} />
                <Route exact path="/finances/:dateParam" element={<FinanceScreen />} />
                <Route exact path="/finances/add" element={<TransactionAddEditScreen />} />
                <Route exact path="/finances/edit/:id" element={<TransactionAddEditScreen />} />
                <Route exact path="/test" element={<ContractPage />} />
                <Route exact path="/test/:contractId" element={<ContractPage />} />
                <Route exact path="/test2/:invoiceId" element={<InvoicePage />} />

            </Routes>
        </Router>
    </div>
  );
}

export default App;
