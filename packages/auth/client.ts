"use client";

import { createAuthClient } from "better-auth/react";
import { AUTH_BASE_PATH } from "./config";

// Same origin as the app, so only the base path needs to be set.
export const authClient = createAuthClient({
  basePath: AUTH_BASE_PATH,
});

export type AuthClient = typeof authClient;

export type AuthError = { code?: string; message: string };
export type AuthResult = { error: AuthError | null };

type BetterAuthError = {
  code?: string;
  message?: string;
  statusText?: string;
} | null;

// better-auth error codes -> Vietnamese copy for the auth pages.
const errorMessages: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: "Email hoặc mật khẩu không đúng.",
  INVALID_PASSWORD: "Mật khẩu hiện tại không đúng.",
  EMAIL_NOT_VERIFIED:
    "Email chưa được xác nhận. Chúng tôi vừa gửi lại liên kết xác nhận, hãy kiểm tra hộp thư.",
  USER_ALREADY_EXISTS: "Email này đã được đăng ký.",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "Email này đã được đăng ký.",
  PASSWORD_TOO_SHORT: "Mật khẩu quá ngắn.",
  PASSWORD_TOO_LONG: "Mật khẩu quá dài.",
  INVALID_TOKEN: "Liên kết không hợp lệ hoặc đã hết hạn.",
  CREDENTIAL_ACCOUNT_NOT_FOUND:
    "Tài khoản này đăng nhập bằng Google nên chưa có mật khẩu.",
};

const toResult = (error: BetterAuthError): AuthResult => {
  if (!error) {
    return { error: null };
  }

  const message =
    (error.code && errorMessages[error.code]) ||
    error.message ||
    error.statusText ||
    "Đã có lỗi xảy ra. Vui lòng thử lại.";

  return { error: { code: error.code, message } };
};

type SignInWithPasswordInput = {
  email: string;
  password: string;
};

type SignInWithGoogleInput = {
  /** Where to land after Google sign-in completes. */
  redirectTo: string;
  /** Where to land if it fails. */
  errorRedirectTo?: string;
};

type SignUpWithPasswordInput = SignInWithPasswordInput & {
  /** Where the email verification link lands after verifying. */
  emailRedirectTo?: string;
  name: string;
};

type UpdateProfileInput = {
  avatar?: string | null;
  name: string;
};

export const createClient = (): AuthClient => authClient;

export const getCurrentUser = async (client: AuthClient) => {
  const { data } = await client.getSession();

  return data?.user ?? null;
};

export const signInWithPassword = async (
  client: AuthClient,
  input: SignInWithPasswordInput,
) => toResult((await client.signIn.email(input)).error);

export const signInWithGoogle = async (
  client: AuthClient,
  { redirectTo, errorRedirectTo }: SignInWithGoogleInput,
) =>
  toResult(
    (
      await client.signIn.social({
        provider: "google",
        callbackURL: redirectTo,
        errorCallbackURL: errorRedirectTo,
      })
    ).error,
  );

export const signUpWithPassword = async (
  client: AuthClient,
  { emailRedirectTo, ...input }: SignUpWithPasswordInput,
) =>
  toResult(
    (await client.signUp.email({ ...input, callbackURL: emailRedirectTo }))
      .error,
  );

/** Emails a reset link that lands on `redirectTo?token=...`. */
export const sendPasswordResetEmail = async (
  client: AuthClient,
  email: string,
  redirectTo: string,
) => toResult((await client.requestPasswordReset({ email, redirectTo })).error);

/** Sets a new password from the token in a reset link. */
export const resetPassword = async (
  client: AuthClient,
  { token, newPassword }: { token: string; newPassword: string },
) => toResult((await client.resetPassword({ token, newPassword })).error);

/** Changes the signed-in user's password. */
export const changePassword = async (
  client: AuthClient,
  {
    currentPassword,
    newPassword,
  }: { currentPassword: string; newPassword: string },
) =>
  toResult(
    (
      await client.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      })
    ).error,
  );

export const updateProfile = async (
  client: AuthClient,
  { avatar, name }: UpdateProfileInput,
) => toResult((await client.updateUser({ name, image: avatar ?? null })).error);

export const signOut = async (client: AuthClient) =>
  toResult((await client.signOut()).error);
