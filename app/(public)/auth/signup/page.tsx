import SignUp from "@/app/components/Auth/SignUp";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: { redirect_to?: string };
}) {
  const { redirect_to } = await searchParams;

  return <SignUp redirect_to={redirect_to} />;
}
