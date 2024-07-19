steps

1st
copiar el repo git bash clone here

2do npm install no importa lo deprecadito

3ro
keys database from connection string + password
DATABASE_URL add at the end of the url "&pgbouncer=true"
DIRECT_URL

4to
run npx prism db push and db will show on neontech
or the postgress database u use
5to
delete .git folder (oculto)
make a new github repo and
deploy project

actualizar
NEXT_PUBLIC_APP_URL en la variable de entorno de vercel
junto a la variable de entorno de google para la usar el provider de google y su api, generando al key que ira en esa variable de entorno.
recuerda que localmente el env de public url debera ser NEXT_PUBLIC_APP_URL=http://localhost:3000

6to
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
