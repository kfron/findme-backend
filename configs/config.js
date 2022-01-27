const env = process.env;

const config = {
    db: {
        user: 'USER', 				// nazwa użytkownika, który ma dostęp do bazy danych 
        host: 'localhost', 
        database: 'd8p3p0h0ces8v4', // nazwa bazy danych
		password: 'PASSWORD',			// hasło użytkownika
        port: 5432					// port na którym działa proces psql (domyślnie 5432)
    }
}

module.exports = config;