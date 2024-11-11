import {app} from './src/app';

const port = process.env.PORT || 3000;

console.log()

app.listen(port, () => {
    console.log("Application running on port ", port);
})