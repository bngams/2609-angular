describe("Navigation dans l'application", () => {
  it("affiche la page d'accueil", () => {
    cy.visit('/');
    cy.contains('h1', 'Bienvenue');
  });

  it('redirige vers la connexion quand on demande les produits', () => {
    cy.visit('/products');
    cy.contains('h1', 'Connexion');
  });
});
