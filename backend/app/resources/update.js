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
  rewriteMusPref: function (data) {
    const query =
      PREFIX +
      ` DELETE  { <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Users/${data.id}>  musico:plays_genre ?genre .
        <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Users/${data.id}>  musico:plays_instrument ?instrument . 
      }
    WHERE {
      <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Users/${data.id}>  musico:plays_genre ?genre .
      <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Users/${data.id}>  musico:plays_instrument ?instrument .
    }`;
    return decodeURI(query);
  },
  users: function (data) {
    const query =
      PREFIX +
      ` INSERT DATA
         {
        <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Users/${data.id}> 
            musinco:username "${data.username}"^^xsd:string; 
            musinco:email "${data.email}"^^xsd:string;
            a musico:HumanMusician.
         }
        
        `;
    return decodeURI(query);
  },
  firstName: function (data) {
    const query =
      PREFIX +
      ` 
            DELETE  {<http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Users/${data.id}> foaf:firstName ?name}
            WHERE   {<http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Users/${data.id}> foaf:firstName ?name};
            INSERT   DATA {
               <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Users/${data.id}>
                 foaf:firstName "${data.name}"^^xsd:string.
            }
            
        
        `;
    return decodeURI(query);
  },
  surname: function (data) {
    const query =
      PREFIX +
      `
            DELETE  { <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Users/${data.id}>  foaf:surname ?name}
            WHERE {
                <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Users/${data.id}>  foaf:surname ?name
            };
            INSERT DATA {
            <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Users/${data.id}> 
                foaf:surname "${data.surname}"^^xsd:string}
        `;
    return decodeURI(query);
  },
  username: function (data) {
    const query =
      PREFIX +
      `
        DELETE  { <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Users/${data.id}>  musinco:username ?name}
        WHERE {
            <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Users/${data.id}>  musinco:username ?name
        };
        INSERT DATA {
        <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Users/${data.id}> 
            musinco:username "${data.username}"^^xsd:string}
    `;
    return decodeURI(query);
  },

  cityUser: function (data) {
    const query =
      PREFIX +
      ` 
      DELETE{
        <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Users/${data.id}> foaf:based_near ?posToDel.
      }
      INSERT
      {
      <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Users/${data.id}> foaf:based_near ?pos.
      }
      WHERE {
        <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Users/${data.id}> foaf:based_near ?posToDel.
        ?pos schema:containedIn <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/City/${data.city}>.
      }
      `;
    return decodeURI(query);
  },

  instrumentsUsers: function (data) {
    const query =
      PREFIX +
      ` INSERT DATA
         {
        <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Users/${data.id}> musico:plays_instrument 
        <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Instrument/${data.instrument}>.
         }
        
        `;
    return decodeURI(query);
  },
  instruments: function (data) {
    const query =
      PREFIX +
      ` INSERT DATA
         {
        <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Instrument/${data.id}> schema:name "${data.name}"^^xsd:string;
        a mo:Instrument.
         }
        
        `;
    return decodeURI(query);
  },
  genres: function (data) {
    const query =
      PREFIX +
      ` INSERT DATA
       {
      <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Genre/${data.id}> schema:name "${data.name}"^^xsd:string;
        a mo:Genre.
       }
      
      `;
    return decodeURI(query);
  },
  genreUser: function (data) {
    const query =
      PREFIX +
      ` INSERT DATA
     {
    <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Users/${data.id}> musico:plays_genre
    <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Genre/${data.genre}>.
     }
    `;
    return decodeURI(query);
  },
  participationUser: function (data) {
    const query =
      PREFIX +
      ` INSERT DATA
     {
    <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/MusicianParticipation/${data.partID}>  musicoo:in_participation 
    <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Users/${data.id}> ;
    musicoo:involved_event  <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/MusicalEvent/${data.eventID}> ;

    musicoo:played_instrument
    <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Instrument/${data.participation.instruments.value}> . 
            

     }
    `;
    return decodeURI(query);
  },
  friend: function (data) {
    const query =
      PREFIX +
      ` INSERT DATA
     {
    <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Users/${data.friend1}> foaf:knows
    <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Users/${data.friend2}> 
    `;
    return query;
  },

  event: function (data) {
    const query =
      PREFIX +
      ` INSERT DATA
     {
    <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/MusicalEvent/${data.id}> schema:name "${data.name}"^^xsd:string;
    a musicoo:MusicalEvent.
     }
    `;
    return decodeURI(query);
  },
  position: function (data) {
    const query =
      PREFIX +
      ` INSERT DATA
     {
    <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Position/${data.position_id}> a schema:GeoCoordinates;
    schema:latitude <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Number/${data.latitude}> ;
    schema:longitude <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Number/${data.longitude}>;
    schema:addressCountry <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Country/${data.country}>;
    schema:containedIn <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/City/${data.city}>.

    <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Number/${data.latitude}> a schema:Number.
    <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Number/${data.longitude}> a schema:Number.
    <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Country/${data.country}> a schema:Country.
    <http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/City/${data.city}> a schema:City;
    schema:name "${data.city}"^^xsd:string.


     }
    `;
    return decodeURI(query);
  },
};
