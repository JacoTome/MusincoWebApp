const { access } = require("fs");

describe("Login", () => {
  it("should login", () => {
    var token = "";
    var userId = "";
    cy.request("POST", "http://localhost:3001/api/auth/signin", {
      username: "user",
      password: "user",
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("accessToken");
      expect(response.body).to.have.property("user");
      expect(response.body.user).to.have.property("id");
      token = response.body.accessToken;
      userId = response.body.user.id;
      cy.request({
        url: `http://localhost:3001/api/users/${userId}`,
        method: "GET",
        headers: {
          "x-access-token": token,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
      });
    });
  });
});
