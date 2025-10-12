import { login, signup } from "../actions";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirect_to?: string };
}) {
  const redirectTo = searchParams.redirect_to;

  async function handleLogin(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    await login(email, password, redirectTo);
  }

  async function handleSignup(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    await signup(email, password, redirectTo);
  }

  return (
    <div>
      <h1>Login</h1>
      <form>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required />
        </div>
        <div>
          <button formAction={handleLogin}>Sign In</button>
        </div>
        <div>
          <button formAction={handleSignup}>Sign Up</button>
        </div>
      </form>
    </div>
  );
}
