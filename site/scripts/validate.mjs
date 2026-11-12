import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const schema = JSON.parse(fs.readFileSync(path.join(root, "schema/project.schema.json"), "utf8"));
const catalog = yaml.load(fs.readFileSync(path.join(root, "seed-projects.yaml"), "utf8"));

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);
if (!validate(catalog)) {
  console.error("Catalog failed schema validation:");
  for (const err of validate.errors ?? []) {
    console.error(`- ${err.instancePath || "/"} ${err.message}`);
  }
  process.exit(1);
}

const ids = new Set();
for (const project of catalog.projects) {
  if (ids.has(project.id)) {
    console.error(`Duplicate id: ${project.id}`);
    process.exit(1);
  }
  ids.add(project.id);
}
console.log(`OK: ${catalog.projects.length} projects validated.`);
