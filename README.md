# RecipeBook

RecipeBook is a web application for private users to create and maintain their own collection of recipes with an easy-to-use interface and ready-made recipe template. In addition to managing their own recipe collection, users can also view recipes from the public collection that consists of quality-checked recipes from other users.

<img src="/UI/src/img/recipeWhite.png" alt="recipe icon" height="300" />

## Project description

RecipeBook is a [MERN-stack application](https://www.mongodb.com/mern-stack):
- MongoDB Atlas as the database for storing and managing user and recipe data
- Node-Express RESTful API for user/recipe CRUD operations and managing user authentication and authorization
- React-Redux application as the user interface

Other technologies used in the development:
- Typescript
- ESLint
- Prettier
- Github actions

Application design:
- Initial design as a [Figma prototype](https://www.figma.com/proto/ckxBVBewDg2GooyFDt9cXc/Reseptikirjasto?page-id=0%3A1&node-id=2%3A2&viewport=-1239%2C-1045%2C0.94&scaling=scale-down&starting-point-node-id=9%3A163)
- React app constructed with components provided by [Material UI](https://mui.com/)

## Project status and future

RecipeBook application is still under development. The future plans include implementing some remaining features (such as recipe publication and user email confirmation), verifying the user data security, and turning the React UI into a [PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps) with scalable and responsive views for all screen sizes.

After completing the remaining tasks, the app is switched to production and it will be deployed with [Heroku](https://www.heroku.com/platform) or some similar service.
