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
PREFIX mo: <http://purl.org/ontology/mo/>
`;
module.exports = {
  users: function (id) {
    const query =
      PREFIX +
      ` SELECT *
      WHERE {
      BIND(<http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Users/${id}> AS ?user)
      ?user foaf:firstName ?firstName.
      OPTIONAL {?user foaf:surname ?surname}.
      OPTIONAL {?user musinco:username ?username}.
      OPTIONAL {?user musico:plays_instrument/schema:name ?instrument}.
        
    }
 
    
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
  userGenres: function (id) {
    const query =
      PREFIX +
      `SELECT ?genre
    WHERE {
    <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Users/${id}> musico:plays_genre/schema:name ?genre.
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
      SELECT DISTINCT ?others
      WHERE {
         # ?user sostituibile con [mo:uuid 1234]
        BIND(<http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Users/${id}> AS ?user)
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
  hourMood: function (hour) {
    const query =
      PREFIX +
      `
      SELECT ?mood
      WHERE {
        <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/hour_${hour}> musincoo:popular_mood ?mood .
      }
      LIMIT 10
    `;
    return decodeURI(query);
  },
  genreMood: function (genre) {
    const query =
      PREFIX +
      `
    SELECT ?mood
    WHERE {
      <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Genre/${genre}> musincoo:popular_mood ?mood .
    }
    LIMIT 10
  `;
    return decodeURI(query);
  },
  moodGenre: function (mood) {
    const query =
      PREFIX +
      `
    SELECT ?genre
    WHERE {
      ?genre musincoo:popular_mood <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/${mood}> .
    }
    LIMIT 10
  `;
    return decodeURI(query);
  },
  hourMoodGenre: function (hour) {
    const query =
      PREFIX +
      `
    SELECT ?mood ?genre_name ?genre
    WHERE {
      <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/hour_${hour}> musincoo:popular_mood ?mood .
         ?genre musincoo:popular_mood ?mood ;
         a mo:Genre;
         schema:name ?genre_name.

    }
  `;
    return decodeURI(query);
  },
  instrGenre: function (instr) {
    const query =
      PREFIX +
      `
    SELECT ?genre_name
    WHERE {
      <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Instrument/${instr}> musincoo:used_to_play/schema:name ?genre_name .

    }
  `;
    return decodeURI(query);
  },
};
