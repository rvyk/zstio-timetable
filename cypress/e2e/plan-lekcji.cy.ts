describe("Testing!", () => {
  beforeEach(() => {
    cy.viewport(1024, 768);
    cy.visit("http://localhost:3000");
  });

  it("Redirect on /class/1", () => {
    cy.url().should("include", "/class/1");
  });

  it("Checking dates format", () => {
    cy.get(`#desktopDateTest`).should("exist");
    cy.get("#desktopDateTest").then(($value) => {
      const textValue = $value.text();
      const generatedDate = textValue
        .split("Wygenerowano: ")[1]
        .split(" ")[0]
        .trim();
      const validDate = textValue.split("Obowiązuje od: ")[1].trim();
      cy.log(generatedDate, validDate);

      expect(generatedDate.split("-").length).eq(3);
      expect(validDate.split("-").length).eq(3);
    });
  });

  it("Checking substitutions", () => {
    cy.request("https://zastepstwa.zstiojar.edu.pl/api/getSubstitutions")
      .as("request")
      .its("body")
      .should("have.property", "tables")
      .and("be.an", "array");

    cy.get("@request")
      .its("body.tables[0]")
      .should("have.property", "zastepstwa")
      .and("be.an", "array");

    cy.get("@request")
      .its("body.tables[0].zastepstwa[0]")
      .as("exampleSubstitution");

    //@ts-ignore
    cy.get("@exampleSubstitution").then((substitution: substitutionType) => {
      const branch = substitution.branch.includes("|")
        ? substitution.branch.split("|")[0]
        : substitution.branch;

      cy.get("#dropdownClass > ul")
        .children()
        .each((list) => {
          if (list.text() === branch) {
            cy.wrap(list)
              .find("a")
              .first()
              .as("target")
              .should("have.attr", "href");

            cy.get("@target")
              .invoke("attr", "href")
              .then((href) => {
                cy.visit("http://localhost:3000" + href);
                cy.get("#substitutionAvailableTest")
                  .should("exist")
                  .then(() => {
                    cy.get("#substitutionAvailableTest").then((divs) => {
                      cy.log(
                        `Displayed: ${divs.length} substitution for the branch: ${branch}`
                      );
                    });
                  });
              });
          }
        });
    });
  });
});
