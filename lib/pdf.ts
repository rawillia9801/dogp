export function createSimplePdf({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  const wrappedLines = wrapLines(body, 92);
  const pages = chunk(wrappedLines, 44);
  const objects: string[] = [];
  const pageIds: number[] = [];

  const fontObjectId = 3;

  pages.forEach((pageLines, index) => {
    const pageObjectId = 4 + index * 2;
    const contentObjectId = pageObjectId + 1;
    pageIds.push(pageObjectId);
    objects[pageObjectId] = buildPageObject(pageObjectId, contentObjectId, fontObjectId);
    objects[contentObjectId] = buildContentObject(title, pageLines, index === 0);
  });

  objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
  objects[2] = `<< /Type /Pages /Count ${pageIds.length} /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] >>`;
  objects[3] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];

  for (let index = 1; index < objects.length; index += 1) {
    const objectBody = objects[index];

    if (!objectBody) {
      continue;
    }

    offsets[index] = pdf.length;
    pdf += `${index} 0 obj\n${objectBody}\nendobj\n`;
  }

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length}\n`;
  pdf += "0000000000 65535 f \n";

  for (let index = 1; index < objects.length; index += 1) {
    const offset = offsets[index] ?? 0;
    pdf += `${offset.toString().padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return Buffer.from(pdf, "binary");
}

function buildPageObject(pageObjectId: number, contentObjectId: number, fontObjectId: number) {
  return `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${fontObjectId} 0 R >> >> /Contents ${contentObjectId} 0 R >>`;
}

function buildContentObject(title: string, lines: string[], includeTitle: boolean) {
  const commands: string[] = [
    "BT",
    "/F1 11 Tf",
    "50 742 Td",
    "15 TL",
  ];

  if (includeTitle) {
    commands.push("/F1 16 Tf");
    commands.push(`(${escapePdfText(title)}) Tj`);
    commands.push("T*");
    commands.push("/F1 11 Tf");
    commands.push("T*");
  }

  lines.forEach((line) => {
    commands.push(`(${escapePdfText(line)}) Tj`);
    commands.push("T*");
  });

  commands.push("ET");

  const stream = commands.join("\n");
  return `<< /Length ${Buffer.byteLength(stream, "binary")} >>\nstream\n${stream}\nendstream`;
}

function wrapLines(text: string, width: number) {
  const output: string[] = [];
  const paragraphs = text.split(/\n{2,}/);

  paragraphs.forEach((paragraph) => {
    const normalized = paragraph.replace(/\s+/g, " ").trim();

    if (!normalized) {
      output.push("");
      return;
    }

    let current = "";
    normalized.split(" ").forEach((word) => {
      const next = current ? `${current} ${word}` : word;

      if (next.length > width) {
        if (current) {
          output.push(current);
        }
        current = word;
      } else {
        current = next;
      }
    });

    if (current) {
      output.push(current);
    }

    output.push("");
  });

  return output.length > 0 ? output : [text];
}

function chunk<T>(items: T[], size: number) {
  const output: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    output.push(items.slice(index, index + size));
  }

  return output.length > 0 ? output : [[]];
}

function escapePdfText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}
