// @flow

const { graphql, buildSchema } = require('graphql');
const StarWarsAPI = require('./swapi');
const createSwapiLoaders = require('./swapi-loaders');

const createSWAPIServer = () => {
    const swapiLoaders = createSwapiLoaders.default(StarWarsAPI());

    const schema = buildSchema(/* GraphQL */ `
        type Person {
            name: String
            height: String
            mass: String
            hair_color: String
            skin_color: String
            eye_color: String
            birth_year: String
            gender: String
            homeworld: String
            species: [Species]
            vehicles: [Vehicle]
            films: [Film]
            starships: [Starship]
            created: String
            edited: String
            url: String
        }
        type Vehicle {
            name: String
        }
        type Starship {
            name: String
        }
        type Planet {
            name: String
            climate: String
            diameter: String
        }
        type Film {
            name: String
            created: String
            director: String
        }
        type Species {
            name: String
            classification: String
            designation: String
            average_height: String
            skin_colors: String
            hair_colors: String
            eye_colors: String
            average_lifespan: String
            homeworld: String
            language: String
            people: [Person]
            films: [Film]
            created: String
            edited: String
            url: String
        }

        type Query {
            planet(id: Int): Planet
            film(id: Int): Film
            species(id: Int): Species
        }
    `);

    class PlanetModel {
        id: number;

        constructor(id: number) {
            this.id = id;
        }

        async name() {
            const response = await swapiLoaders.getPlanets.load({ planet_id: this.id });

            if (response instanceof Error) {
                return response;
            }

            if (response) {
                return response.name;
            }
        }

        async climate() {
            const response = await swapiLoaders.getPlanets.load({ planet_id: this.id });

            if (response instanceof Error) {
                return response;
            }

            if (response) {
                return response.climate;
            }
        }

        async diameter() {
            const response = await swapiLoaders.getPlanets.load({ planet_id: this.id });

            if (response instanceof Error) {
                return response;
            }

            if (response) {
                return response.diameter;
            }
        }
    }
    class FilmModel {
        id: number;

        constructor(id: number) {
            this.id = id;
        }
        async created() {
            const response = await swapiLoaders.getFilms.load({ film_id: this.id });

            if (response instanceof Error) {
                return response;
            }

            if (response) {
                return response.created;
            }
        }

        async director() {
            const response = await swapiLoaders.getFilms.load({ film_id: this.id });

            if (response instanceof Error) {
                return response;
            }

            if (response) {
                return response.director;
            }
        }
    }
    class SpeciesModel {
        id: number;

        constructor(id: number) {
            this.id = id;
        }
        async name() {
            const response = await swapiLoaders.getSpecies.load({ species_id: this.id });

            if (response instanceof Error) {
                return response;
            }

            if (response) {
                return response.name;
            }
        }

        async classification() {
            const response = await swapiLoaders.getSpecies.load({ species_id: this.id });

            if (response instanceof Error) {
                return response;
            }

            if (response) {
                return response.classification;
            }
        }
        async homeworld() {
            const response = await swapiLoaders.getSpecies.load({ species_id: this.id });

            if (response instanceof Error) {
                return response;
            }

            if (response) {
                return response.homeworld;
            }
        }
    }
    class PeopleModel {
        id: number;

        constructor(id: number) {
            this.id = id;
        }
        async name() {
            const response = await swapiLoaders.getPeople.load({ people_id: this.id });

            if (response instanceof Error) {
                return response;
            }

            if (response) {
                return response.name;
            }
        }

        async species() {
            const response = await swapiLoaders.getPeople.load({ people_id: this.id });

            if (response instanceof Error) {
                return response;
            }

            if (response) {
                return response.species;
            }
        }
        async homeworld() {
            const response = await swapiLoaders.getPeople.load({ people_id: this.id });

            if (response instanceof Error) {
                return response;
            }

            if (response) {
                return response.homeworld;
            }
        }
    }

    const root = {
        species: ({ id }) => {
            return new SpeciesModel(id);
        },
        planet: ({ id }) => {
            return new PlanetModel(id);
        },
        film: ({ id }) => {
            return new FilmModel(id);
        },
        people: ({ id }) => {
            return new PeopleModel(id);
        },
    };

    return { schema, root };
};

const runQuery = query => {
    const { schema, root } = createSWAPIServer();
    return graphql(schema, query, root);
};

runQuery(/* GraphQL */ `
    query {
        alderaan: planet(id: 2) {
            name
            climate
            diameter
        }
        hoth: planet(id: 4) {
            name
        }
        
        dagobah: planet(id: 5) {
            name
        }
        bespin: planet(id: 6) {
            name
        }
        episode5: film(id: 5) {
            director
            created
        }
        hutt: species(id: 5) {
            name
            classification
        }
    }
`).then(result => {
    console.log(JSON.stringify(result, null, 4));
});
