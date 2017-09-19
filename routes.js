const output = require('./src/output');
const contractController = require('./src/controllers/ContractController');
const thesisController = require('./src/controllers/ThesisController');


module.exports = (app) => {
    app.get('/',  (req, res) => {
        output.send(req.query.outputType, res, { text: "Hello World!"} );
    })

    app.get('/helloUser', (req, res) => {
        if(req.query.username){
          output.send(req.query.outputType, res, { text: req.query.username });
        } else {
          output.send(req.query.outputType, res, { text: "Hello World!" });
        }
    })
      
    app.use(thesisController);
      
      // Contract
    app.get('/contract', (req, res) => {
        contractController.getContract(req, res);
    });
      
    app.post('/contract', (req, res) => {
        contractController.saveContract(req, res);
    });
      
      // Thesis
    app.get('/theses', (req, res) => {
        // list all theses
        thesisController.getTheses(req, res);
    });
};