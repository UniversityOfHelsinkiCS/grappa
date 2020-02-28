const router = require('express').Router()
const axios = require('axios')
const bodyParser = require('body-parser')
const thesisController = require('../controllers/ThesisController')

const jsonParser = bodyParser.json()
const auth = require('../middleware/auth')
const attachment = require('../middleware/attachments')

/**
 * @api {get} theses/ Get all theses
 * @apiName GetTheses
 * @apiGroup Theses
 *
 * @apiDescription Returns all theses accessed by current user.
 * @apiSuccess theses List of theses
 */
router.get('/', (req, res, next) => thesisController.getTheses(req, res).catch(next))

/**
 * @api {put} theses/ Update thesis
 * @apiName UpdateThesis
 * @apiGroup Theses
 *
 * @apiDescription Updates existing thesis.
 *
 * @apiParamExample {json} Request-Example
 *  {
 *      "thesisId":4,
 *      "title":"Example title",
 *      "councilmeetingId":9,
 *      "urkund":"http://example.com",
 *      "grade":"5",
 *      "printDone":false,
 *      "studyfieldId":1,
 *      "graders":[5, 6],
 *      "authorEmail":"olivia@opiskelija.com",
 *      "authorFirstname":"Olivia",
 *      "authorLastname":"Opiskelija"
 *  }
 *
 * @apiSuccess thesis Updated thesis
 * @apiSuccess roles Updated roles
 */
router.put('/', jsonParser, auth.checkStaff, (req, res, next) => thesisController.updateThesis(req, res).catch(next))

/**
 * @api {post} theses/ Save new thesis
 * @apiName CreateThesis
 * @apiGroup Theses
 *
 * @apiDescription
 * Multipart post. Saves attachments & thesis data with same post.
 *
 * @apiParam {File} thesisFile Thesis PDF
 * @apiParam {File} reviewFile Review PDF
 * @apiParam {File[]} otherFile Other file type
 * @apiParam {JSON} json Thesis data, see example
 *
 *  @apiParamExample {json} Request-Example
 *  {
 *      "title":"Example title",
 *      "councilmeetingId":9,
 *      "urkund":"http://example.com",
 *      "grade":"5",
 *      "printDone":false,
 *      "studyfieldId":1,
 *      "graders":[5, 6],
 *      "authorEmail":"olivia@opiskelija.com",
 *      "authorFirstname":"Olivia",
 *      "authorLastname":"Opiskelija"
 *  }
 *
 * @apiSuccess thesis New thesis
 * @apiSuccess roles New roles
 */
router.post('/', attachment, auth.checkStaff, (req, res, next) => thesisController.saveThesisForm(req, res).catch(next))

/**
 * @api {put} theses/printed Mark theses as printed
 * @apiName MarkPrinted
 * @apiGroup Theses
 *
 * @apiDescription Sets printed to true for selected theses.
 *
 * @apiParam {Number[]} body theses ids
 */
router.put('/printed', jsonParser, auth.checkStaff, (req, res, next) =>
    thesisController.markPrinted(req, res).catch(next))

router.get('/in_ethesis', async (req, res) => {
    const { title, authors } = req.query
    const words = [...title.split(' '), ...authors.split(' ')]
    const heldaUrl = `https://helda.helsinki.fi/handle/10138/17738/discover?query=${encodeURIComponent(words.join(' '))}`
    try {
        const { data } = await axios.get(heldaUrl)
        const foundish = words.map((word) => {
            const wordCountInHTML = data.split(word).length - 1
            return wordCountInHTML > 3 // 3 is the magic amount it's there even if it's not found
        })
        const totalAmount = foundish.length
        const likelyAmount = foundish.filter(f => f).length
        const trustItsThere = likelyAmount / totalAmount
        res.send({ found: trustItsThere > 0.5 }) // At least half of the words appear twice
    } catch (err) {
        res.send(404)
    }
})

module.exports = router
