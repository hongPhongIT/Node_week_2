const formidable = require('formidable');
const path = require('path');
const _path = path.resolve(__dirname, '../uploads');

const UploadFile = async (req, res, next) => {
    try {
        const form = new formidable.IncomingForm();
        let _file  = [];
        form.parse(req);
        form.multiples = true;
        form.maxFieldsSize = 20 * 1024 * 1024;
        form.onPart = function (part) {
            if(!part.filename || part.filename.match(/\.(jpg|jpeg|png|psd)$/i)) {
                this.handlePart(part);
            }
            else {
                return next(new Error(part.filename + ' is not allowed'))
            }
        }
        
        await form.on('fileBegin', function (name, file){
            file.path = _path + '/' + file.name;
        }).on('file', function (name, file){
            _file.push(file.path);
        });
        console.log(_file);
        return res.status(200).json({
            isSuccess: true,
            _file
        });
    } catch (e) {
        return next(e);
    }
}

export default UploadFile;