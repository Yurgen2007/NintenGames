This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

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
NEXT_PUBLIC_API_URL=http://10.4.20.235:3000


Seguido de debera crear las respectibas migraciones y finalmente correr el proyecto con el siguiente comando 


```bash
npm run dev
```

