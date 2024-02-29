const PREFIX = `PREFIX schema: <https://schema.org/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX musico: <http://purl.org/ontology/musico#> 
PREFIX musicoo: <http://purl.org/ontology/musico/>
PREFIX ex: <http://www.example.audio/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX event: <http://purl.org/NET/c4dm/event.owl#>
PREFIX musinco: <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/>
PREFIX musincoo: <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco#>
PREFIX schema: <https://schema.org/>
PREFIX mo: <http://purl.org/ontology/mo/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
`;

module.exports = {
  participation: function (data) {
    const query =
      PREFIX +
      ` DELETE DATA
            {
                <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/MusicianParticipation/${data.partID}>  musicoo:in_participation 
                <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Users/${data.id}> ;
            }
            `;
    return query;
  },
  genres: function (data) {
    const query =
      PREFIX +
      ` DELETE DATA
            {
                <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Users/${data.id}>  musico:plays_genre 
                <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Genre/${data.genre}> ;
            }
            `;
    return query;
  },
  instruments: function (data) {
    const query =
      PREFIX +
      ` DELETE DATA
            {
                <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Users/${data.id}>  musico:plays_instrument 
                <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Instrument/${data.instrument}> ;
            }
            `;
    return query;
  },
};
