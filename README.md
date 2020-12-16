<h3 align="center">
  E-commerce shop
</h3>


<p align="center">
  Online shop with stripe payments, based on Next.js
</p>

<img src="https://i.imgur.com/UjGmXZW.gif" />

## Demo

[Here](https://e-commerce-next.herokuapp.com/)
Credentials:
  email: withoutaccess@mail.com
  password: 123456

## Tech stack

* [Next.js](https://nextjs.org/): For server side (static) rendering.

  I chose Next.js because in this project I need a static generation for most of pages. Static generation is useful for pages that need to be indexed by search engines 

* [Stripe](https://stripe.com/): Payments.

  I chose Stripe because it's the most developer friendly online payments system in my opinion.

* [Knex.js](https://knexjs.org/): SQL query builder.

* [next-i18next](https://github.com/isaachinman/next-i18next): I18n for Next.js

* [Postgresql](https://www.postgresql.org/): SQL Database

## Features

* Search products
* Admin dashboard
* Checkout with stripe
* Different rights for admins 

## How to start locally

```
1) Clone repo
2) Create database (example ./database.sql)
2) yarn install
3) Create and edit .env.local file how in next.config.js 
4) yarn dev
```
