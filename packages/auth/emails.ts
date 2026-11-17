import "server-only";

import { resend } from "@repo/email";
import { keys as emailKeys } from "@repo/email/keys";

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const layout = (heading: string, body: string, url: string, cta: string) => `
<div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#111">
  <h1 style="font-size:20px;margin:0 0 16px">${escapeHtml(heading)}</h1>
  <p style="font-size:14px;line-height:1.6;margin:0 0 24px">${escapeHtml(body)}</p>
  <a href="${escapeHtml(url)}" style="display:inline-block;background:#7c3aed;color:#fff;padding:10px 18px;border-radius:10px;text-decoration:none;font-size:14px">${escapeHtml(cta)}</a>
  <p style="font-size:12px;color:#666;margin:24px 0 0">Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
</div>`;

const send = async (to: string, subject: string, html: string) => {
  const { error } = await resend.emails.send({
    from: emailKeys().RESEND_FROM,
    to,
    subject,
    html,
  });

  if (error) {
    throw new Error(`Failed to send "${subject}" email: ${error.message}`);
  }
};

export const sendVerificationEmail = (to: string, url: string) =>
  send(
    to,
    "Xác nhận email EcPhim",
    layout(
      "Xác nhận email của bạn",
      "Nhấn nút bên dưới để xác nhận email và hoàn tất đăng ký tài khoản EcPhim. Liên kết có hiệu lực trong 1 giờ.",
      url,
      "Xác nhận email",
    ),
  );

export const sendResetPasswordEmail = (to: string, url: string) =>
  send(
    to,
    "Đặt lại mật khẩu EcPhim",
    layout(
      "Đặt lại mật khẩu",
      "Nhấn nút bên dưới để chọn mật khẩu mới cho tài khoản EcPhim. Liên kết có hiệu lực trong 1 giờ.",
      url,
      "Đặt lại mật khẩu",
    ),
  );
