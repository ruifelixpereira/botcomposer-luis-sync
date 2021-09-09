
const path = require('path');
const fs = require('fs-extra');

const BError = require("./berror").BError;

const isDirectory = (path) => {
    try {
        const stats = fs.statSync(path);
        return stats.isDirectory();
    }
    catch (_a) {
        return false;
    }
};

function validatePath(outputPath, defaultFileName, forceWrite = false) {
    let completePath = path.resolve(outputPath);
    const containingDir = path.dirname(completePath);
    // If the cointaining folder doesnt exist
    if (!fs.existsSync(containingDir))
        throw new BError(`Containing directory path doesn't exist: ${containingDir}`);
    const baseElement = path.basename(completePath);
    const pathAlreadyExist = fs.existsSync(completePath);
    // If the last element in the path is a file
    if (baseElement.includes('.')) {
        return pathAlreadyExist && !forceWrite ? enumerateFileName(completePath) : completePath;
    }
    // If the last element in the path is a folder
    if (!pathAlreadyExist)
        throw new BError(`Target directory path doesn't exist: ${completePath}`);
    completePath = path.join(completePath, defaultFileName);
    return fs.existsSync(completePath) && !forceWrite ? enumerateFileName(completePath) : completePath;
}

function enumerateFileName(filePath) {
    const fileName = path.basename(filePath);
    const containingDir = path.dirname(filePath);
    if (!fs.existsSync(containingDir))
        throw new BError(`Containing directory path doesn't exist: ${containingDir}`);
    const extension = path.extname(fileName);
    const baseName = path.basename(fileName, extension);
    let nextNumber = 0;
    let newPath = '';
    do {
        newPath = path.join(containingDir, baseName + `(${++nextNumber})` + extension);
    } while (fs.existsSync(newPath));
    return newPath;
}

const writeToConsole = (outputContents) => {
    const output = JSON.stringify(outputContents, null, 2);
    process.stdout.write(output);
};

const writeToFile = async (outputLocation, content, force, text = false) => {
    const isDir = isDirectory(outputLocation);
    let writeFile = isDir ? path.join(outputLocation, 'export.json') : outputLocation;
    const validatedPath = validatePath(writeFile, '', force);
    try {
        await fs.ensureFile(writeFile);
        if (text) {
            await fs.writeFile(validatedPath, content);
        }
        else {
            await fs.writeJson(validatedPath, content, { spaces: 2 });
        }
    }
    catch (error) {
        throw new BError(error);
    }
    return validatedPath;
};


module.exports.writeToConsole = writeToConsole;
module.exports.writeToFile = writeToFile;
module.exports.validatePath = validatePath;
