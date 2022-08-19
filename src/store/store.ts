let ListData: Object;
let TableData: Object;

function setListData(res : Object) {
    ListData = res
}

function getListData() : any {
    return ListData
}

function setTableData(res : Object) {
    TableData = res
}

function getTableData() : any {
    return TableData
}

export default {
    setListData,
    getListData,
    setTableData,
    getTableData
}