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
PREFIX time: <http://www.w3.org/2006/time#>
PREFIX mo: <http://purl.org/ontology/mo/>
`;
module.exports = {
  users: function (id) {
    const query =
      PREFIX +
      ` SELECT *
      WHERE {
      BIND(<http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Users/${id}> AS ?user)
      ?user musinco:username ?username;
      OPTIONAL {?user foaf:firstName ?name}.
      OPTIONAL {?user foaf:surname ?surname}.
      OPTIONAL {?user musinco:username ?username}.
      OPTIONAL {?user musico:plays_instrument ?instrument.
      ?instrument schema:name ?instrument_name.}.
      OPTIONAL {?user musico:plays_genre ?genre.
      ?genre schema:name ?genre_name}.
      OPTIONAL {?user foaf:based_near/schema:containedIn/schema:name ?city}.
    }
    `;
    return query;
  },
  searchUsers: function (data) {
    const query =
      PREFIX +
      ` SELECT *
      WHERE {
      ?user a musico:HumanMusician;
      OPTIONAL {?user musico:plays_instrument <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Instrument/${data.instruments[0].value}> }.
      OPTIONAL {?user musico:plays_genre <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Genre/${data.genres[0].value}> }.
      OPTIONAL {?user foaf:based_near/schema:containedIne <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/City/${data.city.value}> }.
    }
    `;
    return query;
  },

  instrument: function (id) {
    const query =
      PREFIX +
      `SELECT *
    WHERE {
    <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Instrument/${id}> schema:name ?name.
    OPTIONAL {<http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Instrument/${id}> musincoo:used_to_play/schema:name ?used_to_play} .
        
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
                musico:plays_genre ?genre ;  
        
           
                musico:plays_instrument ?instrument ;
                musico:plays_genre ?genre ;
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

  cityByName: function (name) {
    const query =
      PREFIX +
      `SELECT ?id ?name
    WHERE {
      ?id a schema:City;
      schema:name ?name.
      FILTER regex(?name, "(${name})", "i")
    }
  `;
    return query;
  },
  genreByName: function (name) {
    const query =
      PREFIX +
      `SELECT ?id ?name
    WHERE {
      ?id a mo:Genre;
      schema:name ?name.
      FILTER regex(?name, "(${name})", "i")
    }
  `;
    return query;
  },

  instrumentByName: function (name) {
    const query =
      PREFIX +
      `
    SELECT ?id ?name
    WHERE {
      ?id a mo:Instrument;
      schema:name ?name.
      FILTER regex(?name, "(${name})", "i")
    }
  `;
    return query;
  },

  eventByName: function (name) {
    const query =
      PREFIX +
      `
    SELECT ?id ?name
    WHERE {
      ?id a musicoo:MusicalEvent;
      schema:name ?name.
      FILTER regex(?name, "(${name})", "i")
    }
  `;
    return query;
  },

  musicianParticipation: function (data) {
    const query =
      PREFIX +
      `
    SELECT *
    WHERE {
      ?part  musicoo:in_participation <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Users/${data.userID}> ;
      musicoo:involved_event ?event .
     OPTIONAL{?part musicoo:expressed_emotion ?ex_emotion }.
     OPTIONAL{?part musicoo:expressed_mood ?ex_mood }.
     OPTIONAL{?part musicoo:felt_emotion ?felt_emotion }.
     OPTIONAL{?part musicoo:felt_mood ?felt_mood }.
     OPTIONAL{?part musicoo:played_instrument ?instruments }.
      OPTIONAL{?instruments schema:name ?instruments_name }.


      
       OPTIONAL {?event schema:address ?location}.
     OPTIONAL{?event time:day ?date }.
     OPTIONAL{?event time:hour ?hour }.
     OPTIONAL{?event time:minute ?minute }.
       OPTIONAL {?event schema:name ?event_name} .

       OPTIONAL{ ?part musicoo:played_instrument/schema:name ?instruments } .

    }
  `;
    return query;
  },
};
