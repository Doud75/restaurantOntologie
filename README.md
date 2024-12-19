# Documentation de l'Ontologie Restaurant par Adrien Quimbre Pour Hetic

## Description de l'Ontologie

Cette ontologie permet de modéliser des informations liées aux restaurants, en se basant sur des concepts personnalisés et inspirés de [schema.org](https://schema.org/). Elle inclut des informations telles que le nom du restaurant, son adresse, son évaluation, les horaires d'ouverture, les types de cuisines servies, et d'autres attributs essentiels pour représenter un restaurant.

---

## Classes et Propriétés

### **Restaurant**
Représente un restaurant.

- **Propriétés** :
    - **hasName** : Le nom du restaurant (type `xsd:string`).
    - **hasRating** : L'évaluation du restaurant (type `AggregateRating`).
    - **hasAddress** : L'adresse du restaurant (type `Address`).
    - **hasPhone** : Le numéro de téléphone (type `xsd:string`).
    - **hasWebsite** : L'URL du site web (type `xsd:anyURI`).
    - **hasOpeningHours** : Les horaires d'ouverture (type `OpeningHours`).
    - **hasCuisine** : Les types de cuisine servis (type `xsd:string`).
    - **hasPriceRange** : La plage de prix (type `xsd:string`).
    - **acceptsReservations** : Indique si le restaurant prend des réservations (type `xsd:boolean`).

### **AggregateRating**
Représente une évaluation globale d'un restaurant.

- **Propriétés** :
    - **ratingValue** : La note moyenne (type `xsd:decimal`).
    - **reviewCount** : Le nombre d'avis (type `xsd:integer`).

### **Address**
Représente l'adresse d'un restaurant.

- **Propriétés** :
    - **streetAddress** : La rue (type `xsd:string`).
    - **city** : La ville (type `xsd:string`).
    - **region** : La région (type `xsd:string`).
    - **postalCode** : Le code postal (type `xsd:string`).

### **OpeningHours**
Représente les horaires d'ouverture d'un restaurant.

- **Propriétés** :
    - **dayOfWeek** : Les jours d'ouverture (type `xsd:string`, valeurs multiples possibles).
    - **opens** : Heure d'ouverture (type `xsd:time`).
    - **closes** : Heure de fermeture (type `xsd:time`).

---

## Exemples de Requêtes SPARQL

### 1. Récupérer les noms et les évaluations des restaurants

Cette requête récupère les noms des restaurants et leurs notes moyennes.

```sparql
PREFIX ex: <https://example.org/ontology#>

SELECT ?restaurantName ?ratingValue
WHERE {
  ?restaurant a ex:Restaurant ;
              ex:hasName ?restaurantName ;
              ex:hasRating ?rating .
  ?rating ex:ratingValue ?ratingValue .
}
```

### 2. Récupérer les restaurants avec leur note moyenne et le nombre d'avis

Cette requête récupère les noms des restaurants, leurs notes moyennes et le nombre d'avis.

```sparql
PREFIX ex: <https://example.org/ontology#>

SELECT ?restaurantName ?ratingValue ?reviewCount
WHERE {
  ?restaurant a ex:Restaurant ;
              ex:hasName ?restaurantName ;
              ex:hasRating ?rating .
  ?rating ex:ratingValue ?ratingValue ;
          ex:reviewCount ?reviewCount .
}
```

### 3. Récupérer les restaurants avec leur type de cuisine et leur gamme de prix

Cette requête récupère les restaurants, leurs types de cuisine et leur gamme de prix.

```sparql
PREFIX ex: <https://example.org/ontology#>

SELECT ?restaurantName ?cuisineType ?priceRange
WHERE {
  ?restaurant a ex:Restaurant ;
              ex:hasName ?restaurantName ;
              ex:hasCuisine ?cuisineType ;
              ex:hasPriceRange ?priceRange .
}
```

### 4. Récupérer les horaires d'ouverture des restaurants

Cette requête récupère les noms des restaurants et leurs horaires d'ouverture pour chaque jour.

```sparql
PREFIX ex: <https://example.org/ontology#>

SELECT ?restaurantName ?dayOfWeek ?opens ?closes
WHERE {
  ?restaurant a ex:Restaurant ;
              ex:hasName ?restaurantName ;
              ex:hasOpeningHours ?openingHours .
  ?openingHours ex:dayOfWeek ?dayOfWeek ;
                ex:opens ?opens ;
                ex:closes ?closes .
}
```
