export default async function RacePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div>
      <h1>Race: {slug}</h1>
    </div>
  );
}
