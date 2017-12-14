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
        mets: {
            '@ID': 'sort-mets_mets',
            '@OBJID': 'sword-mets',
            '@LABEL': 'DSpace SWORD Item',
            '@PROFILE': 'DSpace METS SIP Profile 1.0',
            '@xmlns': 'http://www.loc.gov/METS/',
            '@xmlns:xlink': 'http://www.w3.org/1999/xlink',
            '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
            '@xsi:schemaLocation': 'http://www.loc.gov/METS/ http://www.loc.gov/standards/mets/mets.xsd',
            metsHdr:{
                '@CREATEDATE': '2007-09-01T00:00:00',
                agent: {
                    '@ROLE': 'CUSTODIAN',
                    '@TYPE': 'ORGANIZATION',
                    name: {
                        '#text': 'Richard Jones'
                        }
                }
            },
            dmdSec:{
                '@ID': 'sword-mets-dmd-1',
                '@GROUPID': 'sword-mets-dmd-1_group-1',
                mdWrap:{
                    '@LABEL': 'Metadata',
                    '@MDTYPE': 'OTHER',
                    '@OTHERMDTYPE': 'dim',
                    '@MIMETYPE': 'text/xml',
                    xmlData: {
                        '@xmlns:dim': 'http://www.dspace.org/xmlns/dspace/dim',
                        'dim:field': [
                            {
                                '@mdschema': 'dc',
                                '@element': 'title',
                                '#text': 'The title of this awesome thesis'
                            }, {
                                '@mdschema': 'dct',
                                '@element': 'creator',
                                '#text': 'Author Awesome'
                            },{
                                '@mdschema': 'dct',
                                '@element': 'issued',
                                '#text': '2017'
                            },{
                                '@mdschema': 'dct',
                                '@element': 'abstract',
                                '@lang': 'en',
                                '#text': 'The english abstract of this awesome thesis'
                            },{
                                '@mdschema': 'dct',
                                '@element': 'abstract',
                                '@lang': 'fi',
                                '#text': 'Tämän kerrassaan mahtavan gradun tiivistelmä'
                            },{
                                '@mdschema': 'dct',
                                '@element': 'subject',
                                '#text': 'Gradunala'
                            },{
                                '@mdschema': 'ethesis',
                                '@element': 'language',
                                '@lang': 'en',
                                '#text': 'English'
                            },{
                                '@mdschema': 'ethesis',
                                '@element': 'thesistype',
                                '@lang': 'en',
                                '#text': 'master\'s thesis'
                            },{
                                '@mdschema': 'ethesis',
                                '@element': 'discipline',
                                '@lang': 'en',
                                '#text': 'discipline'
                            }
                        ],
                    }
                },
            },
            fileSec:{
                fileGrp:{
                    '@ID': 'sword-mets-fgrp-1',
                    '@USE': 'CONTENT',
                    file:{
                        '@GROUPID': 'sword-mets-fgid-0',
                        '@ID': 'sword-mets-file-1',
                        '@MIMETYPE': 'application/pdf',
                        FLocat:{
                            '@LOCTYPE': 'URL',
                            '@xlink:href': 'gradu.pdf'
                        },
                    },
                },
            },
            structMap:{
                '@ID': 'sword-mets-struct-1',
                '@LABEL': 'structure',
                '@TYPE': 'LOGICAL',
                div:{
                    '@ID': 'sword-mets-div-1',
                    '@DMDID': 'sword-mets-dmd-1',
                    '@TYPE': 'SWORD Object',
                    div:{
                        '@ID': 'sword-mets-div-2',
                        '@TYPE': 'File',
                        fptr:{
                            '@FILEID': 'sword-mets-file-1'
                        }
                    }
                }
            }
        }
      },
      {version: '1.0', encoding: 'UTF-8', standalone: false}).end({ pretty: true});

    console.log(metaData.toString());
    console.log('--- --- ---')
    
    //const data = new FormData(); 
    //data.append('meta', metaData, { type: 'application/atomserv+xml' });
    console.log(pdf);
    //data.append('file', pdf, { type: 'application/pdf' });

    var zip=require('adm-zip');
    var dataBuffer = new Buffer(metaData,'utf-8');//console.log(dataBuffer.toString());
    var zipper = new zip();
    zipper.addFile('gradu.pdf',pdf, '', 644);
    zipper.addFile('mets.xml',dataBuffer, '', 644);
    
    var fs = require('fs');
    fs.writeFile("/tmp/test.zip", zipper.toBuffer(), function(err) {
        if(err) {
            return console.log(err);
        }
    
        console.log("The file was saved!");
    }); 
/*
    request({
        method: 'POST',
        preambleCRLF: false,
        postambleCRLF: false,
        uri: 'http://kirjasto-test.hulib.helsinki.fi/ethesis-sword/deposit/123456789/13',
        'auth': creds,
        headers: {
            'Content-Disposition': 'filename=ex.zip', 
            'Content-Type': 'application/zip', 
            'X-Packaging': 'http://purl.org/net/sword-types/METSDSpaceSIP', 
            'X-No-Op': 'false', 
            'X-Verbose': 'true',
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
        ],* /
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
*/

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