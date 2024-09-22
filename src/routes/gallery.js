const { Router } = require('express');
const { parse } = require('path');
const router = Router();

// Front End to Back End API
const axios = require('axios')

router.get('/', async (req, res) => {
    res.send(404);
});

router.get("/:id/:page", async (req, res) => {
    page = parseInt(req.params.page);
    if (page < 1) res.send(404);

    let response = await axios.get(`${global.url}/api/v1/images/${req.params.id}/${page}`, {
        headers: {
            'Authorization': global.config.api.key
        }
    });

    if (response.data && response.data.length == 0) res.send(404);
    images = response.data;

    res.render('gallery', { title: 'Gallery', images: images, page: page });
});


module.exports = router;