describe("Testing!", () => {
  beforeEach(() => {
    cy.viewport(1024, 768);
    cy.visit("http://localhost:3000");
  });

  it("redirect na class 1", () => {
    cy.url().should("include", "/class/1");
  });

  it("sprawdz daty", () => {
    cy.get(`#desktopDateTest`).should("exist");
    cy.get("#desktopDateTest").then(($value) => {
      const textValue = $value.text();
      const generatedDate = textValue
        .split("Wygenerowano: ")[1]
        .split(" ")[0]
        .trim();
      const obowiazujeDate = textValue.split("Obowiązuje od: ")[1].trim();
      cy.log(generatedDate, obowiazujeDate);

      expect(generatedDate.split("-").length).eq(3);
      expect(obowiazujeDate.split("-").length).eq(3);
    });
  });

  it("sprawdz zastepstwa", () => {
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
      .as("exampleZastepstwo");

    //@ts-ignore
    cy.get("@exampleZastepstwo").then((zastepstwo: substitutionType) => {
      const klasa = zastepstwo.branch.includes("|")
        ? zastepstwo.branch.split("|")[0]
        : zastepstwo.branch;

      cy.get("#dropdownClass > ul")
        .children()
        .each((lista) => {
          if (lista.text() === klasa) {
            cy.wrap(lista)
              .find("a")
              .first()
              .as("target")
              .should("have.attr", "href");

            cy.get("@target")
              .invoke("attr", "href")
              .then((href) => {
                cy.visit("http://localhost:3000" + href);
                cy.get("#substitutionAvalibleTest")
                  .should("exist")
                  .then(() => {
                    cy.get("#substitutionAvalibleTest").then((divs) => {
                      cy.log(
                        `wyswietlono ${divs.length} zastepstwo dla klasy ${klasa}`
                      );
                    });
                  });
              });
          }
        });
    });
  });
});
