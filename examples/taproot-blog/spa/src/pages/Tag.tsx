import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import PostCard from "../components/PostCard";

export default function Tag() {
  const { tag } = useParams<{ tag: string }>();
  const { data, isLoading } = useQuery({
    queryKey: ["posts", "tag", tag],
    queryFn: () => api.postsByTag(tag!),
    enabled: !!tag,
  });
  return (
    <>
      <h1>Posts tagged <em>{tag}</em></h1>
      {isLoading ? <p className="muted-block">Loading…</p> : data!.map((p) => <PostCard key={p.id} post={p} />)}
    </>
  );
}
