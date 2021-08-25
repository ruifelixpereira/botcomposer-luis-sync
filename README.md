# Introduction to botcomposer-luis-sync

The goal is to make possible changing LUIS models both through Bot Composer and LUIS management console.

Bot Composer, when publishing, always overwrites the existing deployed LUIS model, even if it was changed outside Bot Composer.
The ideia is to import the model into Bot Composer before it's published again, avoiding losing eventual changes in between.

## Step 1. Install pre-requisites

### BF Command Line Interface
The botcomposer-luis-sync uses the **BF Command Line Interface** making it a pre-requisite. 

You need to ahve Node.js version 14 and you can install the BF Command Line Interface with:

```
npm i -g @microsoft/botframework-cli
```

### Azure CLI
The botcomposer-luis-sync uses the Azure CLI aka **az cli** making it a pre-requisite.
There are several options to [install](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) it.

### Tool to extract LUIS keys
The botcomposer-luis-sync uses a small tool to extract LUIS keys from the Bot Composer application files. This tool is a NodeJS program that is provided in `./bin/index.js`.

For this tool to run you only need to install the package dependencies with:
```
npm install
``` 

## Step 2. Azure KeyVault secrets

To avoid populating automation scripts with credentials and secrets, botcomposer-luis-sync uses Azure Key Vault to store the LUIS authoring key.

You need to create in your own Azure Key Vault instance a new secret with name `luisAuthoringKey` and populate it with your LUIS authoring key.


## Step 3. Invoke the provided script to collect the active version of your LUIS model

Just run:
```
./luis-import-kv-composer.sh <keyvault_name> <bot_dir>"
```

That needs 2 mandatory parameters:
- *<keyvault_name>* - your Azure Key Vault instance name
- *<bot_dir>* - your Bot Composer application directory

Example:

```
./luis-import-kv-composer.sh mykeyvault /mnt/c/wb/dev/bots/poc/LuisDevSync
```
