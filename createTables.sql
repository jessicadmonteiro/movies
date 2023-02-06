CREATE DATABASE movies;
CREATE TABLE IF NOT EXISTS movies(
	id BIGSERIAL PRIMARY KEY,
	name VARCHAR(50) UNIQUE NOT NULL,
	description TEXT,
	duration SMALLINT NOT NULL,
	price SMALLINT NOT NULL
);

INSERT INTO
	movies(name, description, duration, price)
VALUES 
	('Avatar: O Caminho da Água', 'Após formar uma família, Jake Sully e Ney tiri fazem de tudo para ficarem juntos. No entanto, eles devem sair de casa e explorar as regiões de Pandora quando uma antiga ameaça ressurge, e Jake deve travar uma guerra difícil contra os humanos.', 180, 50);

SELECT 
	*
FROM 
movies;