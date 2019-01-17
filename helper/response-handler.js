export default class ResponseHandler {

    static returnSuccess (res, _isSuccess) {
        return res.json({
            isSuccess: _isSuccess,
            data: res,
        });
    }
}