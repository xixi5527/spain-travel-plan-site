#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const required = [
  "index.html",
  "styles.css",
  "app.js",
  "overview-map.js",
  "route-ui.js",
  "runtime-storage.js",
  "trip-data.json"
];
const errors = [];

for (const file of required) {
  if (!fs.existsSync(path.join(root, file))) errors.push(`缺少网页文件：${file}`);
}

let trip;
try {
  trip = JSON.parse(fs.readFileSync(path.join(root, "trip-data.json"), "utf8"));
} catch (error) {
  errors.push(`trip-data.json 无法解析：${error.message}`);
}

if (trip) {
  if (trip.metadata?.title !== "西班牙｜地中海电影之旅") errors.push("旅行标题不正确");
  if (trip.trip?.startDate !== "2026-09-30" || trip.trip?.endDate !== "2026-10-11") errors.push("旅行日期应为 2026-09-30 至 2026-10-11");
  if (trip.trip?.dayCount !== 12 || !Array.isArray(trip.days) || trip.days.length !== 12) errors.push("每日行程必须连续包含 12 天");
  for (let index = 0; index < (trip.days || []).length; index += 1) {
    const day = trip.days[index];
    if (day.day !== index + 1 || !day.date || !Array.isArray(day.schedule)) errors.push(`Day ${index + 1} 的结构不完整`);
  }
  const serializedTrip = JSON.stringify(trip);
  if (!/5位成人.+1位儿童/.test(serializedTrip)) errors.push("请确认数据仍准确表达 5 位成人与 1 位儿童");
  const mapImage = trip.map?.regions?.[0]?.baseImage || trip.map?.region?.baseImage || trip.map?.baseImage;
  if (mapImage && !fs.existsSync(path.join(root, mapImage))) errors.push(`路线图资源不存在：${mapImage}`);
}

for (const script of ["app.js", "overview-map.js", "route-ui.js", "runtime-storage.js"]) {
  if (fs.existsSync(path.join(root, script)) && fs.readFileSync(path.join(root, script), "utf8").includes("<<<<<<<")) errors.push(`${script} 包含未解决的合并冲突`);
}

if (errors.length) {
  console.error(errors.map((item) => `✗ ${item}`).join("\n"));
  process.exit(1);
}

console.log("✓ 云端发布校验通过：核心文件、日期、每日行程与路线图资源完整");
