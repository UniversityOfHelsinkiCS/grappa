import multer from 'multer'

const PATH_TO_FOLDER = '/usr/src/app/uploads/'

const storage = () => {
    try {
        if (process.env.NODE_ENV === 'test') {
            return multer.memoryStorage()
        }
        return multer.diskStorage({
            destination: PATH_TO_FOLDER
        })
    } catch (e) {
        console.log("storage method failed. Error starting from next line")
        console.log(e)
        throw e
    }
}

const upload = multer({ storage: storage() }).fields([
    { name: 'otherFile' },
    { name: 'reviewFile', maxCount: 1 },
    { name: 'thesisFile', maxCount: 1 }
])

module.exports = upload
