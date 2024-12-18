# Documentation de l'Ontologie Restaurant

## Description de l'Ontologie

Cette ontologie permet de modéliser des informations liées aux restaurants, en se basant sur des concepts issus de [schema.org](https://schema.org/). Elle inclut des informations telles que le nom du restaurant, son adresse, son évaluation, les horaires d'ouverture, les types de cuisines servies, et d'autres attributs importants pour la gestion des restaurants.

### Classes

L'ontologie comporte les classes suivantes :

- **Restaurant** : Représente un restaurant.
- **AggregateRating** : Représente une évaluation globale d'un restaurant, comme la note moyenne.
- **PostalAddress** : Représente l'adresse d'un restaurant, incluant la rue, la localité, la région et le code postal.
- **OpeningHoursSpecification** : Représente les horaires d'ouverture d'un restaurant.
  
### Propriétés

Les propriétés suivantes sont utilisées pour relier des données à ces classes :

- **name** : Le nom du restaurant.
- **aggregateRating** : L'évaluation d'un restaurant (via la classe `AggregateRating`).
- **address** : L'adresse du restaurant (via la classe `PostalAddress`).
- **telephone** : Le numéro de téléphone du restaurant.
- **url** : L'URL du site web du restaurant.
- **openingHoursSpecification** : Les horaires d'ouverture du restaurant (via la classe `OpeningHoursSpecification`).
- **servesCuisine** : Les types de cuisine servis par le restaurant.
- **priceRange** : La gamme de prix du restaurant.
- **takesReservations** : Si le restaurant prend des réservations.

## Exemples de Requêtes SPARQL

### 1. Récupérer les noms et les évaluations des restaurants

Cette requête récupère les noms des restaurants et leurs évaluations (ratingValue).

```sparql
PREFIX schema: <https://schema.org/>

SELECT ?restaurantName ?ratingValue
WHERE {
  ?restaurant a schema:Restaurant ;
             schema:name ?restaurantName ;
             schema:aggregateRating ?rating .
  ?rating schema:ratingValue ?ratingValue .
}
```

### 2. Récupérer les restaurants avec leur note moyenne (rating) et le nombre d'avis

Cette requête récupère le nom des restaurants, leur note (ratingValue), et le nombre d'avis (reviewCount).

```sparql
PREFIX schema: <https://schema.org/>

SELECT ?restaurantName ?ratingValue ?reviewCount
WHERE {
  ?restaurant a schema:Restaurant ;
              schema:name ?restaurantName ;
              schema:aggregateRating ?rating .
  ?rating schema:ratingValue ?ratingValue ;
          schema:reviewCount ?reviewCount .
}
```
### 3. Récupérer les restaurants avec leur catégorie de cuisine et leur plage de prix

Cette requête permet de récupérer les restaurants, leurs types de cuisine (servesCuisine), et leur plage de prix (priceRange).

```sparql
PREFIX schema: <https://schema.org/>

SELECT ?restaurantName ?cuisineType ?priceRange
WHERE {
  ?restaurant a schema:Restaurant ;
              schema:name ?restaurantName ;
              schema:servesCuisine ?cuisineType ;
              schema:priceRange ?priceRange .
}
```