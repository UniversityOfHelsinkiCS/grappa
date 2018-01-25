import multer from 'multer';

const PATH_TO_FOLDER = './uploads/';

const storage = () => {
    if (process.env.NODE_ENV === 'test') {
        return multer.memoryStorage();
    }
    return multer.diskStorage({
        destination: PATH_TO_FOLDER
    });
};
const upload = multer({ storage: storage() }).fields([
    { name: 'otherFile' },
    { name: 'reviewFile', maxCount: 1 },
    { name: 'thesisFile', maxCount: 1 }
]);

module.exports = upload;
