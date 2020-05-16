// @flow

const { graphql, buildSchema } = require('graphql');
const StarWarsAPI = require('./swapi');
const createSwapiLoaders = require('./swapi-loaders');

const createSWAPIServer = () => {
    const swapiLoaders = createSwapiLoaders.default(StarWarsAPI());

    const schema = buildSchema(/* GraphQL */ `
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

        type Query {
            planet(id: Int): Planet
            film(id: Int): Film
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

    const root = {
        planet: ({ id }) => {
            return new PlanetModel(id);
        },
        film: ({ id }) => {
            return new FilmModel(id);
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
    }
`).then(result => {
    console.log(JSON.stringify(result, null, 4));
});
