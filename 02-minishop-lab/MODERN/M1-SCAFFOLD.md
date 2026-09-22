# M1 — Mise en place du projet

> 🟢 **Parcours MODERN** — composants autonomes et signaux.
> Chapitre équivalent en LEGACY : [L1](../LEGACY/L1-SCAFFOLD.md).

**Scénario à réaliser en autonomie.** Vous créez le projet, vous en comprenez la structure,
vous y ajoutez une bibliothèque de composants graphiques, puis vous générez les premières
pages. Ce chapitre est **très guidé** : chaque fichier à créer ou à modifier est indiqué.

## ✨ Objectifs

- Créer un projet Angular et comprendre le rôle de chaque fichier généré
- Savoir lancer le serveur de développement
- Ajouter Angular Material au projet
- Générer vos premiers composants avec l'outil en ligne de commande

## 📁 Point de départ

Le dossier de travail créé à l'étape [00-SETUP](../00-SETUP.md), et rien d'autre. À la fin du
chapitre, vous aurez :

```
ng-app-product/
├── src/
│   ├── app/
│   │   ├── pages/
│   │   │   ├── layout/header/     la future barre de menu
│   │   │   ├── home/              page d'accueil
│   │   │   ├── about/             page « à propos »
│   │   │   └── not-found/         page 404
│   │   ├── app.ts                 le composant racine
│   │   ├── app.config.ts          la configuration de l'application
│   │   └── app.routes.ts          les routes (vide pour l'instant)
│   ├── index.html
│   ├── main.ts                    le point d'entrée
│   └── styles.scss                les styles globaux
├── angular.json                   la configuration de l'outil
└── package.json                   les dépendances et les scripts
```

---

## 🚀 1 — Créer le projet

Placez-vous dans votre dossier de travail, puis lancez la création :

```bash
npx -y @angular/cli@22 new ng-app-product --routing=true --style=scss --ssr=false --zoneless=true
```

Décomposons cette commande, car chaque option compte :

| Option | Rôle | Pourquoi ce choix ici |
|---|---|---|
| `new ng-app-product` | Crée un projet de ce nom, dans un dossier du même nom | — |
| `--routing=true` | Prépare la navigation entre pages | On en aura besoin dès le chapitre 2 |
| `--style=scss` | Utilise SCSS plutôt que CSS simple | SCSS accepte tout le CSS, et ajoute variables et imbrication |
| `--ssr=false` | Pas de rendu côté serveur | Sujet avancé, hors périmètre de ce lab |
| `--zoneless=true` | L'application n'utilise pas `zone.js` | C'est la direction d'Angular ; voir l'encart ci-dessous |

L'installation prend une à deux minutes.

> 💡 **Tester :** la commande affiche une longue liste de `CREATE …`, puis
> `Packages installed successfully.`

### Un mot sur `--zoneless`

Historiquement, Angular utilisait une bibliothèque nommée `zone.js` pour détecter *tout seul*
qu'une donnée avait changé et qu'il fallait redessiner l'écran. Efficace, mais coûteux : à la
moindre action, Angular vérifiait l'application entière.

Le mode **zoneless** supprime cette bibliothèque. Angular ne devine plus : on lui **dit** ce
qui change, au moyen des **signaux** (chapitre 4). Résultat : une application plus légère et
plus prévisible.

> ℹ️ Rassurez-vous : jusqu'au chapitre 4, cela ne change **rien** à ce que vous écrivez. On y
> reviendra avec une petite expérience pour vous le faire constater.

---

## 🔍 2 — Visiter le projet généré

Entrez dans le dossier et lancez l'application :

```bash
cd ng-app-product
npm start
```

> 💡 **Tester :** ouvrez <http://localhost:4200>. La page d'accueil par défaut d'Angular
> s'affiche, avec le texte *« Hello, ng-app-product »* et des liens vers la documentation.
> Le terminal, lui, indique :
> ```
> ➜  Local:   http://localhost:4200/
> ```

Laissez ce terminal tourner : il recompile automatiquement à chaque sauvegarde. Ouvrez un
**second terminal** pour la suite des commandes.

### Les fichiers qui comptent

Ne lisez pas tout le projet. Cinq fichiers suffisent pour commencer :

| Fichier | Rôle |
|---|---|
| `src/main.ts` | Le point d'entrée : démarre l'application en affichant le composant racine |
| `src/app/app.ts` | Le **composant racine**, celui qui contient tous les autres |
| `src/app/app.html` | Son gabarit — c'est lui qui affiche la page d'accueil par défaut |
| `src/app/app.config.ts` | La configuration : on y branchera le routeur et le client HTTP |
| `src/app/app.routes.ts` | La liste des routes (vide pour l'instant) |

Ouvrez `src/app/app.ts`. Vous y trouverez à peu près ceci :

```ts
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',           // le nom de la balise : <app-root>
  imports: [RouterOutlet],        // ce dont ce composant a besoin
  templateUrl: './app.html',      // son gabarit
  styleUrl: './app.scss',         // son style
})
export class App {
  protected readonly title = signal('ng-app-product');
}
```

Trois choses à retenir de ce fichier :

1. **`@Component({...})`** est un *décorateur* : il déclare à Angular que cette classe est un
   composant et lui donne ses caractéristiques.
2. **`selector: 'app-root'`** définit la balise HTML à utiliser pour afficher ce composant.
   Ouvrez `src/index.html` : vous y verrez `<app-root></app-root>`. C'est le point d'ancrage.
3. **`imports: [...]`** est la marque des composants **autonomes** : le composant déclare
   lui-même ce qu'il utilise. C'est la grande différence avec le parcours LEGACY, où cette
   déclaration se fait dans un module à part.

> 📖 [Anatomie d'un composant](https://angular.dev/guide/components) ·
> [Composants autonomes](https://angular.dev/guide/components/importing)

---

## 🎨 3 — Ajouter Angular Material

Plutôt que de dessiner nous-mêmes boutons, champs et cartes, nous utilisons
**[Angular Material](https://material.angular.dev/)** : une bibliothèque officielle de
composants graphiques prêts à l'emploi.

```bash
npx ng add @angular/material
```

Répondez aux questions posées (le thème proposé par défaut convient très bien ; acceptez la
typographie et les animations).

> 💡 **Tester :** la commande se termine par
> ```
> UPDATE src/styles.scss
> UPDATE src/index.html
> ```

### Pourquoi `ng add` et pas `npm install` ?

La distinction est importante, et vous la reverrez :

| Commande | Ce qu'elle fait |
|---|---|
| `npm install <paquet>` | Télécharge le paquet. **Point.** À vous de le configurer ensuite. |
| `ng add <paquet>` | Télécharge le paquet **et** le configure : styles, polices, fichiers modifiés |

Ici, `ng add` a importé le thème dans `styles.scss` et ajouté les polices dans `index.html`.
Du travail en moins, et surtout aucune étape oubliée.

> 📖 [Installer Angular Material](https://material.angular.dev/guide/getting-started)

---

## 🧱 4 — Générer les premières pages

Nous allons créer quatre composants : la barre de menu et trois pages. Plutôt que de créer
les fichiers à la main, utilisons le générateur.

La forme générale est :

```bash
npx ng generate component <chemin/NomDuComposant> <options>
```

`generate` s'abrège en `g`, et `component` en `c`. Les commandes à lancer :

```bash
npx ng g c pages/layout/Header --skip-tests
npx ng g c pages/Home --skip-tests
npx ng g c pages/About --skip-tests
npx ng g c pages/NotFound --skip-tests
```

| Élément | Rôle |
|---|---|
| `pages/layout/Header` | Le chemin **et** le nom. Le dossier est créé si besoin. |
| `--skip-tests` | Ne génère pas le fichier de test. On les écrira nous-mêmes au chapitre 8. |

> ℹ️ `--skip-tests` ne vaut que pour les composants que **vous** générez. `ng new` a tout de
> même créé `src/app/app.spec.ts` : on y reviendra au chapitre 8.

> 💡 **Tester :** chaque commande affiche trois `CREATE`. Par exemple :
> ```
> CREATE src/app/pages/home/home.scss (0 bytes)
> CREATE src/app/pages/home/home.ts (178 bytes)
> CREATE src/app/pages/home/home.html (19 bytes)
> ```

Remarquez la transformation des noms : vous tapez `NotFound`, Angular crée un dossier
`not-found/` contenant `not-found.ts`, et la classe à l'intérieur s'appelle `NotFound`.

> ℹ️ **Le nommage des fichiers a changé.** Depuis Angular 20, le fichier s'appelle `home.ts`,
> et non plus `home.component.ts`. Si vous consultez un tutoriel plus ancien, vous y verrez
> partout `.component.ts` : ne soyez pas surpris, c'est le même objet.

---

## ✍️ 5 — Remplir les pages

Les composants existent mais leurs gabarits sont vides. Remplissons-les — c'est du HTML
ordinaire pour l'instant.

**`src/app/pages/home/home.html`** — remplacez tout le contenu par :

```html
<h1>Bienvenue</h1>
<p>Ceci est la page d'accueil de l'application.</p>
```

**`src/app/pages/about/about.html`** — remplacez tout le contenu par :

```html
<h1>À propos</h1>
<p>Application d'exercice construite pendant le lab Angular.</p>
```

**`src/app/pages/not-found/not-found.html`** — remplacez tout le contenu par :

```html
<h1>404</h1>
<p>Cette page n'existe pas.</p>
```

Laissez `header.html` de côté : on s'en occupe au chapitre 2, une fois les routes en place.

---

## 🧪 Manip — voir un composant s'afficher

Vos composants existent, mais rien ne les affiche encore. Faisons-en apparaître un, juste
pour comprendre le mécanisme — on annulera ensuite.

1. Ouvrez `src/app/app.ts` et ajoutez l'import du composant `Home` :

   ```ts
   import { Home } from './pages/home/home';
   ```

2. Dans le décorateur, ajoutez `Home` au tableau `imports` :

   ```ts
   imports: [RouterOutlet, Home],
   ```

3. Ouvrez `src/app/app.html`, **effacez tout le contenu** et remplacez-le par :

   ```html
   <app-home />
   ```

4. Sauvegardez et regardez le navigateur.

*Observé : la page d'accueil d'Angular a disparu, remplacée par « Bienvenue ». Vous venez
d'afficher votre premier composant.*

<details>
<summary>Pourquoi <code>&lt;app-home /&gt;</code> ?</summary>

Ouvrez `src/app/pages/home/home.ts` : vous y lirez `selector: 'app-home'`. C'est le nom de
balise que le générateur a construit, en préfixant le nom du composant par `app-`. Pour
afficher un composant, on écrit sa balise — et on l'ajoute à `imports`, sans quoi Angular
répond `'app-home' is not a known element`.

</details>

**Annulez maintenant cette manip** : remettez `src/app/app.html` avec pour seul contenu

```html
<router-outlet />
```

et retirez `Home` des `imports` de `app.ts` ainsi que la ligne `import { Home } ...`. Le
chapitre 2 remplira ce fichier proprement.

---

## 🎉 Challenge final

- [ ] `npm start` lance l'application sans erreur sur <http://localhost:4200>
- [ ] Angular Material est installé (`styles.scss` contient un thème)
- [ ] Les quatre composants existent sous `src/app/pages/`
- [ ] `home.html`, `about.html` et `not-found.html` contiennent votre propre HTML
- [ ] Vous avez affiché un composant, puis annulé la manip
- [ ] `src/app/app.html` ne contient plus que `<router-outlet />`

## ✅ Bonus

- Ouvrez `angular.json` et retrouvez-y le nom du projet, le dossier de sortie du build
  (`outputPath`), et le fichier de styles global. Ce fichier pilote tout l'outillage.
- Lancez `npx ng build` et observez le dossier `dist/` qui apparaît : c'est ce qui serait
  déployé en production.

## Récap

- `ng new` crée le projet ; les options choisies (`--routing`, `--style`, `--zoneless`)
  déterminent sa structure.
- Un **composant** = une classe décorée par `@Component`, un gabarit HTML, un style.
- En MODERN, chaque composant déclare lui-même ses dépendances dans `imports` : c'est le
  principe des composants **autonomes**.
- `ng add` installe **et** configure une bibliothèque, là où `npm install` se contente de la
  télécharger.
- `ng g c <chemin/Nom>` génère un composant ; les fichiers s'appellent `nom.ts` depuis
  Angular 20.

➡️ **Chapitre suivant : [M2 — Navigation](M2-NAV.md)**
