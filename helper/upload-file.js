import Upload from '../models/upload';
const formidable = require('formidable');
const path = require('path');

const UploadFile = async (req, res, next) => {
    try {
        const userId =  req.params.id;
        const form = new formidable.IncomingForm();
        form.multiples = true;
        form.parse(req);
        const dirName = path.resolve(__dirname, '.././', './upload');
        let _file = [];
        form.on('field', (name, field) => {
            console.log('Field', name, field)
        })
        .on('fileBegin', function (name, file) {
            file.path = dirName + '/' + file.name;
        })
        .on('file', (name, file) => {
            _file.push(file.path);
        })
        .on('aborted', function() {
            return next(new Error('Oop!'))
        })
        .on('end', async () => {
            try {
                const _upload = await Upload.findOne({ user: userId});
                if ( _upload ) {
                    const now = new Date();
                    if ( _upload.blockUploadAt !== null ) {
                        const checkBlockTime = ((now - _upload.startUploadAt)/1000)/60;
                        if ( checkBlockTime < 10 ) {
                            return next(new Error('You ware block update function'))
                        }
                        await _upload.update({ blockUploadAt: null, total: 0 })
                        return res.status(200).json({
                            isUpload: true,
                            upload: _upload
                        })
                    }
                    const checkUpdateTime = ((now - _upload.startUploadAt)/1000)/60;
                    const total = _upload.total + _file.length;
                    console.log(checkUpdateTime)
                    if ( total > 10 && checkUpdateTime < 1 ) {
                        await _upload.update({ blockUploadAt: new Date() });
                        return next(new Error('Opp! You can not update 10 files until 1 second'))
                    } 
                    return res.status(200).json({
                        isUpload: true
                    })
                }
                const upload = new Upload();
                const now = new Date();
                upload.startUploadAt = now;
                upload.filePath = _file;
                upload.total = _file.length;
                upload.user = userId;
                await upload.save();
                return res.status(200).json({
                    upload: upload
                });
            } catch (e) {
                return next(e);
            }
        });
    } catch (e) {
        return next(e);
    }
}

export default UploadFile;