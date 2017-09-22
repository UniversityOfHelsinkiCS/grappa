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
    
      // Contract
    app.get('/contract', (req, res) => {
        contractController.getContract(req, res);
    });

    app.get('/contract/:id', (req, res) => {
        contractController.getContractById(req, res);
    });
    
    app.post('/contract', (req, res) => {
        contractController.saveContract(req, res);
    });
    
      // Thesis
    app.get('/theses', (req, res) => {
        thesisController.getAllTheses(req, res);
    });

    app.get('/theses/:id', (req, res) => {
        thesisController.getThesisById(req, res);
    });
};
