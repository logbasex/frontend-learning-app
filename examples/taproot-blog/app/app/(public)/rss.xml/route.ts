import { prisma } from "@/lib/db";

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const posts = await prisma.post.findMany({
    where: { draft: false },
    include: { author: true },
    orderBy: { publishedAt: "desc" },
    take: 50,
  });

  const items = posts.map((p) => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${siteUrl}/posts/${p.slug}</link>
      <guid>${siteUrl}/posts/${p.slug}</guid>
      <pubDate>${p.publishedAt?.toUTCString()}</pubDate>
      <description><![CDATA[${p.excerpt}]]></description>
    </item>`).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>Taproot</title>
<link>${siteUrl}</link>
<description>A small blog about the web.</description>
${items}
</channel></rss>`;

  return new Response(xml, { headers: { "content-type": "application/xml" } });
}
