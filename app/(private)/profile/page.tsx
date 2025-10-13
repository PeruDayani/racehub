import { getProfileAction } from "@/app/actions/profileActions";
import DisplayError from "@/app/components/DisplayError/DisplayError";
import ProfileEditor from "@/app/components/ProfileEditor/ProfileEditor";

// Tell Next.js that this page depends on cookies
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const profileResponse = await getProfileAction();

  if (!profileResponse.success || !profileResponse.data) {
    return (
      <DisplayError
        errorMessage={profileResponse.message}
        retryUrl="/profile"
      />
    );
  }

  return <ProfileEditor profile={profileResponse.data} />;
}
