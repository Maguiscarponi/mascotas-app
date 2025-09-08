// cambiarIP.js
const fs = require("fs");
const path = require("path");

const carpeta = "./"; 
const ipVieja = "172.20.10.2";
const ipNueva = "172.20.10.2";

function reemplazarEnArchivo(filePath) {
  const contenido = fs.readFileSync(filePath, "utf8");
  if (contenido.includes(ipVieja)) {
    const nuevoContenido = contenido.replaceAll(ipVieja, ipNueva);
    fs.writeFileSync(filePath, nuevoContenido, "utf8");
    console.log("✅ Cambiada IP en:", filePath);
  }
}

function recorrerArchivos(carpetaActual) {
  fs.readdirSync(carpetaActual).forEach((archivo) => {
    const fullPath = path.join(carpetaActual, archivo);
    if (fs.lstatSync(fullPath).isDirectory() && !["node_modules", ".git"].includes(archivo)) {
      recorrerArchivos(fullPath);
    } else if (archivo.endsWith(".js")) {
      reemplazarEnArchivo(fullPath);
    }
  });
}

recorrerArchivos(carpeta);
console.log("\n iP actualizada en todos los archivos");
