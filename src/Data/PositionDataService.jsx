import http from "../utilities/http-common";

const root = "/positions/"

const getAll = () => http.get(root);
// const getByCustomerId = (customerId) => http.get(root + customerId + '/customer')
const getById = (id) => http.get(root + id);
const post = (item) => http.post(root, item);
const deleteById = (id) => http.delete(root + id);

const exportedObject = {
    getAll, getById, post, deleteById
}

export default exportedObject;