export default class ResponseHandler {

    static returnSuccess (res, data) {
        if (res) {
            return res.status(200).json({
                isSuccess: true,
                data,
            }); 
        }
        return data;
    }
}