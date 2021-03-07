const express = require("express");

const app = express();

app.get('/hello', (request, response) => {
    response.send("Hello from jewelry server");
});

const PORT = 9090;

app.listen(PORT, () => {
    console.log('API listening on 9090')
})
