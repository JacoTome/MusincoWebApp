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
  checkDuplicateUsernameOrEmail: function (username) {
    const query =
      PREFIX +
      ` SELECT *
      WHERE {
      ?user musinco:username "${username}";
      foaf:account ?account.
      ?account musinco:email ?email.
      }
      `;
    return decodeURI(query);
  },

  signin: function (username) {
    const query =
      PREFIX +
      ` SELECT ?password ?role
      WHERE {
      ?user musinco:username "${username}";
        foaf:account ?account.
        ?account musincoo:accountPwd ?password;
        musincoo:accountRole ?role. 
      }
      `;
    return decodeURI(query);
  },
  newUser: function (data) {
    const query =
      PREFIX +
      ` INSERT  {
        ?account a foaf:OnlineAccount;
            musincoo:accountPwd "${data.password}";
            musinco:email "${data.email}";
            musincoo:accountRole ?role.
        ?user a musico:HumanMusician.
        ?user foaf:account ?account;
            musinco:username "${data.username}";
      }
      WHERE {
        BIND(<http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Users/${data.id}> AS ?user).
        BIND(<http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Account/${data.id}> AS ?account).
        BIND(<http://www.semanticweb.org/jaco/ontologies/2023/7/musinco/Role/user> AS ?role).
      }
      `;
    return decodeURI(query);
  },
};
