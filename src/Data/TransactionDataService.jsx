import http from "../utilities/http-common";

const root = "/transactions/"

const getAll = () => http.get(root);
const getByType = (type) => http.get(root + 'type/' + type)
const getByMonthYear = (month, year) => http.get(root + month + "/" + year);
const getById = (id) => http.get(root + id);
const post = (item) => http.post(root, item);

const exportedObject = {
    getAll, getById, getByType, getByMonthYear, post
}

export default exportedObject;