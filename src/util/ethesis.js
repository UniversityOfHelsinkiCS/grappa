import request from 'request'
import xml from 'xmlbuilder'
import creds from './ethesis_credentials'
import zip from 'adm-zip';

export function getExamplePDF(){
    const fs = require('fs');
    return fs.readFileSync('./data/file/example_thesis.pdf');
}

export async function saveToEThesis(meta, pdf){
    
    var metaData = xml.create({
        entry: {
            '@xmlns': 'http://www.w3.org/2005/Atom',
            '@xmlns:sword': 'http://purl.org/net/sword/',
            title: 'harjoittelusyöttö',
            author:{
                name: {
                '#text': 'harjoittelusyöttö'
                }
            },
            summary:{
                '@type': 'text',
                '#text': 'The abstract'
            },
            'dcterms:abstract': 'The abstract',
            'dcterms:accessRights': 'Access Rights',
            'dcterms:alternative': 'Alternative Title',
            'dcterms:available': 'Date Available',
            'dcterms:bibliographicCitation': 'Bibliographic Citation',
            'dcterms:contributor': 'Contributor',
            'dcterms:description': 'Description',
            'dcterms:hasPart': 'Has Part',
            'dcterms:hasVersion': 'Has Version',
            'dcterms:identifier': 'Identifier',
            'dcterms:isPartOf': 'Is Part Of',
            'dcterms:publisher': 'Publisher',
            'dcterms:references': 'References',
            'dcterms:rightsHolder': 'Rights Holder',
            'dcterms:source': 'Source',
            'dcterms:title': 'Title',
            'dcterms:type': 'Type'
        }
      }).end({ pretty: true});
    
    console.log(metaData.toString());
    console.log('--- --- ---')
    
    //const data = new FormData();
    //data.append('meta', metaData, { type: 'application/atomserv+xml' });
    console.log(pdf);
    //data.append('file', pdf, { type: 'application/pdf' });

    var zip=require('adm-zip');
    var dataBuffer = new Buffer(metaData,'utf-8');//console.log(dataBuffer.toString());
    var zipper = new zip();
    zipper.addFile('mets.xml',dataBuffer);
    zipper.addFile('gradu.pdf',pdf);

    request({
        method: 'POST',
        preambleCRLF: false,
        postambleCRLF: false,
        uri: 'http://kirjasto-test.hulib.helsinki.fi/ethesis-swordv2/collection/123456789/13',
        'auth': creds,
        headers: {
            'Packaging': 'http://purl.org/net/sword/package/SimpleZip',
            'content-type':'application/zip',
            'Content-Disposition': 'filename=zip.zip'
        },
        body: zipper.toBuffer()

        /*
        multipart: [
            {
                'content-type': 'application/atomserv+xml',
                body: metaData.toString()
            },
            { 
                'content-type': 'application/pdf',
                body: pdf
            }
        ],*/
    },
    function (error, response, body) {
        console.log('statusCode:', response && response.statusCode); 
        if (error) {
            return console.error('upload failed:', error);
        }
        console.log('Upload successful!');
        console.log('Response headers:');
        console.log(response.headers);
        console.log('Response body:\n', body);
        console.log('Request:');
        console.log(response.request);
        
    })


/*
    axios.post('http://kirjasto-test.hulib.helsinki.fi/ethesis-swordv2/collection/123456789/13', data, auth_config, config)
    .then(
        (response) => {
            console.log(response)
        }
    ).catch(
        (errors) => {
            console.log('--- --- ---');
            console.log('--- --- REQUEST HEADERS --- ---');
            console.log(errors.request._header);
            console.log('--- --- RESPONSE STATUS --- ---');
            console.log(errors.response.status);
            console.log('--- --- RESPONSE TEXT --- ---');
            console.log(errors.response.statusText);
            console.log('--- --- RESPONSE MESSAGE --- ---');
            console.log(errors.response.message);
            console.log('--- --- RESPONSE HEADERS --- ---');
            console.log(errors.response.headers);
            console.log('--- --- RESPONSE CONFIG --- ---');
            console.log(errors.response.config);
        }
    );
*/
}