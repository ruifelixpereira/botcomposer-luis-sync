const fs = require('fs-extra');
const Luis = require('@microsoft/bf-lu').V2.Luis;
//const LuisBuilder = require('@microsoft/bf-lu/lib/parser/luis/luisCollate');
const exception = require('@microsoft/bf-lu').V2.Exception;
const file = require('@microsoft/bf-lu/lib/utils/filehelper');
//const fileExtEnum = require('@microsoft/bf-lu/lib/parser/utils/helpers').FileExtTypeEnum;
const BError = require("./berror").BError;
const utils = require('./utils')

const convertJsonToLu = async (inJsonFile, outLuFile) => {

    try {
        const luisContent = await file.getContentFromFile(inJsonFile);
        const luisObject = new Luis(file.parseJSON(luisContent, 'Luis'));
        //if (flags.sort) {
        //    luisinstanceutils_1.sort(luisObject);
        //}

        result = luisObject.parseToLuContent();

        if (!result) {
            throw new BError('No LU or Luis content parsed!');
        }

        await writeOutput(result, inJsonFile, outLuFile, false);
    }
    catch (error) {
        if (error instanceof exception) {
            throw new BError(error.text);
        }
        throw error;
    }
}

const writeOutput = async (convertedObject, inFile, outFile, isLu) => {

    const filePath = await file.generateNewFilePath(outFile, inFile, isLu);
    const validatedPath = utils.validatePath(filePath, '', true);

    // write out the final file
    try {
        await fs.writeFile(validatedPath, convertedObject, 'utf-8');
    }
    catch (error) {
        throw new BError('Unable to write LU file - ' + validatedPath + ' Error: ' + error.message);
    }
    //console.log('Successfully wrote LUIS model to ' + validatedPath);
}

module.exports.convertJsonToLu = convertJsonToLu;
