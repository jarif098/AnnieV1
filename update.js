const axios = require("axios");
const {  createWriteStream, mkdirSync, existsSync } = require("fs");
const { resolve, dirname } = require("path");

const repoOwner = "jarif098";
const repoName = "AnnieV1";
const branch = "main";

const getLatestCommitSHA = async () => {
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/commits/${branch}`;
    const response = await axios.get(url);
    return response.data.sha;
};

const getFileTree = async (commitSHA) => {
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/git/trees/${commitSHA}?recursive=1`;
    const response = await axios.get(url);
    return response.data.tree.filter(item => item.type === "blob").map(item => item.path);
};

const downloadFile = async (filePath, commitSHA) => {
    const url = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/${commitSHA}/${filePath}`;
    const fileDir = dirname(resolve(filePath));

    if (!existsSync(fileDir)) {
        mkdirSync(fileDir, { recursive: true });
    }

    const response = await axios.get(url, { responseType: "stream" });
    const writer = createWriteStream(resolve(filePath));
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
    });
};

const updateFiles = async () => {
    try {
        const latestCommitSHA = await getLatestCommitSHA();

        const filePaths = await getFileTree(latestCommitSHA);
        console.log(`Files to be updated: ${filePaths.join(", ")}`);

        for (const filePath of filePaths) {
            await downloadFile(filePath, latestCommitSHA);
            console.log(`Updated ${filePath}`);
        }

        console.log("Update completed successfully.");
    } catch (error) {
        console.error("An error occurred during the update process:", error);
    }
};

updateFiles();
