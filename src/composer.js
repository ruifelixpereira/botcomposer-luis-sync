
const fs = require('fs');

const readLuisSettings = (botcomposerAppDir) => {

    /*
    * Read appsettings.json file
    */
    let settingsRaw = fs.readFileSync(botcomposerAppDir + '/settings/appsettings.json');
    let settings = JSON.parse(settingsRaw);


    /*
    * Read LUIS settings file
    */
    let luisRaw = fs.readFileSync(botcomposerAppDir + '/generated/luis.settings.composer.westeurope.json');
    let luisSettings = JSON.parse(luisRaw);
    const luisKeys = Object.keys(luisSettings.luis);

    let luisApps = [];

    luisKeys.forEach(element => {

        // check if it is the root bot name
        const isRoot = element.startsWith(settings.luis.name);

        // extract lang
        const lang = element.substring(element.length-8, element.length-6) + "-" + element.substring(element.length-5, element.length-3);

        // extract name
        const name = element.substring(0, element.length-9);

        // build file name
        const file = name + "." + lang + ".lu";

        // build folder
        const folder = isRoot ? "language-understanding/" + lang : "dialogs/" + name + "/language-understanding/" + lang;

        // app
        const app = {
            raw: element,
            name: name,
            isRoot: isRoot,
            file: file,
            lang: lang,
            folder: folder,
            fullPath: botcomposerAppDir + "/" + folder + "/" + file,
            appId: luisSettings.luis[element].appId,
            version: luisSettings.luis[element].version
        }

        luisApps.push(app);
    });

    return luisApps;
}

module.exports.readLuisSettings = readLuisSettings;
