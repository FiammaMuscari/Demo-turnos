# Pasos / Steps

## 1ro / 1st

Copiar el repo git bash clone here.  
Copy with git bash here.

![git_clone_bash](./public/readme/1.webp)

## 2do / 2nd

npm install no importa lo deprecadito.  
We do an npm install and don't worry about warnings.

## 3ro / 3rd

Agrega las variables de entorno para conectar la base de datos, como se ve en la siguiente imagen.  
Add environment variables to connect to the database, as shown in the following image.

Copia la URL completa más el password.  
Copy the full URL plus the password.

Agrega `DIRECT_URL` y `DATABASE_URL`, a esta última agrégale la siguiente línea:  
Add `DIRECT_URL` and `DATABASE_URL`, and to the latter add the following line:

```
&pgbouncer=true
```

**Ejemplo / Example:**

```
DATABASE_URL="postgresql://demo-turnos_owner:HtZf7a5ieXyx@ep-jolly-feather-a4rfb11l.us-east-1.aws.neon.tech/demo-turnos?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://demo-turnos_owner:HtZf7a5ieXyx@ep-jolly-feather-a4rfb11l.us-east-1.aws.neon.tech/demo-turnos?sslmode=require"
```

## 4to / 4th

Run / Corre.

```
npx prism db push
```

Y la base de datos se mostrará automáticamente en las tablas de Neontech o en la base de datos Postgres de preferencia.  
And our database will automatically show up in Neontech tables or in the preferred Postgres database.

## 5to / 5th

Elimina la carpeta `.git` oculta.  
Delete the hidden `.git` folder (protected).

![git_folder](./public/readme/3.webp)

Crea un nuevo repo en GitHub y haz el deploy.  
Create a new GitHub repo and deploy it on Vercel.

## 6to / 6th

Actualizar `NEXT_PUBLIC_APP_URL` en la variable de entorno de Vercel junto a la variable de entorno de Google para usar el provider y su API, generar la key.  
Update `NEXT_PUBLIC_APP_URL` from Vercel deploy settings, also the Google one to use API and provider.

_(Recuerda que localmente el env de public URL deberá ser `NEXT_PUBLIC_APP_URL=http://localhost:3000`)_  
_(Remember that locally the public URL env should be `NEXT_PUBLIC_APP_URL=http://localhost:3000`)_

## 7mo / 7th

Ir a la consola de Google APIs credentials.  
Go to the Google APIs credentials console.

Crea el proyecto.  
Create the project.

Visita:  
https://console.developers.google.com/apis/credentials  
Create project.

**OAuth credentials:**  
Configurar pantalla de consentimiento URL deploy.  
In credentials, create the OAuth client.  
This is to integrate our provider in production.  
Aquí obtenemos el `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`.  
Here we obtain the `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

![cred_config](./public/readme/4.webp)

Vamos a agregar estas variables de entorno en los settings de Vercel y hacer un push para ver los cambios en producción.  
We will add these environment variables in the Vercel settings and push to see the changes in production.

También modificamos el URI para usar localmente y en producción nuestro inicio de sesión con Google.  
We also modify the URI to use locally and in production for our Google login.
![uri_config](./public/readme/5.webp)

## 8vo / 8th

Logear con el mail para usar de admin, crea el user en la DB.  
Log in with the email to use as admin, create the user in the DB.

## 9no / 9th

Agregar servicios y admin usando la siguiente consulta:  
Add services and admin by using the next query:

```
UPDATE "User"
SET role = 'ADMIN'
WHERE id = 'id-from-user-here';
```

![admin](./public/readme/8.webp)
![admin2](./public/readme/9.webp)

## 10mo / 10th

Mercado Pago

https://www.mercadopago.com.ar/developers/es

tus integraciones > crear aplicación  
Your integrations > create application  
![mp_config](./public/readme/6.webp)  
importante elegir CheckoutPro  
important to choose CheckoutPro

Ahora vamos a Credenciasles de producción > seleccionamos una industria y activamos credenciales de producción, recomiendo tener el deploy hecho en esta instancia.  
Now we go to Production Credentials > select an industry and activate production credentials, I recommend having the deploy done at this stage.

De acá obtenemos el Acces Token, recordar hacerlo en la variable de entorno del deploy.
From here we obtain the Access Token, remember to set this in the environment variable for the deployment.  
![mp_config2](./public/readme/7.webp)

```
MP_ACCESS_TOKEN=APP_USR-1043861622129703-101301-6f99886c5140a0dc316fee6da2e99aca-318253112
```

## 11mo / 11th

Modificamos nuestra variable de enorno en produccion para NEXT_PUBLIC_APP_URL así funcionara nuestro sandbox y preferencia de mercado pago en el deploy.  
We modify our environment variable in production for NEXT_PUBLIC_APP_URL so that our sandbox and Mercado Pago preferences work in the deploy.

¡Listo!, Done!

Ahora al iniciar sesión como admin se puede agregar precios a los servicios, ver turnos y más.  
Now you can log in as admin, add prices to services, see appointments, and more.
