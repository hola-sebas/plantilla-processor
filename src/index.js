const fs = require("fs");
const path = require("path");

const cuestion = process.openStdin();

cuestion.on("data", async data => {
    data = data.toString().trim();
    if (!data.length) return write();
    if (!data.endsWith(".txt")) {
        console.log("no termina en .txt");
        write();
        return;
    }
    if (!fs.existsSync(path.join(__dirname, "plantillas", data))) {
        console.log("ese archivo no existe");
        write();
        return;
    };
    let plantilla = fs.readFileSync(path.join(__dirname, "plantillas", data)).toString();
    let regexp = /\${.+}/gmis;
    let matched = plantilla.match(regexp);
    if (!matched) {
        console.log("no se encontro ninguna coincidencia en el archivo");
        write();
        return;
    }
    matched.map(async string => {
        try {
            let evaluado = eval(string.replace(/\${|}$/g, ""));
            plantilla = plantilla.replace(string, evaluado);
        } catch (err) {
            console.log(`error en ${string}`);
            console.log(err);
            process.exit();
        }
    })
    fs.writeFileSync(path.join(__dirname, "plantillas", `${data.replace(".txt", "-replaced")}.txt`), plantilla, { encoding: "utf8" });
    console.log("procesado correctamente");
    write();
})

function write() {
    process.stdout.write("->");
}

write()