import axios from 'axios'
import xml from 'xmlbuilder'
import creds from './ethesis_credentials'

export async function saveToEThesis(meta, pdf){

    const config = { headers: { 'auth': creds } };

    var doc = xml.create({
        feed: {
            '@xmlns': 'http://www.w3.org/2005/Atom',
            '@xmlns:sword': 'http://purl.org/net/sword/',
            title: 'harjoittelusyöttö',
            author:{
                name: {
                '#text': 'harjoittelusyöttö'
                }
            }
        }
      }).end({ pretty: true});
    
    console.log(doc.toString({ pretty: true }));

    /*
    <?xml version="1.0"?>
<entry xmlns="http://www.w3.org/2005/Atom"
        xmlns:dcterms="http://purl.org/dc/terms/">
    <title>Title</title>
    <id>urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a</id>
    <updated>2005-10-07T17:17:08Z</updated>
    <author><name>Contributor</name></author>
    <summary type="text">The abstract</summary>

    <!-- some embedded metadata -->
    <dcterms:abstract>The abstract</dcterms:abstract>
    <dcterms:accessRights>Access Rights</dcterms:accessRights>
    <dcterms:alternative>Alternative Title</dcterms:alternative>
    <dcterms:available>Date Available</dcterms:available>
    <dcterms:bibliographicCitation>Bibliographic Citation</dcterms:bibliographicCitation>
    <dcterms:contributor>Contributor</dcterms:contributor>
    <dcterms:description>Description</dcterms:description>
    <dcterms:hasPart>Has Part</dcterms:hasPart>
    <dcterms:hasVersion>Has Version</dcterms:hasVersion>
    <dcterms:identifier>Identifier</dcterms:identifier>
    <dcterms:isPartOf>Is Part Of</dcterms:isPartOf>
    <dcterms:publisher>Publisher</dcterms:publisher>
    <dcterms:references>References</dcterms:references>
    <dcterms:rightsHolder>Rights Holder</dcterms:rightsHolder>
    <dcterms:source>Source</dcterms:source>
    <dcterms:title>Title</dcterms:title>
    <dcterms:type>Type</dcterms:type>

</entry>
    */


    const data = new FormData();
    data.append('action', 'ADD');
    data.append('file', pdf, { type: 'application/pdf' });

    axios.post('http://kirjasto-test.hulib.helsinki.fi/ethesis-swordv2/collection/123456789/13', data, config)
    .then(response => console.log(response))
    .catch(errors => console.log(errors));

}