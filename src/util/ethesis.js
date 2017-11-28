import axios from 'axios'
import xml from 'xmlbuilder'
import creds from './ethesis_credentials'

export async function saveToEThesis(meta, pdf){

    const config = { headers: { 'auth': creds } };

    var doc = xml.create();
    
    doc.begin('root')
      .ele('xmlbuilder')
        .att('for', 'node-js')
        .ele('repo')
          .att('type', 'git')
          .txt('git://github.com/oozcitak/xmlbuilder-js.git') 
        .up()
      .up()
      .ele('test')
        .txt('complete');
    
    console.log(doc.toString({ pretty: true }));


    const data = new FormData();
    data.append('action', 'ADD');
    data.append('file', new Blob(['test payload'], { type: 'text/csv' }));

    axios.post('http://kirjasto-test.hulib.helsinki.fi/ethesis-swordv2/collection/123456789/13', data, config)
    .then(response => console.log(response))
    .catch(errors => console.log(errors));

}