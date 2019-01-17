const formidable = require('formidable');

const UploadFile = (req, res, next) => {
    try {
        const form = new formidable.IncomingForm();

        form.parse(req);

        form.on('fileBegin', function (name, file){
            file.path = __dirname + '/file_uploads/' + file.name;
        });

        form.on('file', function (name, file){
            const _file = file.path;
            return res.status(200).json({
                isSuccess: true,
                _file
            });
        });
    } catch (e) {
        return next(e);
    }
}

export default UploadFile;