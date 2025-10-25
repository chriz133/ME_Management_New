import http from "../utilities/http-common";

const root = "/customers/"

const getAll = () => http.get(root);
// const getByCustomerId = (customerId) => http.get(root + customerId + '/customer')
const getById = (id) => http.get(root + id);
const post = (item) => http.post(root, item);

const exportedObject = {
    getAll, getById, post
}

export default exportedObject;