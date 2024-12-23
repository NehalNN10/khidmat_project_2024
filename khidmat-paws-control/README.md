This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Setup - for teammates

run "npm install" to ensure you get a node_modules folder ready and all packages are installed before

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

## For my teammates

Some notes for what is where:

- main pages reside in app folder. Here 'page.js' has our initial page. All the subfolders refer to separate routes.
-> e.g. access pets page by going to localhost:3000/pets

- components folder is normally used for reusable things. Currently, it has bare minimum Navbar component

- public folder will contain any static assets like logos etc.

- package.json has main configuration for running app etc and is updated automatically as we add more packages/libraries