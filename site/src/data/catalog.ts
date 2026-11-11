import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import type { Catalog, Project } from "./types";

const catalogPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../seed-projects.yaml",
);

let cached: Catalog | undefined;

export function loadCatalog(): Catalog {
  if (cached) return cached;
  const raw = fs.readFileSync(catalogPath, "utf8");
  cached = yaml.load(raw) as Catalog;
  return cached;
}

export function allProjects(): Project[] {
  return loadCatalog().projects;
}

export function getProject(id: string): Project | undefined {
  return allProjects().find((p) => p.id === id);
}

export function projectsForHarness(id: string): Project[] {
  return allProjects().filter((p) => p.harnesses.includes(id));
}

export function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

export function allHarnesses(): string[] {
  return uniqueSorted(allProjects().flatMap((p) => p.harnesses));
}

export function allModels(): string[] {
  return uniqueSorted(allProjects().flatMap((p) => p.models));
}

export function allCategories(): string[] {
  return uniqueSorted(allProjects().flatMap((p) => p.categories));
}
