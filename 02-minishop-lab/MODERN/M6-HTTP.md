# M6 — Requêtes HTTP

> 🟢 **Parcours MODERN** — composants autonomes et signaux.
> Chapitre équivalent en LEGACY : [L6](../LEGACY/L6-HTTP.md).

**Scénario à réaliser en autonomie.** Vos produits sont écrits en dur dans le code. Vous
allez les charger depuis un vrai serveur. Le guidage **redevient complet** : les flux de
données (*observables*) sont une notion neuve, et sans doute la plus déroutante d'Angular.
On prend le temps.

## ✨ Objectifs

- Lancer une fausse API en local en une commande
- Brancher le client HTTP d'Angular
- Comprendre ce qu'est un **observable**, et pourquoi il ne se passe rien sans `subscribe`
- Consommer un flux de trois façons, et savoir laquelle choisir
- Découvrir quelques opérateurs RxJS, et l'alternative `httpResource`

## 📁 Point de départ

Le projet du [chapitre 5](M5-FORMS-INTERACTIONS.md) : formulaire et panier fonctionnels,
liste encore écrite en dur.

---

## 🗄️ 1 — Une API en local avec json-server

Pas besoin d'un vrai backend : **json-server** transforme un fichier JSON en API REST
complète.

Installez-le dans le projet :

```bash
npm install -D json-server@0.17.4
```

> ⚠️ **Pourquoi figer la version `0.17.4` ?**
> La version publiée sous l'étiquette `latest` est actuellement une **bêta** (`1.0.0-beta.x`),
> dont la ligne de commande diffère. `npm install json-server` sans précision installerait
> cette bêta, et les commandes de ce chapitre échoueraient. On fige donc une version stable.

Créez le fichier de données — **`data/db.json`** à la racine du projet :

```json
{
  "products": [
    { "id": 1, "name": "Clavier mécanique", "price": 89 },
    { "id": 2, "name": "Souris ergonomique", "price": 45 },
    { "id": 3, "name": "Écran 27 pouces", "price": 249 }
  ]
}
```

Ajoutez un script dans **`package.json`**, dans la section `"scripts"` :

```json
"serve-api": "json-server --watch data/db.json --port 3004"
```

Lancez l'API dans un **troisième terminal** (gardez `npm start` dans le premier) :

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

Chaque clé du fichier devient une ressource REST complète :

| Méthode | URL | Effet |
|---|---|---|
| `GET` | `/products` | Liste tous les produits |
| `GET` | `/products/1` | Le produit d'identifiant 1 |
| `POST` | `/products` | Crée un produit (et lui attribue un `id`) |
| `DELETE` | `/products/1` | Supprime le produit 1 |

> ℹ️ json-server **écrit réellement** dans `db.json`. Vos ajouts survivront au redémarrage.

---

## 🔌 2 — Brancher le client HTTP

Angular fournit `HttpClient` pour dialoguer avec une API. Il faut d'abord le déclarer.

🚧 **À compléter** — `src/app/app.config.ts` :

```ts
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
// TODO : importer provideHttpClient depuis '@angular/common/http'
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // TODO : ajouter provideHttpClient()
  ],
};
```

> ⚠️ **Piège — l'oubli qui coûte dix minutes.**
> - *Symptôme :* `NullInjectorError: No provider for HttpClient!` dans la console.
> - *Cause :* un service demande `HttpClient`, mais celui-ci n'a jamais été déclaré.
> - *Correctif :* ajouter `provideHttpClient()` dans `app.config.ts`. C'est **la** cause dans
>   la quasi-totalité des cas.

> 📖 [Configurer HttpClient](https://angular.dev/guide/http/setup)

---

## 🌊 3 — Les observables, en prenant le temps

Voici la notion à bien saisir.

Une requête HTTP prend du temps : on ne peut pas écrire `const p = http.get(...)` et
travailler immédiatement sur `p`. Il faut un moyen de dire « quand la réponse arrivera, fais
ceci ». Angular utilise pour cela les **observables** de la bibliothèque RxJS.

Une image utile :

| Objet | Analogie |
|---|---|
| Une **valeur** (`42`) | Un colis posé sur la table |
| Une **promesse** (`Promise`) | Un colis en cours de livraison — **une seule fois** |
| Un **observable** | Un **abonnement** : zéro, une, ou mille livraisons dans le temps |

### Le point qui surprend tout le monde

**Un observable est « froid » : tant que personne ne s'y abonne, il ne se passe rien.**

```ts
this.http.get<Product[]>(url);            // ❌ aucune requête n'est envoyée !
this.http.get<Product[]>(url).subscribe(...);  // ✅ maintenant, oui
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

> 📖 [Observables (RxJS)](https://rxjs.dev/guide/observable)

---

## 🛠️ 4 — Le service produit

Le service sait parler au serveur ; il ne sait rien de l'affichage.

🚧 **À compléter** — `src/app/modules/product/services/product.ts` :

```ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

const API_URL = 'http://localhost:3004/products';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);

  /** Récupère la liste des produits. */
  getProducts(): Observable<Product[]> {
    // TODO : renvoyer this.http.get<Product[]>(API_URL)
  }

  /** Envoie un nouveau produit au serveur. */
  addProduct(product: Product): Observable<Product> {
    // TODO : renvoyer this.http.post<Product>(API_URL, product)
  }
}
```

Deux détails qui comptent :

| Écriture | Rôle |
|---|---|
| `get<Product[]>(...)` | Le `<Product[]>` **type** la réponse : l'éditeur saura ce qu'elle contient |
| `Observable<Product[]>` | Le type de retour : un flux qui livrera un tableau de produits |

> ℹ️ Le `<Product[]>` est une **promesse faite au compilateur**, pas une vérification à
> l'exécution. Si le serveur renvoie autre chose, TypeScript n'y verra rien — d'où
> l'importance de tester pour de vrai.

---

## 📺 5 — Consommer le flux dans la page

Trois écritures possibles. Nous allons utiliser la première, mais il faut connaître les trois.

### a. `subscribe()` — explicite

```ts
this.productService.getProducts().subscribe((products) => {
  this.products.set(products);
});
```

On s'abonne, et quand les données arrivent on remplit le signal. C'est le plus lisible quand
on débute : chaque étape est visible.

### b. Le *pipe* `async` — dans le gabarit

```html
@if (products$ | async; as products) {
  <app-product-list [products]="products" />
}
```

Angular s'abonne **et se désabonne** tout seul. Très courant dans le code existant — c'est la
forme retenue par le parcours LEGACY.

### c. `firstValueFrom()` — en promesse

```ts
const products = await firstValueFrom(this.productService.getProducts());
```

Pratique si vous êtes à l'aise avec `async/await`.

> ⚠️ **`toPromise()` est déprécié.** Les tutoriels d'avant 2023 utilisent `.toPromise()`.
> La méthode existe encore dans RxJS 7 (celle du projet) mais elle est **dépréciée**, et sera
> retirée dans RxJS 8. Utilisez `firstValueFrom()` : même usage, et son comportement est plus
> clair quand le flux se termine sans rien émettre.

### Mise en œuvre

🚧 **À compléter** — `product-dashboard.ts` *(le décorateur `@Component` reste inchangé ;
seuls les imports et le corps de la classe évoluent)* :

```ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product';
import { CartService } from '../../../cart/services/cart';

export class ProductDashboard implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  // La liste démarre VIDE : elle sera remplie par le serveur.
  readonly products = signal<Product[]>([]);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    // TODO : appeler getProducts() et s'y abonner.
    //        En cas de succès  -> this.products.set(products)
    //        En cas d'erreur   -> this.error.set("API injoignable : lancez `npm run serve-api`.")
    //
    //        Forme attendue :
    //        this.productService.getProducts().subscribe({
    //          next: (products) => ...,
    //          error: () => ...,
    //        });
  }

  onAdd(product: Product): void {
    this.products.update((list) => [...list, product]);
    // TODO : envoyer aussi le produit au serveur avec addProduct(...).subscribe()
  }

  onBuy(product: Product): void {
    this.cartService.add(product);
  }
}
```

Affichez le message d'erreur — `product-dashboard.html`, avant le formulaire :

```html
@if (error(); as message) {
  <p class="error">{{ message }}</p>
}
```

**`product-dashboard.scss`** :

```scss
.error {
  color: #b3261e;
}
```

### `ngOnInit`, et pas le constructeur

`ngOnInit` est un **crochet de cycle de vie** : Angular l'appelle une fois le composant
initialisé. C'est l'endroit conventionnel pour déclencher un chargement — le constructeur,
lui, doit rester réservé à la mise en place des dépendances.

> 💡 **Tester :** rechargez `/products`. Les trois produits du fichier `db.json` s'affichent.
> Modifiez un prix dans `db.json`, rechargez : le changement apparaît. **Les données viennent
> bien du serveur.**
>
> Arrêtez maintenant json-server (`Ctrl+C`) et rechargez : le message d'erreur s'affiche au
> lieu d'une page blanche. Gérer l'erreur n'est pas un luxe.

---

## 🌉 Ouverture 1 — Les opérateurs RxJS

Un observable peut être **transformé avant** d'être consommé, au moyen d'opérateurs chaînés
dans un `pipe()`. C'est toute la puissance de RxJS.

```ts
getCheapProducts(): Observable<Product[]> {
  return this.http.get<Product[]>(API_URL).pipe(
    map((products) => products.filter((p) => p.price < 100)),
  );
}
```

Les opérateurs les plus courants :

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

**`shareReplay`** — souvenez-vous qu'un observable est froid : **chaque** abonnement rejoue la
recette. Un même observable consommé par trois endroits déclenche donc **trois** requêtes HTTP.
`shareReplay(1)` partage la réponse entre tous les abonnés.

> 📖 [Les opérateurs RxJS](https://rxjs.dev/guide/operators) ·
> [learnrxjs.io](https://www.learnrxjs.io/) (exemples commentés)

### Et les signaux dans tout ça ?

RxJS a longtemps été **le** moyen de gérer l'asynchrone et l'état dans Angular. Depuis les
signaux, le partage s'est clarifié :

| Besoin | Outil recommandé aujourd'hui |
|---|---|
| État local d'un composant (liste affichée, compteur) | **Signaux** — plus simples |
| Valeur dérivée d'une autre | **`computed()`** |
| Flux d'événements dans le temps (frappe clavier, WebSocket) | **RxJS** |
| Requête HTTP ponctuelle | Les deux conviennent |

Les deux coexistent, et `toSignal()` / `toObservable()` permettent de passer de l'un à
l'autre.

---

## 🌉 Ouverture 2 — `httpResource`, la version signaux

Angular propose désormais une alternative entièrement fondée sur les signaux :

```ts
import { httpResource } from '@angular/common/http';

readonly productsResource = httpResource<Product[]>(() => 'http://localhost:3004/products');
```

Dans le gabarit, tout est déjà là — données, chargement, erreur :

```html
@if (productsResource.isLoading()) {
  <p>Chargement…</p>
} @else if (productsResource.error()) {
  <p class="error">Erreur de chargement.</p>
} @else {
  <app-product-list [products]="productsResource.value() ?? []" />
}
```

| | `HttpClient` + `subscribe` | `httpResource` |
|---|---|---|
| Ce qu'on manipule | Un observable | Des signaux |
| État de chargement | À gérer soi-même | **Fourni** (`isLoading()`) |
| Gestion d'erreur | À gérer soi-même | **Fourni** (`error()`) |
| Maturité | Partout, depuis toujours | Récent |

**Lequel choisir ?** `HttpClient` reste le choix par défaut : c'est ce que vous trouverez dans
la quasi-totalité des projets, et ce que couvre la documentation. `httpResource` est très
confortable pour du simple affichage de données sur un projet neuf.

> 📖 [httpResource](https://angular.dev/guide/http/http-resource)

---

## 🎉 Challenge final

- [ ] `npm run serve-api` sert les produits sur <http://localhost:3004/products>
- [ ] `/products` affiche les produits **venant du serveur**
- [ ] Modifier `db.json` et recharger change l'affichage
- [ ] Ajouter un produit via le formulaire l'écrit dans `db.json` (vérifiez le fichier !)
- [ ] Couper l'API affiche un message d'erreur, pas une page blanche
- [ ] Vous savez expliquer pourquoi `subscribe` est indispensable

## ✅ Bonus

- Ajoutez `deleteProduct(id: number)` au service (`this.http.delete(...)`) et un bouton de
  suppression sur chaque carte. Attention : il faudra recharger la liste ensuite.
- Dans le service, ajoutez un `catchError` qui renvoie `of([])` en cas d'échec. Comparez
  avec la gestion d'erreur faite dans le composant : où vaut-il mieux la placer, selon vous ?

## Récap

- **json-server** transforme un fichier JSON en API REST complète.
- `provideHttpClient()` est indispensable — son oubli donne `No provider for HttpClient`.
- Un **observable est froid** : sans `subscribe` (ou pipe `async`), aucune requête ne part.
- Trois façons de consommer : `subscribe`, pipe `async`, `firstValueFrom`. `toPromise()` est
  **déprécié** (retiré dans RxJS 8).
- **RxJS** excelle sur les flux d'événements ; les **signaux** sur l'état local. Ils coexistent.

➡️ **Chapitre suivant : [M7 — Authentification et garde](M7-AUTH.md)**
