
// The whole AdminAuth component previously used Supabase Auth for email/password.
// This is now obsolete given the ID-only passwordless login, so we simply make this a passthrough.
const AdminAuth = () => null;
export default AdminAuth;
