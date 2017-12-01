import axios from 'axios'
import xml from 'xmlbuilder'
import creds from './ethesis_credentials'
import FormData from 'form-data'

export async function saveToEThesis(meta, pdf){

    const config = { headers: { 'auth': creds } };

    var doc = xml.create({
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
    
    console.log(doc.toString());
    console.log('--- --- ---')
    console.log(new Buffer(['test payload'], { type: 'text/csv' }))
    console.log('--- --- ---')

    const data = new FormData();
    data.append('action', 'ADD');
    data.append('meta', doc, { type: 'application/atomserv+xml' });
    data.append('file', new Blob(['test payload'], { type: 'text/csv' }));
    //data.append('file', pdf, { type: 'application/pdf' });

    axios.post('http://kirjasto-test.hulib.helsinki.fi/ethesis-swordv2/collection/123456789/13', data, config)
    .then(response => console.log(response))
    .catch(errors => console.log(errors));

}