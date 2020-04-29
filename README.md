# Digital-112

A Value Story Generator for your business. Highly customisible for personalised use.

Following products are part of the above mentioned project.

- [x] 51-100 Renewal generator
- [ ] Presentation generator
- [ ] Marketing material generator

### Prerequisites

**You will have to configure a env file to run the project.** <br>
Please rename the .env.example file to .env and enter your environment settings.

**Note:** Please refer the [directory structure convention](#directory).

## Getting Started

- **[Clone](https://help.github.com/articles/cloning-a-repository/)** the repository in your local system.
  `git clone https://github.com/digital-112/pptgen-fe.git`

- It will create a directory called `pptgen-fe` inside the current folder.<br>
  Inside that directory, it will generate the project structure with below files.

  ```
  pptgen-fe
  ├── README.md
  ├── node_modules
  ├── package.json
  ├── .gitignore
  ├── .storybook
  ├── public
  │   ├── favicon.ico
  │   ├── index.html
  │   └── manifest.json
  └── src
      ├── pages
      ├── assets
      ├── routes
      ├── components
      ├── store
      ├── utils
      ├── services
      ├── tools
      │   ├── presentation
      │   ├── renewal
      │   └── placemat
      └── globalStyle.js
      └── history.js
      └── serviceWorker.js
      └── index.js
      └── Provider.js
      └── README.md
  ```

- Run `npm install` in the directory to include all the dependencies.

- Now run `npm run start` to start your local development server.

## Running the tests

Automated tests has been set for the repository. You can run test by below command
`npm run test`

## Creating a production build

Builds the app for production to the build folder.
It correctly bundles React in production mode and optimizes the build for the best performance.
`npm run build`

## Error Tracking

- [Sentry](https://sentry.io) - Sentry has been used to track any error/break in the product. Please ensure that the SENTRY_DSN and SENTRY_ENVIRONMENT for the sentry config has been added in the env.
  Sentry setup docs: https://docs.sentry.io/platforms/javascript/react/  
  The tracked issues can be found here: https://sentry.io/organizations/prdxn/issues/?project=1723122

## Built With

- [React](https://reactjs.org/) - The frontend is built on javascript library named React.

## Browser Support

| ![Chrome](https://cloud.githubusercontent.com/assets/398893/3528328/23bc7bc4-078e-11e4-8752-ba2809bf5cce.png) | ![Firefox](https://cloud.githubusercontent.com/assets/398893/3528329/26283ab0-078e-11e4-84d4-db2cf1009953.png) | ![Safari](https://cloud.githubusercontent.com/assets/398893/3528331/29df8618-078e-11e4-8e3e-ed8ac738693f.png) |
| ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Latest ✔                                                                                                      | Latest ✔                                                                                                       | Latest ✔                                                                                                      |

### References

[Architecture](https://docs.google.com/document/d/1zGZ5OBqTdcz-pmOGdYrU51Ahv5malLifnaQXow3aFAU/edit?usp=sharing)

[Architecture notes](https://docs.google.com/document/d/1v8P2m_I32znmUd20S3FlwzSQBsl6uT0KHbL-BH3fHs4/edit?usp=sharing)

<a name="directory"></a>[Directory Structure](https://docs.google.com/document/d/1ccJlhx1HJP8WIaKYLQG6jO9tycVqT714bQs275MAFBU/edit)

[Folder Structure](https://docs.google.com/document/d/10tjoPZi43uDBpDRNuOIvnBjFTegm3BkhsYayQICXyLI/edit)
