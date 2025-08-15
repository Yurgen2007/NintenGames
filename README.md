Pasos a seguir para colonar el repositorio

#1 primeramente clonamos el repositorio

```bash
git clone https://github.com/Yurgen2007/NintenGames.git
```

#2 seguidamente intalamos dependencias con el siguiente comando:

```bash
npm install



##Si las dependencias no se instalan correctamente ejecutamos el siguiente comando:
npm install --force
```

Seguidamente en la raiz del proyecto creamosnuestro archivo .env y agregamos las siguiente configuración:

DATABASE_URL="mysql://root:@localhost:3306/nintengames"
JWT_SECRET=tu_clave_secreta_segura
NEXT_PUBLIC_API_URL=http://localhost:3000

seguidamente se debera crear las respectibas migraciones y finalmente correr el proyecto con el siguiente comando

```bash
npm run dev
```
