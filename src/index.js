const fs = require("fs");
const path = require("path");

const cuestion = process.openStdin();

existeDirectorio()

cuestion.on("data", async data => {
    existeDirectorio()
    data = data.toString().trim().split("=>");
    if (!data[0].length) return write();
    data[0] = data[0].trim()
    data[1] = data[1] ? data[1].trim() : null;
    if (!data[0].endsWith(".txt")) {
        data[0] = data[0].trim().concat(".txt");
    }
    if (!fs.existsSync(path.join(__dirname, "plantillas", data[0]))) {
        console.log("ese archivo no existe");
        write();
        return;
    };
    let plantilla = fs.readFileSync(path.join(__dirname, "plantillas", data[0])).toString();
    let regexp = /(\\)?\${.+}/gs;
    let matched = plantilla.match(regexp);
    if (!matched) {
        console.log("no se encontro ninguna coincidencia en el archivo");
        fs.writeFileSync(path.join(__dirname, "plantillas", `${data[0].replace(".txt", "-replaced")}${data[1] || ".txt"}`), plantilla, { encoding: "utf8" });
        write();
        return;
    }
    matched.map(async string => {
        if (string.startsWith("\\")) return;
        try {
            let evaluado = eval(string.replace(/\${|}$/g, ""));
            plantilla = plantilla.replace(string, evaluado);
        } catch (err) {
            console.log(`error en ${string}`);
            console.log(err);
            process.exit();
        }
    })
    fs.writeFileSync(path.join(__dirname, "plantillas", `${data[0].replace(".txt", "-replaced")}${data[1] || ".txt"}`), plantilla, { encoding: "utf8" });
    console.log("procesado correctamente");
    write();
})

function existeDirectorio() {
    if(!fs.existsSync(path.join(__dirname, "plantillas"))){
        console.log("creando el directorio \"plantillas\" ahi es donde se va a revisar las plantillas a procesar")
        fs.mkdirSync(path.join(__dirname, "plantillas"))
    }    
}

function write() {
    process.stdout.write("->");
}

write()