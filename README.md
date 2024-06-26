# Market Facil Backend

## Bienvenidos a la instalación del sistema

### Primeros pasos

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/tapiagarrido/backendavanzado_stock.git
   ```

2. **Instalar paquetes:**

   ```bash
   npm i
   ```

3. **Generar un archivo `.env` basado en el template:**

   Puede ser de manera gráfica o mediante el siguiente comando:

   ```bash
   mv .env.template .env
   ```

4. **Crear una base de datos en PostgreSQL y cambiar los parámetros dentro del `.env`:**

   ```env
   POSTGRES_URL
   POSTGRES_USER
   POSTGRES_DB
   POSTGRES_PORT
   POSTGRES_PASSWORD
   ```

5. **Generar variables para `jsonwebtoken`:**

   ```env
   JWT_SEED
   ```

6. **Configurar datos para envío de correos:**

   ```env
   SEND_EMAIL
   MAILER_SERVICE
   MAILER_EMAIL
   MAILER_SECRET_KEY
   ```

7. **Definir URL donde se activará la cuenta de usuario:**

   En caso de solo utilizar backend, el puerto debe ser el mismo de `PORT`.

   ```env
   WEBSERVICE_URL=http://localhost:3000/api/auth/activar-cuenta
   ```

8. **Definir parámetros de comunicación con microservicio de ventas:**

   El `X_SECRET_ESPERADO` debe ser el mismo que el solicitado en el microservicio.

   ```env
   API_VENTAS=http://127.0.0.1:8000/api/
   X_SECRET_ESPERADO=secretdeheaderqueestaesperandodesdeelotroservicio
   ```

9. **Generar tablas mediante Prisma:**

   ```bash
   npx migrate prisma
   ```

10. **Agregar parámetros mediante SQL ubicado en la carpeta:**

    `root/src/infraestructura/data_inicial/script_data_inicial.sql`

11. **Comenzar a poblar la base de datos mediante los archivos `rest.client` en la carpeta `docs`:**
   utilizar la extension rest.client para mayor comodidad

    - Generar usuario, activar cuenta y loguear para obtener token: en `auth.rest`.
    - Poblar `categoria`, `linea`, `local`, `tipo`, `unidadMedidaVenta` en sus respectivos archivos para luego utilizar la data en `maestraArticulo`.
    - Poblar `maestraArticulo`.
    - Generar stock en `stock.rest` para luego poder realizar ventas.

12. **Si la data está cargada en stock y el microservicio de ventas está corriendo, podemos utilizar `api_ventas.rest` para ejecutar una venta.**

¡Listo! Ahora puedes disfrutar de tu sistema Market Facil Backend.