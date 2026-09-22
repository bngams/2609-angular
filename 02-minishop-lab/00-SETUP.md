# 00 — Mise en place commune

**Scénario à réaliser en autonomie.** Cette page prépare votre poste et vous fait vérifier
que tout répond. Elle est commune aux deux parcours : faites-la une fois, puis choisissez
votre voie à la fin.

## ✨ Objectifs

- Vérifier que votre version de Node convient à Angular 22
- Savoir lancer l'outil en ligne de commande Angular
- Connaître le vocabulaire minimum avant d'écrire la première ligne
- Choisir votre parcours en connaissance de cause

---

## 🧰 1 — Vérifier Node.js

Angular 22 impose **Node 22.22.3 minimum** (ou 24, recommandé). Ce n'est pas une
recommandation : en dessous, l'outil refuse simplement de démarrer.

```bash
node -v
```

Trois cas possibles :

| Ce que vous voyez | Ce que ça veut dire | À faire |
|---|---|---|
| `v24.x.x` | Parfait | Rien |
| `v22.22.3` ou plus | Ça passe | Rien |
| `v22.18.0`, `v20.x`, … | Trop ancien | Voir ci-dessous |

Si votre version est trop ancienne, installez Node 24 via
[nvm](https://github.com/nvm-sh/nvm) (Linux/macOS) ou
[nvm-windows](https://github.com/coreybutler/nvm-windows) :

```bash
nvm install 24
nvm use 24
node -v
```

> 💡 **Tester :** `node -v`   # -> v24.18.0

> ⚠️ **Piège — la version retombe toute seule.**
> - *Symptôme :* vous ouvrez un nouveau terminal, `node -v` affiche l'ancienne version, et la
>   commande `ng` échoue avec un message parlant de version de Node.
> - *Cause :* `nvm use` n'agit que sur le terminal en cours. Un nouveau terminal repart du défaut.
> - *Correctif :* soit refaire `nvm use 24` à chaque ouverture, soit changer le défaut une fois
>   pour toutes :
>   ```bash
>   nvm alias default 24
>   ```

---

## ⚙️ 2 — L'outil en ligne de commande Angular

Angular fournit un outil en ligne de commande, l'**Angular CLI** (*Command Line Interface*).
C'est lui qui crée le projet, génère les fichiers et lance le serveur de développement. Vous
l'utiliserez à chaque chapitre.

Dans ce lab, les commandes sont écrites avec **`npx ng`** plutôt que `ng`. La raison est
simple et vous évitera des heures de perplexité :

| Commande | Ce qu'elle lance |
|---|---|
| `ng ...` | La version **installée globalement** sur votre machine — potentiellement ancienne, voire cassée |
| `npx ng ...` | La version **du projet courant**, celle qui a été installée avec le projet |

Vérifiez que l'outil répond :

```bash
npx ng version
```

> 💡 **Tester :** la commande affiche le logo Angular en caractères ASCII et un tableau de
> versions. La ligne `Angular CLI: 22.x.x` doit apparaître.

> ⚠️ **Piège — une vieille installation globale.**
> - *Symptôme :* `ng version` échoue avec `ReferenceError: primordials is not defined`.
> - *Cause :* un paquet `angular-cli` très ancien (l'ancien nom, avant 2017) traîne en global et
>   est incompatible avec Node récent.
> - *Correctif :*
>   ```bash
>   npm uninstall -g angular-cli @angular/cli
>   npm install -g @angular/cli@22
>   ```
>   Ou plus simplement : utilisez `npx ng`, comme dans ce lab.

---

## 📖 3 — Le vocabulaire minimum

Cinq mots reviennent en permanence. Les connaître maintenant vous évitera de buter dessus
au chapitre 2.

| Terme | Définition | Analogie |
|---|---|---|
| **Composant** (*component*) | Un morceau d'interface autonome : sa logique, son HTML, son style | Une brique de Lego |
| **Gabarit** (*template*) | Le fichier HTML d'un composant, enrichi de syntaxe Angular | Le plan de la brique |
| **Service** | Une classe sans interface, qui détient une donnée ou un savoir-faire partagé | Le magasinier |
| **Injection de dépendances** | Le mécanisme par lequel Angular fournit un service à qui le demande | On demande, on ne construit pas |
| **Routeur** (*router*) | Le mécanisme qui affiche tel composant selon l'URL | Le standardiste |

Deux termes de plus, propres aux deux parcours — vous ne croiserez que celui de votre voie :

| Terme | Parcours | Définition |
|---|---|---|
| **Composant autonome** (*standalone*) | MODERN | Un composant qui déclare lui-même ce dont il a besoin |
| **Module** (`NgModule`) | LEGACY | Un regroupement qui déclare plusieurs composants d'un coup |

> 📖 [Glossaire officiel Angular](https://angular.dev/reference/concepts/overview)

---

## 🗂️ 4 — Où travailler

Créez un dossier de travail **à côté** de ce dépôt, pas dedans :

```bash
cd ..
mkdir mon-lab-angular
cd mon-lab-angular
```

> ℹ️ **Pourquoi à côté ?** Le dépôt du lab est un support de lecture. En travaillant dehors,
> vous pourrez récupérer une mise à jour du support (`git pull`) sans conflit avec votre code.

Votre projet Angular sera créé dans ce dossier au chapitre 1.

---

## 🎉 Vérification avant de partir

- [ ] `node -v` affiche `v22.22.3` ou plus (idéalement `v24.x`)
- [ ] `npx ng version` affiche un tableau de versions sans erreur
- [ ] Je sais ce qu'est un composant, un service et le routeur
- [ ] J'ai un dossier de travail, en dehors du dépôt du lab

---

## ➡️ Choisissez votre parcours

| Votre situation | Parcours |
|---|---|
| Je débute, ou je vais créer un projet neuf | 🟢 **[MODERN — chapitre 1](MODERN/M1-SCAFFOLD.md)** |
| Je reprends un projet existant écrit en `NgModule` | 🟠 **[LEGACY — chapitre 1](LEGACY/L1-SCAFFOLD.md)** |
| Je ne sais pas | 🟢 Prenez **[MODERN](MODERN/M1-SCAFFOLD.md)** |

*(Si le choix ne vous parle pas encore, relisez la
[section 4 du README](README.md#4--quel-parcours-choisir) : elle compare les deux en un tableau.)*
