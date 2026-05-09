import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const VN_RE = /[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÈÉẺẼẸÊẾỀỂỄỆÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴĐ]/;
const ROOTS = ["components", "lib", "app"];
const EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".md"]);

let bad = 0;

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const st = statSync(path);
    if (st.isDirectory()) {
      if (name === "node_modules" || name.startsWith(".")) continue;
      walk(path);
      continue;
    }
    if (!EXTS.has(extname(name))) continue;
    const text = readFileSync(path, "utf8");
    const lines = text.split("\n");
    lines.forEach((line, i) => {
      if (VN_RE.test(line)) {
        console.error(`${path}:${i + 1}: ${line.trim()}`);
        bad++;
      }
    });
  }
}

for (const root of ROOTS) {
  try {
    walk(root);
  } catch {
    // root missing is fine
  }
}

if (bad > 0) {
  console.error(`\nFound ${bad} line(s) containing Vietnamese characters. All copy must be in English.`);
  process.exit(1);
}
console.log("Language guard: clean.");
