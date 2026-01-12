const fs = require('fs');
const xmlConverter = require('xml-js');
const protobuf = require('protobufjs');

// Initialisation du schéma Protobuf
const schema = protobuf.loadSync('employee.proto');
const EmployeesType = schema.lookupType('Employees');

// Liste des employés avec leurs informations
const listeEmployes = [
  { id: 1, name: 'Abla', salary: 12500 },
  { id: 2, name: 'Kaoutar', salary: 18500 },
  { id: 3, name: 'Hamza', salary: 27500 }
];

const donnees = { employee: listeEmployes };

// Traitement JSON
console.time('JSON encode');
const donneesJson = JSON.stringify(donnees);
console.timeEnd('JSON encode');

console.time('JSON decode');
JSON.parse(donneesJson);
console.timeEnd('JSON decode');

fs.writeFileSync('data.json', donneesJson);

// Traitement XML
const optionsXml = {
  compact: true,
  ignoreComment: true,
  spaces: 0
};

console.time('XML encode');
const donneesXml = '<root>' + xmlConverter.json2xml(donnees, optionsXml) + '</root>';
console.timeEnd('XML encode');

console.time('XML decode');
const xmlConverti = xmlConverter.xml2json(donneesXml, { compact: true });
JSON.parse(xmlConverti);
console.timeEnd('XML decode');

fs.writeFileSync('data.xml', donneesXml);

// Traitement Protobuf
const erreur = EmployeesType.verify(donnees);
if (erreur) throw Error(erreur);

console.time('Protobuf encode');
const messageProto = EmployeesType.create(donnees);
const bufferProto = EmployeesType.encode(messageProto).finish();
console.timeEnd('Protobuf encode');

console.time('Protobuf decode');
EmployeesType.decode(bufferProto);
console.timeEnd('Protobuf decode');

fs.writeFileSync('data.proto', bufferProto);

// Calcul des tailles des fichiers générés
const tailleJson = fs.statSync('data.json').size;
const tailleXml = fs.statSync('data.xml').size;
const tailleProto = fs.statSync('data.proto').size;

console.log('\nTaille des fichiers :');
console.log(`JSON     : ${tailleJson} octets`);
console.log(`XML      : ${tailleXml} octets`);
console.log(`Protobuf : ${tailleProto} octets`);
