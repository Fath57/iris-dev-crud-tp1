# Cas d'Utilisation : Créer un Article

## Informations Générales
- **Acteur principal** : Utilisateur (Auteur/Rédacteur)
- **Objectif** : Créer un nouvel article dans le système
- **Préconditions** : L'utilisateur a accès au système
- **Postconditions** : L'article est enregistré dans la base de données MongoDB

---

## Pseudo-Algorithme

```
ALGORITHME CreerArticle

DEBUT
    // 1. RÉCEPTION DES DONNÉES
    Recevoir donnéesArticle depuis la requête HTTP POST

    // 2. VALIDATION DES DONNÉES
    SI titre est vide OU non défini ALORS
        Retourner erreur "Le titre est obligatoire"
        ARRÊTER
    FIN SI

    SI resume est vide OU non défini ALORS
        Retourner erreur "Le résumé est obligatoire"
        ARRÊTER
    FIN SI

    SI contenu est vide OU non défini ALORS
        Retourner erreur "Le contenu est obligatoire"
        ARRÊTER
    FIN SI

    SI datePublication est vide OU non défini ALORS
        Retourner erreur "La date de publication est obligatoire"
        ARRÊTER
    FIN SI

    SI datePublication n'est pas une date valide ALORS
        Retourner erreur "Format de date invalide"
        ARRÊTER
    FIN SI

    // 3. DÉFINITION DES VALEURS PAR DÉFAUT
    SI statut n'est pas défini ALORS
        statut ← "brouillon"
    SINON
        SI statut n'est pas dans ["brouillon", "publie", "archive"] ALORS
            Retourner erreur "Statut invalide"
            ARRÊTER
        FIN SI
    FIN SI

    SI extract n'est pas défini ALORS
        extract ← chaîne vide
    FIN SI

    // 4. CRÉATION DE L'OBJET ARTICLE
    nouvelArticle ← {
        titre: donnéesArticle.titre,
        resume: donnéesArticle.resume,
        contenu: donnéesArticle.contenu,
        extract: donnéesArticle.extract OU "",
        datePublication: donnéesArticle.datePublication,
        statut: statut,
        dateCreation: DateActuelle(),
        createdAt: DateHeureActuelle(),
        updatedAt: DateHeureActuelle()
    }

    // 5. CONNEXION À LA BASE DE DONNÉES
    ESSAYER
        Connexion ← OuvrirConnexionMongoDB()

        // 6. ENREGISTREMENT DANS LA BASE DE DONNÉES
        articleEnregistre ← BaseDeDonnées.articles.inserer(nouvelArticle)

        // 7. VÉRIFICATION DE L'INSERTION
        SI articleEnregistre.id existe ALORS
            // 8. RETOUR DE LA RÉPONSE SUCCÈS
            Retourner {
                statut: 201 (Créé),
                message: "Article créé avec succès",
                données: articleEnregistre
            }
        SINON
            Retourner erreur "Échec de la création de l'article"
        FIN SI

    ATTRAPER Erreur e
        // 9. GESTION DES ERREURS
        SI e est de type ErreurDuplication ALORS
            Retourner {
                statut: 409 (Conflit),
                message: "Un article avec ce titre existe déjà"
            }
        SINON SI e est de type ErreurBaseDeDonnées ALORS
            Retourner {
                statut: 500 (Erreur Serveur),
                message: "Erreur lors de l'enregistrement : " + e.message
            }
        SINON
            Retourner {
                statut: 500 (Erreur Serveur),
                message: "Erreur interne du serveur"
            }
        FIN SI

    FINALEMENT
        FermerConnexionMongoDB()
    FIN ESSAYER

FIN
```

---

## Données en Entrée (CreateArticleDto)

| Champ            | Type   | Obligatoire | Description                              |
|------------------|--------|-------------|------------------------------------------|
| titre            | String | Oui         | Titre de l'article                       |
| resume           | String | Oui         | Résumé court de l'article                |
| contenu          | String | Oui         | Contenu complet de l'article             |
| extract          | String | Non         | Extrait ou citation de l'article         |
| datePublication  | Date   | Oui         | Date prévue de publication               |
| statut           | String | Non         | brouillon, publie ou archive (défaut: brouillon) |

---

## Données en Sortie

### En cas de succès (HTTP 201)
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "titre": "Mon nouvel article",
  "resume": "Un résumé captivant",
  "contenu": "Le contenu détaillé de l'article...",
  "extract": "Citation importante",
  "datePublication": "2026-02-01T00:00:00.000Z",
  "statut": "brouillon",
  "dateCreation": "2026-01-06T10:30:00.000Z",
  "createdAt": "2026-01-06T10:30:00.000Z",
  "updatedAt": "2026-01-06T10:30:00.000Z"
}
```

### En cas d'erreur (HTTP 400/409/500)
```json
{
  "statusCode": 400,
  "message": "Le titre est obligatoire",
  "error": "Bad Request"
}
```

---

## Scénarios Alternatifs

### Scénario A : Données invalides
1. L'utilisateur soumet un formulaire incomplet
2. Le système valide les données
3. Le système retourne une erreur 400 avec le message approprié
4. L'utilisateur corrige et soumet à nouveau

### Scénario B : Erreur de connexion à la base de données
1. L'utilisateur soumet des données valides
2. Le système ne peut pas se connecter à MongoDB
3. Le système retourne une erreur 500
4. Le système enregistre l'erreur dans les logs
5. L'utilisateur réessaye plus tard

### Scénario C : Article en brouillon
1. L'utilisateur crée un article sans spécifier le statut
2. Le système définit automatiquement le statut à "brouillon"
3. L'article est sauvegardé mais pas publié
4. L'utilisateur peut le modifier avant publication

---

## Règles Métier

1. **Unicité** : Deux articles peuvent avoir le même titre (pas de contrainte d'unicité)
2. **Statut par défaut** : Si non spécifié, le statut est "brouillon"
3. **Date de création** : Générée automatiquement par le système
4. **Timestamps** : createdAt et updatedAt gérés automatiquement par Mongoose
5. **Validation des statuts** : Seuls "brouillon", "publie" et "archive" sont acceptés
6. **Date de publication** : Peut être dans le futur (publication programmée)
