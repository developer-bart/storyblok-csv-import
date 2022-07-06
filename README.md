# Storyblok CSV Import

## How to use

### Install the dependencies of the project

```sh
npm install
```

### Setup your oauthToken

In the **./index.js**

```js
const Storyblok = new StoryblokClient({
  oauthToken: "Your_Personal_access_tokens", // Add your Personal access tokens here
  /* To obtain this access token, you need to be logged in to the storyblok and got My account> Personal access tokens, and copy or gene a new token
   */
})

const config = {
  spaceId: "127750", // Can be found in the space settings.
  parentFolder: "80975688", // parentFolder = GB/attributes or INT/attributes or NL/attributes. Take id at the end.
  specGroupId: "bab9cc2e-87ec-4418-9283-1fce23cf2b98", // Add the uuid from the specgroup that should be selected by default (change this per country, read the README.md to find out how to find the uuid)
  filePath: "failed/GB/", // Create a country folder in the failed folder and change the filepath manual per country
  writeFailuresToFile: false, // When set to false it will not overwrite en document the failed Storyblok uploads
}
```

❗️ Note: make sure you read all the steps carefully since some can overwrite stored data which cannot be retrieved.

### Find the id of the default specGroup

You can find the id of the default specGroup using graphql playground with the following query:

```graphql
query MyQuery {
  storyBlok {
    OattributeItems {
      items {
        content {
          title
          specGroup {
            uuid
          }
        }
      }
    }
  }
}
```

### Run the project

```sh
node index.js
```
