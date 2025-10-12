import { createClient } from "../lib/supabase/server";

export default async function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  console.log("Private Layout", data, error);

  return (
    <div>
      <h1>Private Layout</h1>
      {children}
    </div>
  );
}
