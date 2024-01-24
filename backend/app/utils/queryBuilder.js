const PREFIX = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX musico: <http://purl.org/ontology/musico#> 
PREFIX ex: <http://www.example.audio/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX event: <http://purl.org/NET/c4dm/event.owl#>
PREFIX musinco: <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/>
PREFIX musincoo: <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco#>
PREFIX schema: <https://schema.org/>
PREFIX mo: <http://purl.org/ontology/mo/>
`;

module.exports = {
  user: (id) => {
    return `<http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Users/${id}> a musico:HumanMusician .`;
  },

  instrument: (id) => {
    return `<http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Instrument/${id}> a mo:Instrument.`;
  },

  genre: (id) => {
    return `<http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Genre/${id}> a mo:Genre.`;
  },

  musPart: (id) => {
    return `<http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/MusicianParticipation/${id} a musico:MusicianParticipation.`;
  },

  insert: (data) => {
    var query = PREFIX + `INSERT DATA {`;
    for (statement in data) {
      query.append(statement);
    }
    query.append("}");
    return decodeURI(query);
  },
};
