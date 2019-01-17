export default class ResponseHandler {

    static returnSuccess (res, data) {
        return res.status(200).json({
            isSuccess: true,
            data,
        });
    }
}