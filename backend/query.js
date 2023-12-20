const PREFIX = `PREFIX schema: <https://schema.org/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX musico: <http://purl.org/ontology/musico#> 
PREFIX ex: <http://www.example.audio/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX event: <http://purl.org/NET/c4dm/event.owl#>
PREFIX musinco: <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/>
PREFIX musincoo: <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco#>
PREFIX schema: <https://schema.org/>
`;
module.exports = {
  users: function (id) {
    const query =
      PREFIX +
      ` SELECT *
    WHERE {
    <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Users/${id}> foaf:firstName ?name;
        foaf:lastName ?surname;
      musico:plays_instrument/schema:name ?instrument;
        
    }
    LIMIT 10
    
    `;
    return decodeURI(query);
  },
  instrument: function (id) {
    const query =
      PREFIX +
      `SELECT ?name ?used_to_play
    SELECT *
    WHERE {
    <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Instrument/${id}> schema:name ?name;
    musincoo:used_to_play ?used_to_play.
        
    }
    LIMIT 10
    
    `;
    return decodeURI(query);
  },
  genres: function (id) {
    const query =
      PREFIX +
      `SELECT ?name
    WHERE {
    <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Genre/${id}> schema:name ?name.
        
    }
    LIMIT 10
    
    `;
    return decodeURI(query);
  },
  suggestedUsers: function (id) {
    const query =
      PREFIX +
      `
      SELECT DISTINCT ?others ?name ?surname
      WHERE {
         # ?user sostituibile con [mo:uuid 1234]
         #BIND(<http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Users/${id}> AS ?user)
        ?user foaf:based_near ?location ;
              musico:plays_genre ?genre .
        ?others foaf:based_near ?location ;
               # musico:plays_genre ?genre ;  
        # musico:plays_genre [ mo:similar_to ?genre ] .
                foaf:firstName ?name ;
                foaf:lastName ?surname ;
             #   musico:plays_instrument ?instrument ;
             #   musico:plays_genre ?genre ;
        FILTER (?user != ?others)
      } 
      LIMIT 10
    `;
    return decodeURI(query);
  },
};
