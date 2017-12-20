# Deployment

Both front and back end are ready to use with Docker. You can build your own Docker images or use automatic builds in Dockerhub:
https://hub.docker.com/r/joonassa/front-grappa2/
https://hub.docker.com/r/joonassa/back-grappa2/

## Shibboleth

In production environment back end depends on all requests coming through Shibboleth. You can run Apache and Shibboleth in front of containers, or use separate container to route all request through Shibboleth to back end. In development we used https://hub.docker.com/r/villevaltonen/shibboleth-sp/ . Unfortunately this image does not seem to get rebuild on OS updates, so in production you should use image from difference source (one by Unicon seems to be popular) or fork and rebuild this image yourself.

If you use image from or based on one by villevaltonen, you need to bring out of container following files and directories:
- /etc/shibboleth/shibboleth2.xml
- /etc/httpd/conf.d/shib.conf
- /etc/pki/tls/certs/
- /etc/shibboleth/sign-login.helsinki.fi.crt
- /etc/httpd/conf/httpd.conf
- /etc/httpd/conf.d/ssl.conf
- /etc/shibboleth-ds/idp_metadata/
- /etc/shibboleth/attribute-map.xml

You also need to expose /Shibboleth.sso from container in root of server.

For specific configuration issues regarding Shibboleth in University of Helsinki environment see https://wiki.helsinki.fi/display/IAMasioita/Tuoteriippumaton+tee-itse+SAML2-ohje (in finnish).


### certs

Server certificate and key need to be in certs directory.


### httpd.conf

Copy original httpd.conf from container and edit it. Set ServerAdmin and ServerName correctly.


### shib.conf

File shib.conf contains Apache configuration specific to Shibboleth module. You need to copy it and at least add location directive for back end:

```
<Location /path to backend/ >
  AuthType shibboleth
  ShibUseHeaders On
  ShibRequestSetting requireSession 1
  require shib-session

  ProxyPreserveHost On
  ProxyPass http://backalias:3100/
  ProxyPassReverse http://backalias:3100/
</Location>
```
Replace path with path to back end. Depending on your other configuration, this might be root (/) or some other path. Replace also backalias with alias you have defined for your docker container.


### ssl.conf

Also ssl.conf needs some minor changes. Copy it from container and set ServerName correctly.


### shibboleth2.xml

File shibboleth2.xml is Shibboleth configuration file. Copy it from container and:
- set ApplicationDefaults EntityID as suggested in wiki.helsinki.fi page (servername)
- set Session attributes handlerSSL="true" and cookieProps="https"
- set SSO EntityId="https://login.helsinki.fi/shibboleth"
- set Errors supportContact
- set MetadataProvider uri="https://login.helsinki.fi/metadata/sign-hy-metadata.xml" backingFilePath="/etc/shibboleth/sign-hy-metadata.xml" and <SignatureMetadataFilter certificate="/etc/shibboleth/sign-login.helsinki.fi.crt" />
- set CredentialResolver key and certificate to point to your files in certs directory.


### idp_metadata

Directory idp_metadata should contain metadata from idp server.

### attribute-map.xml

Copy original attribute-map.xml as your base and add or uncomment following attributes:

<Attribute name="urn:mace:funet.fi:haka:logout-url" id="SHIB_LOGOUT_URL"/>
<Attribute name="urn:oid:1.3.6.1.4.1.16161.3.1" id="SHIB_LOGOUT_URL"/> 
<Attribute name="urn:oid:1.3.6.1.4.1.25178.1.2.14" id="unique-code"/>
<Attribute name="urn:oid:1.3.6.1.4.1.5923.1.1.1.1" id="edupersonaffiliation"/>
<Attribute name="urn:oid:2.5.4.3" id="cn"/>
<Attribute name="urn:oid:2.5.4.4" id="sn"/>
<Attribute name="urn:oid:2.5.4.42" id="givenName"/>
<Attribute name="urn:oid:2.16.840.1.113730.3.1.241" id="displayName"/>
<Attribute name="urn:oid:0.9.2342.19200300.100.1.1" id="uid"/>
<Attribute name="urn:oid:0.9.2342.19200300.100.1.3" id="mail"/>

You can change attribute ids to something more descriptive, but if you do, you need to change them also in back end code (src/middleware/auth.js and test/endpoint/auth.spec.js).