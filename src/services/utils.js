const response = (status, message, dataName, data, pageNumber=null, maxPageSize=null, pageSize=null) => {
    if (!pageNumber) {
        return {
            status: status,
            message: message,
            [dataName]: data,
        };
    }
    return {
        status: status,
        message: message,
        page: pageNumber,
        maxSize: maxPageSize,
        pageSize: pageSize,
        [dataName]: data,
    };
}

export default response;
