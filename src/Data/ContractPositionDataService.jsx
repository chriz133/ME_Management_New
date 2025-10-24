import http from "../utilities/http-common";

const root = "/contractPositions/"

const getAll = () => http.get(root);
const getByContractId = (id) => http.get(root + id + '/contracts')
const getById = (id) => http.get(root + id);
const post = (item) => http.post(root, item);

const exportedObject = {
    getAll, getById, getByContractId, post
}

export default exportedObject;