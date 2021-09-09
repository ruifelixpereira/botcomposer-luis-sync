# Introduction to botcomposer-luis-sync

The goal is to make possible changing LUIS models both through Bot Composer and LUIS management console.

Bot Composer, when publishing, always overwrites the existing deployed LUIS model, even if it was changed outside Bot Composer.
The ideia is to import the model into Bot Composer before it's published again, avoiding losing eventual changes in between.

## Step 1. Install pre-requisites

### NodeJS
This command line tool (CLI) is a node application so you need to install NodeJS first. You can downlod it from here: [NodeJS](https://nodejs.org/en/download/).

## Step 2. Install the application

To install the botcomposer-luis-sync app just downlod it from the GitHub [repository](https://github.com/ruifelixpereira/botcomposer-luis-sync) and run the following commands:
```
cd botcomposer-luis-sync
npm install
``` 

## Step 3. Invoke the provided botcomposer-luis-sync app

Just run:
```
node ./bin/index.js -d <bot_dir> -e <luis_endpoint> -s <luis_key> 
```

That needs 3 mandatory parameters:
- *<bot_dir>* - your Bot Composer application directory
- *<luis_endpoint>* - your LUIS authoring endpoint
- *<luis_key>* - your LUIS authoring subscritpion key

Example:

```
node ./bin/index.js -d /home/rfp/wbase/dev/bots/CoreWithLanguage_1/CoreWithLanguage_1 -e https://xxxxx.cognitiveservices.azure.com/ -s xxxxxxxx

```

