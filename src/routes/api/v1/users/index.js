const { Router } = require("express");
const router = Router();
const fs = require('fs');
const path = require('path');
const IMAGES_PER_PAGE = 5;


// Image Processing
const { ExifTool } = require("exiftool-vendored");
const { read } = require("fs");
const exiftool = new ExifTool();

async function readMetaData(imagePath) {
    try {
      const metadata = await exiftool.read(imagePath); // Await metadata extraction
      return metadata;
    } catch (error) {
        console.error(`Error reading metadata for file: ${imagePath}`, error);
        return null;  // Return null if there is an error
    }
}

router.get("/", (req, res) => {
  res.send("This is the User API for JanetAI");
});

router.get("/:id", (req, res) => {
  res.send(`User ID: ${req.params.id}`);
});

router.get("/:id/generations/:page?", async (req, res) => {
    const userdir = `${datadir}/users/${req.params.id}/images`;
    const page = parseInt(req.params.page) || 1;

    if (!fs.existsSync(userdir)) return res.status(404).send("User not found");

    let files = fs.readdirSync(userdir).filter(file => file.endsWith(".png") || file.endsWith(".jpg") || file.endsWith(".jpeg"));

    files.sort((a, b) => {
        const fileAPath = path.join(userdir, a);
        const fileBPath = path.join(userdir, b);

        const fileAStats = fs.statSync(fileAPath);
        const fileBStats = fs.statSync(fileBPath);

        return fileBStats.mtime - fileAStats.mtime;
    });

    const totalFiles = files.length;
    const totalPages = Math.ceil(totalFiles / IMAGES_PER_PAGE); // Calculate total pages
    if (page < 1 || page > totalPages) return res.status(404).send("Invalid page number");

    const start = (page - 1) * IMAGES_PER_PAGE;
    const end = start + IMAGES_PER_PAGE;
    const paginatedFiles = files.slice(start, end);

    const images = [];

    for (const file of paginatedFiles) {
        if (!file.endsWith(".png") && !file.endsWith(".jpg") && !file.endsWith(".jpeg")) continue;
  
        const metadata = await readMetaData(`${userdir}/${file}`); 

        const settings = {};
        for (const setting of metadata.Parameters.split("\n")[2].split(",")) {
            const [key, value] = setting.split(":");
            key.replace(" ", "_");
            settings[key.trim()] = value.trim();
        }

        let data = {
            filename: file,
            user: req.params.id,
            messageid: file.split("_")[0],
            size: metadata.FileSize,
            width: metadata.ImageWidth,
            height: metadata.ImageHeight,
            date: metadata.CreateDate,
            positive: metadata.Parameters.split("\n")[0],
            negitive: metadata.Parameters.split("\n")[1],
            settings: settings
        };

        images.push(data);
    }

    res.send(JSON.stringify(images));
});

module.exports = router;
