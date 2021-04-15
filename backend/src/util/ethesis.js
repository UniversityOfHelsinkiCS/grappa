import request from 'request'
import xml from 'xmlbuilder'
import logger from '../util/logger'
import creds from './ethesis_credentials.dist'

const fs = require('fs')
const JSZip = require('jszip')
const { parseString } = require('xml2js')

/*
to test:
console.log('LETS START E-THESIS!');
ethesis = require( './src/util/ethesis');
ethesis.saveToEThesis({
    thesisTitle: 'the awesome thesis',
    author: 'awesome author',
    abstract: {en: 'english abstract', fi: 'finnish abstract'}
}, './data/file/example_thesis.pdf');
*/

function generateMetaXML(meta) {
    return xml.create({
        mets: {
            '@ID': 'sort-mets_mets',
            '@OBJID': 'sword-mets',
            '@LABEL': 'DSpace SWORD Item',
            '@PROFILE': 'DSpace METS SIP Profile 1.0',
            '@xmlns': 'http://www.loc.gov/METS/',
            '@xmlns:xlink': 'http://www.w3.org/1999/xlink',
            '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
            '@xsi:schemaLocation': 'http://www.loc.gov/METS/ http://www.loc.gov/standards/mets/mets.xsd',
            metsHdr: {
                '@CREATEDATE': '2007-09-01T00:00:00',
                agent: {
                    '@ROLE': 'CUSTODIAN',
                    '@TYPE': 'ORGANIZATION',
                    name: {
                        '#text': 'Grappa 2.0'
                    }
                }
            },
            dmdSec: {
                '@ID': 'sword-mets-dmd-1',
                '@GROUPID': 'sword-mets-dmd-1_group-1',
                mdWrap: {
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
                                '#text': meta.thesisTitle
                            },
                            /**
                             * result wanted: <dim:field mdschema="dct"
                             * element="identifier"
                             * qualifier="urn">
                             * URN-testitunnus
                             * </dim:field>
                             */
                            // x.y.z -> x = mdschema, y = element, z = qualifier
                            {
                                '@mdschema': 'dct',
                                '@element': 'identifier',
                                '@qualifier': 'urn',
                                '#text': meta.URN
                            }, {
                                '@mdschema': 'dct',
                                '@element': 'creator',
                                '#text': meta.author
                            }, {
                                '@mdschema': 'dct',
                                '@element': 'issued',
                                '#text': meta.yearNow
                            }, {
                                '@mdschema': 'dct',
                                '@element': 'abstract',
                                '@lang': 'en',
                                '#text': meta.abstract.en
                            }, {
                                '@mdschema': 'dct',
                                '@element': 'abstract',
                                '@lang': 'fi',
                                '#text': meta.abstract.fi
                            }, {
                                '@mdschema': 'dct',
                                '@element': 'subject',
                                '#text': 'Gradunala'
                            }, {
                                '@mdschema': 'ethesis',
                                '@element': 'language',
                                '@lang': 'en',
                                '#text': 'English'
                            }, {
                                '@mdschema': 'ethesis',
                                '@element': 'thesistype',
                                '@lang': 'en',
                                '#text': 'master\'s thesis'
                            }, {
                                '@mdschema': 'ethesis',
                                '@element': 'discipline',
                                '@lang': 'en',
                                '#text': 'discipline'
                            }
                        ]
                    }
                }
            },
            fileSec: {
                fileGrp: {
                    '@ID': 'sword-mets-fgrp-1',
                    '@USE': 'CONTENT',
                    file: {
                        '@GROUPID': 'sword-mets-fgid-0',
                        '@ID': 'sword-mets-file-1',
                        '@MIMETYPE': 'application/pdf',
                        FLocat: {
                            '@LOCTYPE': 'URL',
                            '@xlink:href': 'gradu.pdf'
                        }
                    }
                }
            },
            structMap: {
                '@ID': 'sword-mets-struct-1',
                '@LABEL': 'structure',
                '@TYPE': 'LOGICAL',
                div: {
                    '@ID': 'sword-mets-div-1',
                    '@DMDID': 'sword-mets-dmd-1',
                    '@TYPE': 'SWORD Object',
                    div: {
                        '@ID': 'sword-mets-div-2',
                        '@TYPE': 'File',
                        fptr: {
                            '@FILEID': 'sword-mets-file-1'
                        }
                    }
                }
            }
        }
    }, { version: '1.0', encoding: 'UTF-8', standalone: false })
        .end({ pretty: true })
}

async function eThesisAPI(meta, pdfAddr) {
    const pdf = await fs.readFileSync(pdfAddr)

    const metaData = await generateMetaXML(meta)
    // xml structure test output
    // console.log(metaData.toString());
    // const dataBuffer = new Buffer(metaData, 'utf-8');

    const zip = new JSZip()
    zip.file('gradu.pdf', pdf)
    zip.file('mets.xml', metaData.toString())

    // /* to test zip-output to disc
    zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
        .pipe(fs.createWriteStream('/tmp/test.zip'))
        .on('finish', () => {
            // JSZip generates a readable stream with a "end" event,
            // but is piped here in a writable stream which emits a "finish" event.

            // TODO: use logger, write more informative message
            /* eslint-disable no-console */
            console.log('out.zip written.')
            /* eslint-enable no-console */
        })
    //* /
    const settings = {
        method: 'POST',
        preambleCRLF: false,
        postambleCRLF: false,
        uri: 'http://kirjasto-test.hulib.helsinki.fi/ethesis-sword/deposit/123456789/13',
        auth: creds,
        headers: {
            'Content-Disposition': 'filename=ex.zip',
            'Content-Type': 'application/zip',
            'X-Packaging': 'http://purl.org/net/sword-types/METSDSpaceSIP',
            'X-No-Op': 'false',
            'X-Verbose': 'true'
        },
        body: zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
    }

    request(settings, (error, response, body) => {
        logger.info('Ethesis request callback', { response })
        if (error) {
            logger.error('upload failed', { error })
        }
        if (response) {
            if (response.statusCode === 201) {
                logger.info('Upload successful!', { response })

                parseString(body, (err, result) => {
                    logger.info('parsing done!', { result })
                })
            }
        }
    })
}

export default async function saveToEThesis(metaData, pdfAddr) {
    const today = new Date()
    const meta = Object.assign({}, metaData)
    meta.yearNow = today.getFullYear()

    // haetaan urn-tunnus
    // yleinen generaattori: http://generator.urn.fi/cgi-bin/urn_generator.cgi?type=nbn
    // hulib aliavaruuden generaattori (vaatii serverin white listingin):
    // http://generator.urn.fi/cgi-bin/urn_generator.cgi?type=nbn&subnamespace=hulib
    request('http://generator.urn.fi/cgi-bin/urn_generator.cgi?type=nbn&subnamespace=hulib',
        (error, response, body) => {
            if (error) {
                return error
            }
            if (body.toLowerCase().indexOf('error') !== -1 || body === '') {
                return 'ERROR: could not get URN.'
            }
            meta.URN = body
            return eThesisAPI(meta, pdfAddr)
        })/*
    console.log(meta);

    const pdf = await fs.readFileSync(pdfAddr);

    const metaData = await generateMetaXML(meta);
    //xml structure test output
    console.log(metaData.toString());
    const dataBuffer = new Buffer(metaData, 'utf-8');

    var zip = new JSZip();
    zip.file('gradu.pdf', pdf);
    zip.file('mets.xml', metaData.toString());

    /* to test zip-output to disc
    zip
    .generateNodeStream({type:'nodebuffer',streamFiles:true})
    .pipe(fs.createWriteStream('/tmp/test.zip'))
    .on('finish', function () {
        // JSZip generates a readable stream with a "end" event,
        // but is piped here in a writable stream which emits a "finish" event.
        console.log("out.zip written.");
    });
    * /

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
            body: zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
        },
        function (error, response, body) {
            if (error) {
                return console.error('upload failed:', error);
            }
            if(response){
                if(response.statusCode == 201){
                    console.log('Upload successful!');
                    console.log('statusCode:', response && response.statusCode);

                    var parseString = require('xml2js').parseString;
                    parseString(body, function (err, result) {
                        console.dir(result);
                    });
                }
            }

        }) */
}
