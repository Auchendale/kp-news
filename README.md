# Northcoders News API

A [link](https://kp-news.onrender.com) to the hosted version on Render!

## ℹ️ Overview

This project is the backend API of a news website, similar to Reddit. It has plenty of endpoints to provide the user requested information in the database, such as: 
- GET `/api/articles`: gathering all articles,
- GET `/api/articles/:article_id`: finding a specific article,
- DELETE `/api/comments/:comment_id`: deleting a specific comment, or
- PATCH `/api/articles/:article_id`: updating an article's votes.

All of the features are fully tested for all of their properties, including error handling.

### ✍️ Author

I'm Kieran and I created this API as apart of my Northcoders Backend project week!

## ⬇️ A Guide to Installation

First use the following command to clone the repo in the folder of your choosing:

```py
git clone https://github.com/Auchendale/kp-news.git
```

Next, use `npm install` to install all of the dependencies required. We can now seed the database using the following set of commands:

```py
npm run setup-dbs

npm run seed
```

To test this API you can use `npm test app` - this runs the test suite titled `app.test.js` located in the `__tests__` folder.


To connect to the databases locally, please create two environment variables of the databases listed in 'setup.sql', respectively. These have been added to gitignore.



--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
