const { readFileSync } = require("fs");

const path = require("path");
const BASE_TITLE = "Emergency Frida";

const layoutHtml = readFileSync("./views/layout.html", "utf-8");
const fridaHtml = readFileSync("./views/frida.html", "utf-8");
const fourohfourHtml = readFileSync("./views/404.html", "utf-8");

function frida(file) {
  return layoutHtml
    .replace("{{title}}", BASE_TITLE)
    .replace("{{body}}", fridaHtml)
    .replace("{{src}}", path.join("/images", file))
    .replace("{{permalink}}", permalink(file));
}

function fourohfour() {
  return layoutHtml
    .replace("{{title}}", `${BASE_TITLE} - 404`)
    .replace("{{body}}", fourohfourHtml);
}

function permalink(file) {
  return path.join("/-/", path.parse(file).name);
}

module.exports = {
  frida,
  fourohfour,
};
