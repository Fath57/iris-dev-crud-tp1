# Fiche Détaillée - Action DELETE Article

---

## 1. CLASSE : ArticlesController

### Informations Générales
- **Type** : Contrôleur HTTP
- **Responsabilité** : Gérer les requêtes HTTP pour la suppression d'articles
- **Route de base** : `/api/articles`
- **Décorateur NestJS** : `@Controller('api/articles')`

### Attributs

| Nom | Type | Visibilité | Description |
|-----|------|-----------|-------------|
| articlesService | ArticlesService | private (-) | Instance du service de gestion des articles, injectée par dépendance |

### Méthodes

#### Constructeur
```
+ ArticlesController(articlesService: ArticlesService)
```
- **Visibilité** : public (+)
- **Paramètres** :
  - `articlesService` : ArticlesService (injection de dépendance)
- **Description** : Initialise le contrôleur avec le service d'articles

#### Méthode remove()
```
+ remove(id: string) : Promise<Article>
```
- **Visibilité** : public (+)
- **Décorateurs** : `@Delete(':id')`
- **Paramètres** :
  - `id` : string - Identifiant MongoDB de l'article à supprimer (via `@Param('id')`)
- **Retour** : `Promise<Article>` - Article supprimé
- **Route HTTP** : `DELETE /api/articles/:id`
- **Codes de statut** :
  - 200 : Suppression réussie
  - 404 : Article non trouvé
  - 500 : Erreur serveur
- **Description** : Point d'entrée HTTP pour supprimer un article

---

## 2. CLASSE : ArticlesService

### Informations Générales
- **Type** : Service métier
- **Responsabilité** : Logique métier pour la suppression d'articles
- **Décorateur NestJS** : `@Injectable()`

### Attributs

| Nom | Type | Visibilité | Description |
|-----|------|-----------|-------------|
| articleModel | Model\<Article\> | private (-) | Modèle Mongoose pour interagir avec la collection MongoDB |

### Méthodes

#### Constructeur
```
+ ArticlesService(articleModel: Model<Article>)
```
- **Visibilité** : public (+)
- **Paramètres** :
  - `articleModel` : Model\<Article\> - Injecté via `@InjectModel(Article.name)`
- **Description** : Initialise le service avec le modèle Mongoose

#### Méthode remove()
```
+ async remove(id: string) : Promise<Article | null>
```
- **Visibilité** : public (+)
- **Modificateur** : async (asynchrone)
- **Paramètres** :
  - `id` : string - Identifiant MongoDB de l'article
- **Retour** : `Promise<Article | null>` - Article supprimé ou null si non trouvé
- **Logique** :
  1. Appelle `articleModel.findByIdAndDelete(id)`
  2. Exécute la requête avec `.exec()`
  3. Retourne l'article supprimé ou null
- **Description** : Supprime un article de la base de données par son ID

---

## 3. CLASSE : Article (Modèle)

### Informations Générales
- **Type** : Entité / Document MongoDB
- **Responsabilité** : Représenter un article dans la base de données
- **Décorateur NestJS** : `@Schema({ timestamps: true })`
- **Collection MongoDB** : `articles`

### Attributs

| Nom | Type | Visibilité | Contraintes | Description |
|-----|------|-----------|-------------|-------------|
| _id | ObjectId | public (+) | Auto-généré | Identifiant unique MongoDB |
| titre | string | public (+) | required | Titre de l'article |
| resume | string | public (+) | required | Résumé de l'article |
| contenu | string | public (+) | required | Contenu complet de l'article |
| extract | string | public (+) | optional | Extrait ou citation |
| datePublication | Date | public (+) | required | Date de publication prévue |
| statut | string | public (+) | enum, default: 'brouillon' | Statut: brouillon, publie, archive |
| dateCreation | Date | public (+) | default: Date.now | Date de création |
| createdAt | Date | public (+) | auto (timestamps) | Date de création automatique |
| updatedAt | Date | public (+) | auto (timestamps) | Date de dernière modification |

### Méthodes

#### Méthode save()
```
+ save() : Promise<Article>
```
- **Visibilité** : public (+)
- **Description** : Sauvegarde l'article dans la base de données

#### Méthode remove()
```
+ remove() : Promise<Article>
```
- **Visibilité** : public (+)
- **Description** : Supprime l'article de la base de données

---

## 4. CLASSE : Model\<Article\> (Mongoose)

### Informations Générales
- **Type** : Modèle Mongoose générique
- **Responsabilité** : Interface avec MongoDB pour les opérations CRUD

### Méthodes (liées à DELETE)

#### Méthode findById()
```
+ findById(id: string) : Query<Article>
```
- **Visibilité** : public (+)
- **Paramètres** : `id` - Identifiant de l'article
- **Retour** : Query\<Article\> - Requête Mongoose
- **Description** : Recherche un article par ID

#### Méthode findByIdAndDelete()
```
+ findByIdAndDelete(id: string, options?: object) : Query<Article>
```
- **Visibilité** : public (+)
- **Paramètres** :
  - `id` : string - Identifiant de l'article
  - `options` : object (optionnel) - Options de requête
- **Retour** : Query\<Article\> - Requête Mongoose retournant l'article supprimé
- **Description** : Recherche et supprime un article en une seule opération atomique
- **Comportement** :
  - Retourne l'article supprimé (état avant suppression)
  - Retourne null si l'ID n'existe pas

---

## 5. CLASSE : NotFoundException (Exception)

### Informations Générales
- **Type** : Exception HTTP
- **Package** : `@nestjs/common`
- **Code HTTP** : 404 Not Found

### Attributs

| Nom | Type | Visibilité | Description |
|-----|------|-----------|-------------|
| statusCode | number | public (+) | Code HTTP (404) |
| message | string | public (+) | Message d'erreur |
| error | string | public (+) | Type d'erreur ("Not Found") |

### Méthodes

#### Constructeur
```
+ NotFoundException(message: string)
```
- **Visibilité** : public (+)
- **Paramètres** : `message` - Message d'erreur personnalisé
- **Description** : Crée une exception HTTP 404

### Utilisation dans DELETE
```typescript
if (!article) {
    throw new NotFoundException(`Article avec l'ID ${id} non trouvé`);
}
```

---

## 6. CLASSE : InternalServerErrorException (Exception)

### Informations Générales
- **Type** : Exception HTTP
- **Package** : `@nestjs/common`
- **Code HTTP** : 500 Internal Server Error

### Attributs

| Nom | Type | Visibilité | Description |
|-----|------|-----------|-------------|
| statusCode | number | public (+) | Code HTTP (500) |
| message | string | public (+) | Message d'erreur |
| error | string | public (+) | Type d'erreur ("Internal Server Error") |

### Méthodes

#### Constructeur
```
+ InternalServerErrorException(message: string)
```
- **Visibilité** : public (+)
- **Paramètres** : `message` - Message d'erreur
- **Description** : Crée une exception HTTP 500

### Utilisation dans DELETE
```typescript
catch (error) {
    throw new InternalServerErrorException('Erreur lors de la suppression');
}
```

---

## 7. FLUX D'EXÉCUTION COMPLET

### Diagramme de séquence simplifié

```
Client                  Controller              Service                 MongoDB
  |                         |                      |                       |
  |---DELETE /articles/123->|                      |                       |
  |                         |                      |                       |
  |                         |---remove(123)------->|                       |
  |                         |                      |                       |
  |                         |                      |--findByIdAndDelete--->|
  |                         |                      |                       |
  |                         |                      |<------Article---------|
  |                         |                      |                       |
  |                         |<-----Article---------|                       |
  |                         |                      |                       |
  |<--------200 + Article---|                      |                       |
  |                         |                      |                       |
```

### Étapes détaillées

1. **Réception** : Le client envoie `DELETE /api/articles/123`
2. **Routing** : NestJS route vers `ArticlesController.remove('123')`
3. **Délégation** : Le contrôleur appelle `articlesService.remove('123')`
4. **Requête DB** : Le service exécute `articleModel.findByIdAndDelete('123')`
5. **Suppression** : MongoDB supprime le document et retourne l'article supprimé
6. **Vérification** :
   - Si article null → lever `NotFoundException`
   - Sinon → retourner l'article
7. **Réponse** : HTTP 200 avec les données de l'article supprimé

---

## 8. RELATIONS ENTRE CLASSES

### Dépendances
- **ArticlesController** dépend de **ArticlesService** (injection)
- **ArticlesService** dépend de **Model\<Article\>** (injection)
- **Model\<Article\>** gère **Article**

### Associations
- **ArticlesController** → **ArticlesService** : `utilise` (composition)
- **ArticlesService** → **Model\<Article\>** : `utilise` (composition)
- **Controller/Service** → **Exceptions** : `peut lever` (dépendance)

### Cardinalités
- 1 ArticlesController → 1 ArticlesService
- 1 ArticlesService → 1 Model\<Article\>
- 1 Model\<Article\> → N Articles (gestion de collection)

---

## 9. EXEMPLES DE CODE

### Exemple de requête HTTP
```http
DELETE /api/articles/507f1f77bcf86cd799439011 HTTP/1.1
Host: localhost:3000
```

### Exemple de réponse (succès)
```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "_id": "507f1f77bcf86cd799439011",
  "titre": "Article à supprimer",
  "resume": "Résumé de l'article",
  "contenu": "Contenu complet...",
  "extract": "Citation",
  "datePublication": "2026-01-15T00:00:00.000Z",
  "statut": "brouillon",
  "dateCreation": "2026-01-06T10:00:00.000Z",
  "createdAt": "2026-01-06T10:00:00.000Z",
  "updatedAt": "2026-01-06T10:00:00.000Z"
}
```

### Exemple de réponse (erreur 404)
```json
HTTP/1.1 404 Not Found
Content-Type: application/json

{
  "statusCode": 404,
  "message": "Article avec l'ID 507f1f77bcf86cd799439011 non trouvé",
  "error": "Not Found"
}
```

---

## 10. LÉGENDE DES VISIBILITÉS

| Symbole | Visibilité | Description |
|---------|-----------|-------------|
| + | public | Accessible de partout |
| - | private | Accessible uniquement dans la classe |
| # | protected | Accessible dans la classe et ses sous-classes |
| ~ | package | Accessible dans le même package/module |

**Dans ce contexte NestJS :**
- Les méthodes de contrôleur sont **public** (routes HTTP)
- Les méthodes de service sont **public** (appelées par les contrôleurs)
- Les attributs injectés sont **private** (encapsulation)
- Les attributs de modèle sont **public** (ORM Mongoose)
