import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import PostCard from "../components/PostCard";

export default function Home() {
  const { data, isLoading, error } = useQuery({ queryKey: ["posts"], queryFn: api.listPosts });
  if (isLoading) return <p className="muted-block">Loading…</p>;
  if (error) return <p className="muted-block">Could not load posts.</p>;
  return <>{data!.map((p) => <PostCard key={p.id} post={p} />)}</>;
}
