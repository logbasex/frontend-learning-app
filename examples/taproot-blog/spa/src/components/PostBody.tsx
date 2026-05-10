export default function PostBody({ body }: { body: string }) {
  return (
    <div>
      {body.split("\n\n").map((para, i) => <p key={i}>{para}</p>)}
    </div>
  );
}
