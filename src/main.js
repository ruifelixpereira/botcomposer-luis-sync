const composer = require('./composer');
const application = require("./application");
const utils = require('./utils');
const BError = require("./berror").BError;
const convert = require('./convert');
const fs = require('fs-extra');


const run = async(botdirectory, endpoint, subscriptionkey) => {

    // Get LUIS authoring key from Azure KeyVault
    //SUBSCRIPTION_KEY=$(az keyvault secret show --name ${LUIS_AUTHORING_KEY_SECRET_NAME} --vault-name ${KEY_VAULT_NAME} --query value -o tsv)

    // Read LUIS settings
    const luisApps = composer.readLuisSettings(botdirectory);
    //console.log(JSON.stringify(luisApps));

    let params = {
        subscriptionKey: '' + subscriptionkey,
        endpoint: '' + endpoint,
        appId: ''
    }

    await Promise.all(luisApps.map(async (app) => {

        const outFile = app.raw;
        params.appId = app.appId;
        const finalFile = app.fullPath;
        //console.log('Final path: ' + finalFile);

        try {
            // Show LUIS app details and get active version
            //ACTIVE_VERSION=$(bf luis:application:show --appId ${LUIS_APP_ID} --endpoint ${LUIS_ENDPOINT} --subscriptionKey ${SUBSCRIPTION_KEY} | jq -r ".activeVersion")
            const appData = await application.default.show(params)

            if (appData) {
                //await utils.writeToConsole(appData.activeVersion)

                // Export version into JSON
                // bf luis:version:export --out ${OUT_FILE}.json --force --versionId ${ACTIVE_VERSION} --appId ${LUIS_APP_ID} --endpoint ${LUIS_ENDPOINT} --subscriptionKey ${SUBSCRIPTION_KEY}
                const versionData = await application.default.exportVersion(params, appData.activeVersion)

                if (versionData) {
                    //await utils.writeToConsole(versionData)
                    await utils.writeToFile(outFile + '.json', versionData, true)

                    // Convert .json to .lu
                    // bf luis:convert --in ${OUT_FILE}.json --out ${OUT_FILE}.lu --force
                    await convert.convertJsonToLu(outFile + '.json', outFile + 'converted.lu')

                    // rm -json
                    //rm -f ${OUT_FILE}.json
                    try {
                        fs.unlinkSync(outFile + '.json')
                    } catch(err) {
                        console.log('Error removing temp file (' + outFile + '.json) - ' + err)
                    }
                
                    // remove None line
                    //sed --in-place '/# None/d' ${OUT_FILE}.lu
                
                    // mv file
                    //mv ${OUT_FILE}.lu ${FINAL_FILE}
                    await fs.move(outFile + 'converted.lu', finalFile, { overwrite: true })
                
                }
                else {
                    throw new BError('No LUIS data to export for active version - ' + appData.activeVersion + '.');
                }

                /*
                // Export LU
                const versionDataLu = await application.default.exportVersion(params, appData.activeVersion, 'lu')

                if (versionDataLu) {
                    //await utils.writeToConsole(versionData)
                    await utils.writeToFile(outFile + '.lu', versionDataLu, true)
                }
                */
                
                console.log('Successfully wrote LUIS model to ' + finalFile);

            }
        } catch (err) {
            throw new BError(`Failed to retrieve application data: ${err}`)
        }

    /*
    OUT_FILE=$(echo $row | jq -r '.raw')
    LUIS_APP_ID=$(echo $row | jq -r '.appId')
    FINAL_FILE=$(echo $row | jq -r '.fullPath')

    #az account set -s $(SHARED_SUBSCRIPTION)
    SUBSCRIPTION_KEY=$(az keyvault secret show --name ${LUIS_AUTHORING_KEY_SECRET_NAME} --vault-name ${KEY_VAULT_NAME} --query value -o tsv)
    #TRANSLATOR_KEY=$(az keyvault secret show --name ${TRANSLATOR_KEY_SECRET_NAME} --vault-name ${KEY_VAULT_NAME} --query value -o tsv)

    # Show LUIS app details and get active version
    ACTIVE_VERSION=$(bf luis:application:show --appId ${LUIS_APP_ID} --endpoint ${LUIS_ENDPOINT} --subscriptionKey ${SUBSCRIPTION_KEY} | jq -r ".activeVersion")
    echo "Active version: ${ACTIVE_VERSION}"

    # Export version into JSON
    bf luis:version:export --out ${OUT_FILE}.json --force --versionId ${ACTIVE_VERSION} --appId ${LUIS_APP_ID} --endpoint ${LUIS_ENDPOINT} --subscriptionKey ${SUBSCRIPTION_KEY}

    # Convert .json to .lu
    bf luis:convert --in ${OUT_FILE}.json --out ${OUT_FILE}.lu --force

    # rm -json
    rm -f ${OUT_FILE}.json

    # remove None line
    sed --in-place '/# None/d' ${OUT_FILE}.lu

    # mv file
    cp ${OUT_FILE}.lu ${FINAL_FILE}

    rm -f ${OUT_FILE}.lu
*/
    }));
}


module.exports.run = run;