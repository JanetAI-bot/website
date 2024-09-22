const { Router } = require('express');
const router = Router();
const fs = require('fs');

router.get('/', (req, res) => {
    res.send('This is the Image Directory for JanetAI, Subfolders are hidden but are based on discord user ID\'s');
});

router.get('/favicon.ico', (req, res) => {
    res.sendFile(`${datadir}/src/static/favicon.ico`);
});

// Get image by user ID and image name
router.get('/:id/:image', (req, res) => {
    // \..\..\live_bot\data\users\395954635161993217\images\${messageid}_0.png 



    userid = req.params.id;
    image = req.params.image;

    if (!fs.existsSync(`${datadir}/users/${userid}/images`)) {
        return res.status(404).send('User not found');
    }

    if (!fs.existsSync(`${datadir}/users/${userid}/images/${image}`)) {
        return res.status(404).send('Image not found');
    }

    res.sendFile(`${datadir}/users/${userid}/images/${image}`);  
});

module.exports = router;