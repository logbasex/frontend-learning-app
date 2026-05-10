import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const posts = await prisma.post.findMany({ where: { draft: false }, select: { slug: true, updatedAt: true } });
  return [
    { url: `${siteUrl}/`, lastModified: new Date() },
    { url: `${siteUrl}/about`, lastModified: new Date() },
    ...posts.map((p) => ({ url: `${siteUrl}/posts/${p.slug}`, lastModified: p.updatedAt })),
  ];
}
