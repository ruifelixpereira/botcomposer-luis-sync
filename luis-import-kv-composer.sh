# Settings
LUIS_ENDPOINT=https://westeurope.api.cognitive.microsoft.com
LUIS_AUTHORING_KEY_SECRET_NAME=luisAuthoringKey
TRANSLATOR_KEY_SECRET_NAME=translatorKey

# Validate variables
if [ $# -eq 2 ]; then
    export KEY_VAULT_NAME=$1
    export MY_BOT_DIR=$2
else
    echo "Usage: ./luis-import-kv-composer.sh <keyvault_name> <bot_dir>"
    exit 1
fi

# Get LUIS APP ID
for row in $(node ./bin/index.js -d ${MY_BOT_DIR} | jq -c '.[]'); do
    
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

done
