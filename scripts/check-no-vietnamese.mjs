import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

// Vietnamese-specific characters. Three groups:
//   1. The U+1E00–U+1EFF Latin Extended Additional block characters that Vietnamese uses
//      (precomposed letter + tone-mark combinations: ạ ả ấ ầ ẩ ẫ ậ ắ ằ ẳ ẵ ặ etc.).
//      Other orthographies use parts of this block too, but the Vietnamese subset here
//      doesn't appear in English content.
//   2. Vietnamese letters outside that block: ă/Ă, ĩ/Ĩ, ũ/Ũ, õ/Õ, ơ/Ơ, ư/Ư, đ/Đ.
//      õ/Õ stays in despite being Latin-1 Supplement because `võ` (martial arts) is
//      a real Vietnamese word; the Portuguese false-positive risk is from ã, not õ.
//   3. Excluded: basic-Latin diacritics é à â ã è ê ì í ò ó ô ù ú ý (and uppercase),
//      because they show up in legitimate English-adjacent words like Pokémon, café,
//      résumé, façade, naïve.
//
// Limitation: matches NFC-normalized text only. NFD-saved files (combining marks
// applied to base letters) would slip through. NFD-saved .tsx is rare in practice.
const VN_RE = /[ảạăắằẳẵặấầẩẫậẻẽẹếềểễệỉĩịỏõọốồổỗộơớờởỡợủũụưứừửữựỳỷỹỵđẢẠĂẮẰẲẴẶẤẦẨẪẬẺẼẸẾỀỂỄỆỈĨỊỎÕỌỐỒỔỖỘƠỚỜỞỠỢỦŨỤƯỨỪỬỮỰỲỶỸỴĐ]/;
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
