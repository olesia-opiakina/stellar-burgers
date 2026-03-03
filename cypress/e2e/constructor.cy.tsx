describe('Конструктор', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', {
      fixture: 'ingredients.json'
    });
    cy.visit('/');
  });

  it('Добавление ингредиентов', () => {
    cy.log('Выбор ингредиентов');
    cy.get('a[href="/ingredients/bun-id"]').as('bunLink');
    cy.get('a[href="/ingredients/main-id"]').as('mainLink');
    cy.get('a[href="/ingredients/sauce-id"]').as('sauceLink');

    cy.get('@bunLink').parent().find('button').click();
    cy.get('@mainLink').parent().find('button').click();
    cy.get('@sauceLink').parent().find('button').click();

    cy.log('Проверка счетчиков ингредиентов');
    cy.get('@bunLink').find('.counter__num').should('have.text', '2');
    cy.get('@mainLink').find('.counter__num').should('have.text', '1');
    cy.get('@sauceLink').find('.counter__num').should('have.text', '1');

    cy.log('Проверка добавления ингредиентов в конструктор бургера');
    cy.get('.constructor-element_pos_top').as('topBun');
    cy.get('@topBun')
      .find('.constructor-element__text')
      .should('have.text', 'Краторная булка N-200i (верх)');

    cy.get('@topBun').parent().parent().find('ul').as('ingredientList');
    cy.get('@ingredientList').children().should('have.length', 2);
    cy.get('@ingredientList')
      .children()
      .eq(0)
      .find('.constructor-element__text')
      .should('have.text', 'Биокотлета из марсианской Магнолии');
    cy.get('@ingredientList')
      .children()
      .eq(1)
      .find('.constructor-element__text')
      .should('have.text', 'Соус Spicy-X');

    cy.get('.constructor-element_pos_bottom')
      .find('.constructor-element__text')
      .should('have.text', 'Краторная булка N-200i (низ)');
  });

  it('Открытие и закрытие модального окна ингредиента', () => {
    cy.log('Открытие модального окна');
    cy.get('a[href="/ingredients/bun-id"]').click();

    cy.log('Проверка содержимого окна');
    cy.get('#modals').children().eq(0).as('modal');
    cy.get('@modal').should('be.visible');
    cy.get('@modal')
      .find('img')
      .should(
        'have.attr',
        'src',
        'https://code.s3.yandex.net/react/code/bun-02-large.png'
      );
    cy.get('@modal')
      .find('.text_type_main-medium')
      .should('have.text', 'Краторная булка N-200i');
    cy.get('@modal').contains('li', 'Калории').should('contain.text', '420');

    cy.log('Закрытие модального окна');
    cy.get('@modal').find('button').click();
    cy.get('#modals').children().should('have.length', 0);
  });
});

describe('Создание заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.intercept('GET', 'api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');
    cy.intercept('POST', 'api/orders', {
      fixture: 'orders.json'
    }).as('createOrder');
    cy.setCookie('accessToken', 'Bearer test-access-token');
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('refreshToken', 'test-refresh-token');
      }
    });
    cy.wait('@getIngredients');
    cy.wait('@getUser')
      .its('request.headers')
      .should('include', { authorization: 'Bearer test-access-token' });
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    cy.window().clearLocalStorage();
  });

  it('Оформление заказа', () => {
    cy.log('Добавление ингредиентов в конструктор');
    cy.get('a[href="/ingredients/bun-id"]').as('bunLink');
    cy.get('a[href="/ingredients/main-id"]').as('mainLink');
    cy.get('a[href="/ingredients/sauce-id"]').as('sauceLink');

    cy.get('@bunLink').parent().find('button').click();
    cy.get('@mainLink').parent().find('button').click();
    cy.get('@sauceLink').parent().find('button').click();
    cy.log('Оформление заказа');
    cy.contains('button', 'Оформить заказ').click();
    cy.wait('@createOrder')
      .its('request.headers')
      .should('include', { authorization: 'Bearer test-access-token' });

    cy.log('Проверка открытия модального окна заказа');
    cy.get('#modals').children().eq(0).as('orderModal');
    cy.get('@orderModal').should('be.visible');
    cy.get('@orderModal')
      .find('.text_type_digits-large')
      .should('have.text', '102183');

    cy.log('Закрытие модального окна');
    cy.get('@orderModal').find('button').click();
    cy.get('#modals').children().should('have.length', 0);

    cy.log('Проверка очистки конструктора бургера от добавленных ингредиентов');
    cy.get('.constructor-element_pos_top').should('not.exist');
    cy.get('.constructor-element_pos_bottom').should('not.exist');
    cy.contains('button', 'Оформить заказ')
      .closest('section')
      .should('not.contain.text', 'Биокотлета из марсианской Магнолии')
      .and('not.contain.text', 'Соус Spicy-X');

    cy.log('Проверка очистки счетчиков ингредиентов бургера');
    cy.get('@bunLink').find('.counter__num').should('not.exist');
    cy.get('@mainLink').find('.counter__num').should('not.exist');
    cy.get('@sauceLink').find('.counter__num').should('not.exist');
  });
});
