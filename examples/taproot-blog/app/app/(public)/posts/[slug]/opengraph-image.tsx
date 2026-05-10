import { ImageResponse } from "next/og";
import { prisma } from "@/lib/db";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug }, select: { title: true } });
  return new ImageResponse(
    (
      <div style={{ background: "#5b21b6", color: "white", width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, fontSize: 64, fontFamily: "system-ui" }}>
        <div style={{ fontSize: 28, opacity: 0.7 }}>Taproot</div>
        <div style={{ marginTop: 20 }}>{post?.title ?? "Not found"}</div>
      </div>
    ),
    { ...size }
  );
}
