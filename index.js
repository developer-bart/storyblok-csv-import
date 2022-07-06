const fs = require("fs")
const csvReader = require("fast-csv")
const StoryblokClient = require("storyblok-js-client")
const slugify = require("slugify")
const chalk = require("chalk")

// Initialize the client with the oauth token
const Storyblok = new StoryblokClient({
  oauthToken: "", // Can be found in your My account section
})

// Configuration options
const config = {
  spaceId: "127750", // Can be found in the space settings.
  parentFolder: "80975688", // parentFolder = GB/attributes or INT/attributes or NL/attributes. Take id at the end.
  specGroupId: "bab9cc2e-87ec-4418-9283-1fce23cf2b98",
  filePath: "failed/GB/", // Create a country folder in the failed folder and change the filepath manual per country
  writeFailuresToFile: false, // When set to false it will not overwrite en document the failed Storyblok uploads
}

// Create a file for failed Storyblok uploads
if (config.writeFailuresToFile) {
  fs.writeFile(`${config.filePath}${config.parentFolder}.txt`, "", (error) => {
    if (error) {
      console.log(chalk.red("Error:"), error)
    } else {
      console.log(
        chalk.green("Success:"),
        `created ${config.parentFolder}.txt to store failed Storyblok uploads.`
      )
    }
  })
}

let stream = fs.createReadStream("accell.csv")

csvReader
  .parseStream(stream, { headers: true, delimiter: ";" })
  .on("data", (line) => {
    let story = {
      slug: slugify(line.Label, {
        lower: true,
        strict: true,
      }),
      name: line.Label,
      parent_id: config.parentFolder,
      content: {
        component: "OAttribute",
        title: line.Label,
        specGroup: config.specGroupId,
        explanation: [],
        ecomAttributeName: line.ExternalKey,
        ecomAttributeConnected: "",
      },
    }

    Storyblok.post(`spaces/${config.spaceId}/stories/`, {
      story,
    })
      .then((res) => {
        console.log(
          `${chalk.green("Success:")} ${res.data.story.name} was created.`
        )
      })
      .catch((error) => {
        if (config.writeFailuresToFile) {
          // Store the failed posts in a file per parent folder
          const content = {
            title: line.Label,
            ecomAttributeName: line.ExternalKey,
          }

          fs.appendFile(
            `${config.filePath}${config.parentFolder}.txt`,
            `title: ${line.Label}\recomAttributeName: ${line.ExternalKey}\r------------------------------------\r`,
            (error) => {
              chalk.red("Error:"),
                `failed to write ${line.Label}/${line.ExternalKey} to ${config.filePath}${config.parentFolder}.txt}.`
            }
          )
        }

        // Log out the error
        console.log(
          `${chalk.red(`Error:`)} failed to create for ${line.Label}.`
        )
        console.log(
          `${chalk.red(`${error.response.status}:`)} ${
            error.response.statusText
          }.`
        )
        console.log(chalk.red("-----"))
      })
  })
