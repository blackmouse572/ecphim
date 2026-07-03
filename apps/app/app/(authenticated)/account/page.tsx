import { currentProfile } from "@repo/auth/server";
import { redirect } from "next/navigation";
import { Header } from "../components/header";
import { AccountSettings } from "./account-settings";

const AccountPage = async () => {
  const profile = await currentProfile();

  if (!profile) {
    redirect("/sign-in?next=/account");
  }

  return (
    <>
      <Header page="Tài khoản" pages={["Cài đặt"]} />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <AccountSettings initialProfile={profile} />
      </div>
    </>
  );
};

export default AccountPage;
