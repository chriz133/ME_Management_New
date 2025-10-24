import http from "../utilities/http-common";

const root = "/invoicePositions/"

const getAll = () => http.get(root);
const getByInvoiceId = (invoiceId) => http.get(root + invoiceId + '/invoices')
const getById = (id) => http.get(root + id);
const post = (item) => http.post(root, item);


const exportedObject = {
    getAll, getById, getByInvoiceId, post
}

export default exportedObject;