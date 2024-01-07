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
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
`;
module.exports = {
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
    }

}