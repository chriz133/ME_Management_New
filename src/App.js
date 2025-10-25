import './Styles/App.css';
import {useState, useEffect} from "react";
import InfoScreen from "./Screens/InfoScreen";
import CustomersScreen from "./Screens/CustomersScreen";
import {HashRouter as Router, Routes, Route, Navigate} from "react-router-dom";
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
import LoginScreen from "./Screens/LoginScreen";
import authService from "./Data/AuthService";


// Protected Route component
function ProtectedRoute({ children }) {
  return authService.isAuthenticated() ? children : <Navigate to="/login" />;
}

function App() {

  return (
    <div>
        <Router>
            <Routes>
                <Route exact path="/login" element={<LoginScreen />} />
                <Route exact path="/" element={<ProtectedRoute><InfoScreen /></ProtectedRoute>} />
                <Route exact path="/customers" element={<ProtectedRoute><CustomersScreen /></ProtectedRoute>} />
                <Route exact path="/customers/add" element={<ProtectedRoute><CustomerAddEditScreen /></ProtectedRoute>} />
                <Route exact path="/customers/edit/:userId" element={<ProtectedRoute><CustomerAddEditScreen /></ProtectedRoute>} />
                <Route exact path="/contracts" element={<ProtectedRoute><ContractScreen /></ProtectedRoute>} />
                <Route exact path="/contracts/:customerId" element={<ProtectedRoute><ContractScreen /></ProtectedRoute>} />
                <Route exact path="/contracts/add" element={<ProtectedRoute><ContractAddEditScreen /></ProtectedRoute>} />
                <Route exact path="/contracts/edit/:contractId" element={<ProtectedRoute><ContractAddEditScreen /></ProtectedRoute>} />
                <Route exact path="/positions" element={<ProtectedRoute><PositionScreen /></ProtectedRoute>} />
                <Route exact path="/positions/add" element={<ProtectedRoute><PositionAddEditScreen /></ProtectedRoute>} />
                <Route exact path="/positions/edit/:id" element={<ProtectedRoute><PositionAddEditScreen /></ProtectedRoute>} />
                <Route exact path="/invoices" element={<ProtectedRoute><InvoiceScreen /></ProtectedRoute>} />
                <Route exact path="/invoices/:customerId" element={<ProtectedRoute><InvoiceScreen /></ProtectedRoute>} />
                <Route exact path="/invoices/add" element={<ProtectedRoute><InvoiceAddEditScreen /></ProtectedRoute>} />
                <Route exact path="/invoices/add/:contractId" element={<ProtectedRoute><InvoiceAddEditScreen /></ProtectedRoute>} />
                <Route exact path="/invoices/edit/:invoiceId" element={<ProtectedRoute><InvoiceAddEditScreen /></ProtectedRoute>} />
                <Route exact path="/finances" element={<ProtectedRoute><FinanceScreen /></ProtectedRoute>} />
                <Route exact path="/finances/:dateParam" element={<ProtectedRoute><FinanceScreen /></ProtectedRoute>} />
                <Route exact path="/finances/add" element={<ProtectedRoute><TransactionAddEditScreen /></ProtectedRoute>} />
                <Route exact path="/finances/edit/:id" element={<ProtectedRoute><TransactionAddEditScreen /></ProtectedRoute>} />
                <Route exact path="/test" element={<ProtectedRoute><ContractPage /></ProtectedRoute>} />
                <Route exact path="/test/:contractId" element={<ProtectedRoute><ContractPage /></ProtectedRoute>} />
                <Route exact path="/test2/:invoiceId" element={<ProtectedRoute><InvoicePage /></ProtectedRoute>} />

            </Routes>
        </Router>
    </div>
  );
}

export default App;
