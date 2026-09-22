# L6 — Requêtes HTTP

> 🟠 **Parcours LEGACY** — `NgModule` et RxJS.
> Chapitre équivalent en MODERN : [M6](../MODERN/M6-HTTP.md).

**Scénario à réaliser en autonomie.** Vos produits sont écrits en dur. Vous allez les charger
depuis un vrai serveur. Le guidage **redevient complet** : les observables sont une notion
neuve, et sans doute la plus déroutante d'Angular. On prend le temps.

## ✨ Objectifs

- Lancer une fausse API en local en une commande
- Brancher le client HTTP d'Angular
- Comprendre ce qu'est un **observable**, et pourquoi il ne se passe rien sans `subscribe`
- Consommer un flux avec le pipe `async`
- Découvrir les opérateurs RxJS

## 📁 Point de départ

Le projet du [chapitre 5](L5-FORMS-INTERACTIONS.md) : formulaire et panier fonctionnels,
liste encore écrite en dur.

---

## 🗄️ 1 — Une API en local avec json-server

Pas besoin d'un vrai backend : **json-server** transforme un fichier JSON en API REST.

```bash
npm install -D json-server@0.17.4
```

> ⚠️ **Pourquoi figer la version `0.17.4` ?**
> La version publiée sous l'étiquette `latest` est actuellement une **bêta** (`1.0.0-beta.x`),
> dont la ligne de commande diffère. `npm install json-server` sans précision installerait
> cette bêta, et les commandes de ce chapitre échoueraient.

Créez **`data/db.json`** à la racine du projet :

```json
{
  "products": [
    { "id": 1, "name": "Clavier mécanique", "price": 89 },
    { "id": 2, "name": "Souris ergonomique", "price": 45 },
    { "id": 3, "name": "Écran 27 pouces", "price": 249 }
  ]
}
```

Ajoutez un script dans **`package.json`**, section `"scripts"` :

```json
"serve-api": "json-server --watch data/db.json --port 3004"
```

Lancez l'API dans un **troisième terminal** :

```bash
npm run serve-api
```

> 💡 **Tester :** le terminal affiche
> ```
>   \{^_^}/ hi!
>   Loading data/db.json
>   Done
>
>   Resources
>   http://localhost:3004/products
> ```
> Ouvrez <http://localhost:3004/products> : vos trois produits s'affichent en JSON.

Chaque clé du fichier devient une ressource REST :

| Méthode | URL | Effet |
|---|---|---|
| `GET` | `/products` | Liste tous les produits |
| `GET` | `/products/1` | Le produit d'identifiant 1 |
| `POST` | `/products` | Crée un produit (et lui attribue un `id`) |
| `DELETE` | `/products/1` | Supprime le produit 1 |

---

## 🔌 2 — Brancher le client HTTP

Angular fournit `HttpClient`. Il faut d'abord le déclarer — dans `AppModule`.

🚧 **À compléter** — `src/app/app-module.ts` :

```ts
// TODO : importer provideHttpClient depuis '@angular/common/http'

@NgModule({
  declarations: [App, Header, Home, About, NotFound],
  imports: [BrowserModule, AppRoutingModule, MaterialModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    // TODO : ajouter provideHttpClient()
  ],
  bootstrap: [App],
})
export class AppModule {}
```

> ℹ️ **`provideHttpClient()` plutôt que `HttpClientModule`.** Les tutoriels plus anciens
> ajoutent `HttpClientModule` aux `imports`. Cela fonctionne encore, mais Angular le marque
> explicitement comme **déprécié** — son code source indique : *« use
> `provideHttpClient(withInterceptorsFromDi())` as providers instead »*. La forme `provide…()`
> est donc la bonne, y compris dans un projet à modules. Notez qu'elle va dans **`providers`**,
> pas dans `imports`.
>
> *(Le `withInterceptorsFromDi()` n'est utile que si vous déclarez des intercepteurs à
> l'ancienne, via `HTTP_INTERCEPTORS` — voir [BONUS.md](../BONUS.md). `provideHttpClient()`
> seul suffit ici.)*

> ⚠️ **Piège — l'oubli qui coûte dix minutes.**
> - *Symptôme :* `NullInjectorError: No provider for HttpClient!`
> - *Cause :* un service demande `HttpClient`, jamais déclaré.
> - *Correctif :* ajouter `provideHttpClient()` dans les `providers` d'`AppModule`.

> 📖 [Configurer HttpClient](https://angular.dev/guide/http/setup)

---

## 🌊 3 — Les observables, en prenant le temps

Voici la notion à bien saisir.

Une requête HTTP prend du temps : on ne peut pas écrire `const p = http.get(...)` et
travailler immédiatement sur `p`. Il faut un moyen de dire « quand la réponse arrivera, fais
ceci ». Angular utilise les **observables** de RxJS.

| Objet | Analogie |
|---|---|
| Une **valeur** (`42`) | Un colis posé sur la table |
| Une **promesse** (`Promise`) | Un colis en cours de livraison — **une seule fois** |
| Un **observable** | Un **abonnement** : zéro, une, ou mille livraisons dans le temps |

### Le point qui surprend tout le monde

**Un observable est « froid » : tant que personne ne s'y abonne, il ne se passe rien.**

```ts
this.http.get<Product[]>(url);                  // ❌ aucune requête envoyée !
this.http.get<Product[]>(url).subscribe(...);   // ✅ maintenant, oui
```

Un observable n'est pas la requête : c'est la **recette** de la requête. `subscribe()`
l'exécute.

> **🧪 Manip — le prouver**
>
> 1. Dans `product-dashboard.ts`, ajoutez temporairement :
>    ```ts
>    ngOnInit() {
>      this.productService.getProducts();   // sans subscribe
>    }
>    ```
> 2. Ouvrez l'onglet **Réseau** (`F12`), filtrez sur **Fetch/XHR**, rechargez.
>
> *Observé : aucune requête vers `localhost:3004`. Ajoutez `.subscribe(d => console.log(d))`
> et rechargez : la requête apparaît, et les données s'affichent dans la console.*

Le pipe `async` du chapitre 5 fait exactement cela : **il s'abonne pour vous**. C'est pour
cette raison qu'il déclenche la requête.

> 📖 [Observables (RxJS)](https://rxjs.dev/guide/observable)

---

## 🛠️ 4 — Le service produit

🚧 **À compléter** — `src/app/modules/product/services/product.ts` :

```ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

const API_URL = 'http://localhost:3004/products';

@Injectable({ providedIn: 'root' })
export class ProductService {
  // Injection par constructeur : la forme historique.
  constructor(private httpClient: HttpClient) {}

  /** Récupère la liste des produits. */
  getProducts(): Observable<Product[]> {
    // TODO : renvoyer this.httpClient.get<Product[]>(API_URL)
  }

  /** Envoie un nouveau produit au serveur. */
  addProduct(product: Product): Observable<Product> {
    // TODO : renvoyer this.httpClient.post<Product>(API_URL, product)
  }
}
```

| Écriture | Rôle |
|---|---|
| `get<Product[]>(...)` | Le `<Product[]>` **type** la réponse |
| `Observable<Product[]>` | Un flux qui livrera un tableau de produits |

> ℹ️ Le `<Product[]>` est une **promesse faite au compilateur**, pas une vérification à
> l'exécution. Si le serveur renvoie autre chose, TypeScript n'y verra rien — d'où
> l'importance de tester pour de vrai.

---

## 📺 5 — Consommer le flux avec le pipe `async`

En LEGACY, la façon idiomatique est le pipe `async` découvert au chapitre 5 : il s'abonne,
**et se désabonne**, tout seul.

L'idée : le composant ne stocke plus un tableau, mais **un observable de tableau**.

🚧 **À compléter** — `product-dashboard.ts` :

```ts
import { Component, OnInit } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product';
import { CartService } from '../../../cart/services/cart';

@Component({
  selector: 'app-product-dashboard',
  standalone: false,
  templateUrl: './product-dashboard.html',
  styleUrl: './product-dashboard.scss',
})
export class ProductDashboard implements OnInit {
  /** Le flux consommé dans le gabarit via le pipe async. */
  products$!: Observable<Product[]>;

  /** Produits ajoutés localement, pas encore rechargés depuis l'API. */
  localProducts: Product[] = [];

  error: string | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
  ) {}

  ngOnInit(): void {
    // TODO : affecter products$ avec this.productService.getProducts(),
    //        en interceptant l'erreur :
    //
    //        this.products$ = this.productService.getProducts().pipe(
    //          catchError(() => {
    //            this.error = "API injoignable : lancez `npm run serve-api`.";
    //            return of([]);      // on renvoie une liste vide plutôt que planter
    //          }),
    //        );
  }

  onAdd(product: Product): void {
    this.localProducts = [...this.localProducts, product];
    // TODO : envoyer aussi le produit au serveur avec addProduct(...).subscribe()
  }

  onBuy(product: Product): void {
    this.cartService.add(product);
  }
}
```

🚧 **À compléter** — `product-dashboard.html` :

```html
<h1>Nos produits</h1>

@if (error) {
  <p class="error">{{ error }}</p>
}

<app-product-form (add)="onAdd($event)" />

<!-- Le pipe async s'abonne et se désabonne tout seul.
     La syntaxe « as products » donne un nom à la valeur reçue. -->
@if (products$ | async; as products) {
  <!-- TODO : passer products.concat(localProducts) à <app-product-list>
       et écouter sa sortie (buy) -->
}
```

**`product-dashboard.scss`** :

```scss
.error {
  color: #b3261e;
}
```

Deux nouveautés :

| Élément | Rôle |
|---|---|
| `catchError(...)` | Intercepte une erreur du flux et renvoie une valeur de repli |
| `of([])` | Crée un observable qui émet immédiatement `[]` |
| `products$ \| async; as products` | S'abonne, et nomme `products` la valeur reçue |

### `ngOnInit`, et pas le constructeur

`ngOnInit` est un **crochet de cycle de vie** : Angular l'appelle une fois le composant
initialisé. C'est l'endroit conventionnel pour déclencher un chargement — le constructeur
reste réservé à l'injection des dépendances.

> 💡 **Tester :** rechargez `/products`. Les produits de `db.json` s'affichent. Modifiez un
> prix dans le fichier, rechargez : le changement apparaît. **Les données viennent du serveur.**
>
> Arrêtez json-server (`Ctrl+C`) et rechargez : le message d'erreur s'affiche au lieu d'une
> page blanche.

---

## 🌉 Ouverture — Les opérateurs RxJS

Un observable peut être **transformé avant** d'être consommé, au moyen d'opérateurs chaînés
dans un `pipe()`. Vous venez d'en utiliser un : `catchError`.

```ts
getCheapProducts(): Observable<Product[]> {
  return this.httpClient.get<Product[]>(API_URL).pipe(
    map((products) => products.filter((p) => p.price < 100)),
  );
}
```

Les plus courants :

| Opérateur | Ce qu'il fait | Exemple d'usage |
|---|---|---|
| `map` | Transforme chaque valeur émise | Extraire un champ, filtrer un tableau |
| `filter` | Ne laisse passer que certaines valeurs | Ignorer les frappes de moins de 3 caractères |
| `switchMap` | Enchaîne sur un autre observable, **en annulant le précédent** | Une recherche : seule la dernière requête compte |
| `catchError` | Intercepte une erreur | Renvoyer une liste vide plutôt que planter |
| `shareReplay` | Partage une même réponse entre plusieurs abonnés | Éviter N requêtes identiques |
| `debounceTime` | Attend une pause avant d'émettre | Ne pas interroger le serveur à chaque touche |
| `tap` | Exécute un effet de bord sans rien changer | Journaliser pour déboguer |

Deux méritent un mot :

**`switchMap`** — dans une barre de recherche, l'utilisateur tape « cla », « clav »,
« clavi »… Sans lui, trois requêtes partent et les réponses peuvent revenir dans le désordre.
`switchMap` annule les précédentes : seule la dernière compte.

**`shareReplay`** — un même observable consommé par **trois** pipes `async` déclenche
**trois** requêtes HTTP (souvenez-vous : chaque abonnement exécute la recette). `shareReplay(1)`
partage la réponse entre tous les abonnés.

> 📖 [Les opérateurs RxJS](https://rxjs.dev/guide/operators) ·
> [learnrxjs.io](https://www.learnrxjs.io/) (exemples commentés)

### Et les signaux ?

RxJS a longtemps été **le** moyen de gérer l'asynchrone et l'état dans Angular. Depuis les
signaux (parcours [MODERN](../MODERN/M6-HTTP.md)), le partage s'est clarifié :

| Besoin | Outil recommandé aujourd'hui |
|---|---|
| État local d'un composant | **Signaux** — plus simples |
| Valeur dérivée d'une autre | **`computed()`** |
| Flux d'événements dans le temps | **RxJS** |
| Requête HTTP ponctuelle | Les deux conviennent |

Les deux coexistent, et `toSignal()` / `toObservable()` permettent de passer de l'un à
l'autre — utile pour moderniser progressivement une application existante.

---

## 🎉 Challenge final

- [ ] `npm run serve-api` sert les produits sur <http://localhost:3004/products>
- [ ] `/products` affiche les produits **venant du serveur**
- [ ] Modifier `db.json` et recharger change l'affichage
- [ ] Ajouter un produit via le formulaire l'écrit dans `db.json`
- [ ] Couper l'API affiche un message d'erreur, pas une page blanche
- [ ] Vous savez expliquer pourquoi le pipe `async` déclenche la requête

## ✅ Bonus

- Ajoutez `deleteProduct(id: number)` au service et un bouton de suppression sur chaque carte.
- Après un ajout, rechargez la liste depuis le serveur plutôt que de maintenir
  `localProducts`. *(Piste : réaffecter `products$` après le `subscribe` du `addProduct`.)*

## Récap

- **json-server** transforme un fichier JSON en API REST complète.
- `provideHttpClient()` va dans les **`providers`** d'`AppModule` ; son oubli donne
  `No provider for HttpClient`.
- Un **observable est froid** : sans abonnement, aucune requête ne part. Le pipe `async`
  s'abonne pour vous.
- `catchError` + `of([])` évitent qu'une API éteinte casse la page.
- Les **opérateurs** RxJS transforment un flux avant consommation.

➡️ **Chapitre suivant : [L7 — Authentification et garde](L7-AUTH.md)**
