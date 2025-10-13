import SignIn from "@/app/components/Auth/SignIn";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: { redirect_to?: string };
}) {
  const { redirect_to } = await searchParams;

  return <SignIn redirect_to={redirect_to} />;
}
