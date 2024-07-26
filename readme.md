# Pasos / steps

## 1ro

Copiar el repo git bash clone here.
Copy with git bash here.

![git_clone_bash](./public/readme/1.webp)

## 2do

npm install no importa lo deprecadito. We do an npm install and dont worry about warnings.

## 3ro

Agrega las variables de entorno para conectar la base de dato, como se ve en la siguiente imagen copia la url completa más el password.Agrega DIRECT_URL y DATABASE_URL, a esta ultima agregale la siguiente linea.
Add keys from database to connect, it will be string + password.DIRECT_URL
DATABASE_URL and add at the end of the url the next line:

```
&pgbouncer=true
```

![url_with_pass](./public/readme/2.webp)
Example:

```
DATABASE_URL="postgresql://demo-turnos_owner:HtZf7a5ieXyx@ep-jolly-feather-a4rfb11l.us-east-1.aws.neon.tech/demo-turnos?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://demo-turnos_owner:HtZf7a5ieXyx@ep-jolly-feather-a4rfb11l.us-east-1.aws.neon.tech/demo-turnos?sslmode=require"
```

## 4to

Run / corre.

```
npx prism db push
```

Y la base de datos se mostrara automaticamente en las tablas de Neontech o en la base de datos Postgress de preferencia.
And our db it will show on neontechl, we can search on tables or use another postgress db.

## 5to

Elimina la carpeta .git oculta. Delete .git folder (protected).

![git_folder](./public/readme/3.webp)

Crea un nuevo repo en github y hace el deploy. Make a new github repo and deploy it on Vercel.

## 6to

Actualizar NEXT_PUBLIC_APP_URL en la variable de entorno de vercel
junto a la variable de entorno de google para la usar el provider y su api, generar la key

Update NEXT_PUBLIC_APP_URL from vercel deploy settings, also google one to use api and provider.

_(recuerda que localmente el env de public url debera ser NEXT_PUBLIC_APP_URL=http://localhost:3000)_

_(use NEXT_PUBLIC_APP_URL=http://localhost:3000 locally)_

## 7mo

Ir a la consola de google apis credentials
https://console.developers.google.com/apis/credentials
Crea el projecto

go to
https://console.developers.google.com/apis/credentials
create project

oath credentials
configurar pantalla de consentimiento url deploy
llenamos como aparece en las imagenes
luego en credenciales creamos el cliente oauth
es para integrar nuestro provider en produccion
aca obtenemos el GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET

vamos a agregar estas variables de entorno en los setings de vercel y hacer un push para ver los cambios en prod.

7to
google keys

logear con el mail para usar de admin, crea el user en la db

8to
add services and admin by using the next query
UPDATE "User"
SET role = 'ADMIN'
WHERE id ="id-from-user-here"

9vo done
