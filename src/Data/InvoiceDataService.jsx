import http from "../utilities/http-common";

const root = "/invoices/"

const getAll = () => http.get(root);
const getByCustomerId = (customerId) => http.get(root + customerId + '/customer')
const getById = (invoiceId) => http.get(root + invoiceId);
const post = (item) => http.post(root, item);
const put = (id, item) => http.put(root + id, item);
const deleteById = (id) => http.delete(root + id);

const exportedObject = {
    getAll, getById, getByCustomerId, post, put, deleteById
}

export default exportedObject;