describe('Connexion et panier', () => {
  it('se connecte, voit les produits et remplit le panier', () => {
    cy.visit('/products');

    // La garde nous a renvoyés vers la page de connexion.
    cy.contains('h1', 'Connexion');

    cy.get('input[formcontrolname="username"]').type('boris');
    cy.get('input[formcontrolname="password"]').type('demo');
    cy.contains('button', 'Se connecter').click();

    // On arrive sur la page produits.
    cy.url().should('include', '/products');
    cy.contains('h1', 'Nos produits');

    // Le panier démarre à 0, puis s'incrémente au clic sur BUY.
    cy.get('.mat-badge-content').should('contain', '0');
    cy.contains('button', 'BUY').click();
    cy.get('.mat-badge-content').should('contain', '1');
  });
});
