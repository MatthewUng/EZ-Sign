const docusign = require('docusign-esign');
const path = require('path');
const apiClient = new docusign.ApiClient();
const fs = require('fs');

const OAuthToken = 'eyJ0eXAiOiJNVCIsImFsZyI6IlJTMjU2Iiwia2lkIjoiNjgxODVmZjEtNGU1MS00Y2U5LWFmMWMtNjg5ODEyMjAzMzE3In0.AQgAAAABAAUABwAAnjG3VDHWSAgAAN5UxZcx1kgCACuQm0Cp8u9KlKQZXmM4xX4VAAEAAAAYAAEAAAAFAAAADQAkAAAAZjBmMjdmMGUtODU3ZC00YTcxLWE0ZGEtMzJjZWNhZTNhOTc4MACAjSCTUTHWSA.eEbgcppFieE-KyWadK4mNOXNetNc0n3eqW1BI3Vn529tRoK3S98C2e9TH9S2WUplJ_gtcgdhafQQNvpPdDz4XNFFswF-5PwQtHixNngI56jwU9NOHOMgXm62XNENAq28VC9EwgNd6T78sBcC8phWid9bZh4P6oeBp_NRdLmGwDrNPGpJDpqueK1NNb3INhqxJvxwobeGDIIqQt6Q6IfCfBo8yTrDXxaint1cpem7C5QamnvuMKPXvEXmMqFemPV-bpvcBxNWZ3SAQcK8zcUllH86pcp51kqthi1a0rh-7iyhDiSKasVjVgf27bZw-WeDphkmtbxdUXxtybZBVypk_w';
const accountId = '6814377';

const fileName = 'docs/House.pdf'; //IE: test.pdf

function SendEmail(name, email, app){

  apiClient.setBasePath('https://demo.docusign.net/restapi');
  apiClient.addDefaultHeader('Authorization', 'Bearer ' + OAuthToken);

  // *** Begin envelope creation ***

  //Read the file you wish to send from the local machine.
  fileStream = process.argv[2];
  pdfBytes = fs.readFileSync(path.resolve(__dirname, fileName));
  pdfBase64 = pdfBytes.toString('base64');

  docusign.Configuration.default.setDefaultApiClient(apiClient);

  var envDef = new docusign.EnvelopeDefinition();

  //Set the Email Subject line and email message
  envDef.emailSubject = 'Sign this agreement from eAgree.';
  envDef.emailBlurb = 'Please sign this agreement.'

  //Read the file from the document and convert it to a Base64String
  var doc = new docusign.Document();
  doc.documentBase64 = pdfBase64;
  doc.fileExtension = 'pdf';
  doc.name = 'Node Doc Send Sample';
  doc.documentId = '1';

  //Push the doc to the documents array.
  var docs = [];
  docs.push(doc);
  envDef.documents = docs;

  //Create the signer with the previously provided name / email address
  var signer = new docusign.Signer();
  signer.name = name;
  signer.email = email;
  signer.routingOrder = '1';
  signer.recipientId = '1';

  //Create a tabs object and a signHere tab to be placed on the envelope
  var tabs = new docusign.Tabs();

  var signHere = new docusign.SignHere();
  signHere.documentId = '1';
  signHere.pageNumber = '1';
  signHere.recipientId = '1';
  signHere.tabLabel = 'SignHereTab';
  signHere.xPosition = '50';
  signHere.yPosition = '50';

  //Create the array for SignHere tabs, then add it to the general tab array
  signHereTabArray = [];
  signHereTabArray.push(signHere);

  tabs.signHereTabs = signHereTabArray;

  //Then set the recipient, named signer, tabs to the previously created tab array
  signer.tabs = tabs;

  //Add the signer to the signers array
  var signers = [];
  signers.push(signer);

  //Envelope status for drafts is created, set to sent if wanting to send the envelope right away
  envDef.status = 'sent';

  //Create the general recipients object, then set the signers to the signer array just created
  var recipients = new docusign.Recipients();
  recipients.signers = signers;

  //Then add the recipients object to the enevelope definitions
  envDef.recipients = recipients;

  // *** End envelope creation ***

  //Send the envelope
  var envelopesApi = new docusign.EnvelopesApi();
  envelopesApi.createEnvelope(accountId, { 'envelopeDefinition': envDef }, function (err, envelopeSummary, response) {

      if (err) {
      console.log(response);
      return res.send('Error while sending a DocuSign envelope:' + err);
      }

      });

}

module.exports = { SendEmail } ;
