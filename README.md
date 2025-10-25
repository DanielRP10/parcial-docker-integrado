Parcial 2 – Implantación de Sistemas

Ejercicio 1 — Servicio base con Dockerfile

Archivos:

* server.js: API con endpoints / y /health.
* package.json y package-lock.json: dependencias Node.
* Dockerfile: construye imagen Node.js usando node:18-alpine.
* .dockerignore: excluye node_modules, .git, logs, .env.

Comandos:

* docker build -t parcial-api .
* docker run -d --name parcial-api-c -p 3000:3000 parcial-api
* docker logs -f parcial-api-c
* curl [http://localhost:3000/](http://localhost:3000/)
* curl [http://localhost:3000/health](http://localhost:3000/health)

Verificaciones:

* Contenedor se levanta sin errores.
* / devuelve datos del estudiante.
* /health devuelve { "status": "OK" }.
* Dockerfile usa USER node (no root).
* Imagen con tamaño < 200MB.

---

Ejercicio 2 — PostgreSQL con volumen persistente

Variables de entorno (.env):
POSTGRES_USER=admin
POSTGRES_PASSWORD=12345
POSTGRES_DB=parcial_db
DB_HOST=db
DB_PORT=5432
DB_USER=admin
DB_PASSWORD=12345
DB_NAME=parcial_db
ESTUDIANTE_NOMBRE=Daniel Alexander Reyes perez
ESTUDIANTE_EXPEDIENTE=26032
ESTUDIANTE_CODIGO=RP22-I04-002
PORT=3000

Levantar PostgreSQL:

* docker volume create db_data
* docker run -d --name parcial-db -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=12345 -e POSTGRES_DB=parcial_db -p 5432:5432 -v db_data:/var/lib/postgresql/data postgres:16-alpine

Crear tabla y datos:

* docker exec -i parcial-db psql -U admin -d parcial_db <<'SQL'
  CREATE TABLE IF NOT EXISTS estudiantes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  expediente VARCHAR(40) NOT NULL,
  codigo VARCHAR(40) NOT NULL
  );
  INSERT INTO estudiantes (nombre, expediente, codigo)
  VALUES ('Daniel Alexander Reyes perez', '26032', 'RP22-I04-002')
  ON CONFLICT DO NOTHING;
  SQL

Verificar persistencia:

* docker exec -i parcial-db psql -U admin -d parcial_db -c "SELECT * FROM estudiantes;"
* docker restart parcial-db
* docker exec -i parcial-db psql -U admin -d parcial_db -c "SELECT * FROM estudiantes;"

Logs y evidencias:

* docker logs -n 50 parcial-db > docs/evidencias/Ej2_db-logs.txt
* docker exec -i parcial-db psql -U admin -d parcial_db -c "SELECT * FROM estudiantes;" > docs/evidencias/Ej2_estudiantes.txt

---

Ejercicio 3 — Integración completa con Docker Compose

docker-compose.yml:

* Versión: 3.8
* Red: app_net
* Volumen: db_data (externo)
* Servicios:

  * db con healthcheck y variables de .env
  * api que depende de db healthy y expone puerto 3000

Levantar stack:

* docker compose up -d --build
* docker compose ps

Probar endpoints:

* curl [http://localhost:3000/](http://localhost:3000/)
* curl [http://localhost:3000/health](http://localhost:3000/health)
* curl [http://localhost:3000/db-check](http://localhost:3000/db-check)

Capturar evidencias:

* mkdir -p docs/evidencias
* docker compose ps > docs/evidencias/Ej3_compose-ps.txt
* docker logs -n 200 parcial-api > docs/evidencias/Ej3_api-logs.txt
* docker logs -n 200 parcial-db > docs/evidencias/Ej3_db-logs.txt
* curl -s [http://localhost:3000/](http://localhost:3000/) > docs/evidencias/Ej3_root.json
* curl -s [http://localhost:3000/health](http://localhost:3000/health) > docs/evidencias/Ej3_health.json
* curl -s [http://localhost:3000/db-check](http://localhost:3000/db-check) > docs/evidencias/Ej3_db-check.json
* docker exec -i parcial-db psql -U admin -d parcial_db -c "SELECT * FROM estudiantes;" > docs/evidencias/Ej3_consulta-estudiantes.txt

Verificaciones finales:

* docker-compose.yml funcional y versión 3.8
* Red app_net creada automáticamente
* API y DB comunican correctamente
* Healthcheck DB marca healthy
* API devuelve conexión exitosa con DB (/db-check)
* README documenta comandos y resultados
* Evidencias agregadas en /docs/evidencias

