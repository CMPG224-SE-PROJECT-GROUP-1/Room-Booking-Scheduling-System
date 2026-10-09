### Test User 1:
Name: Thabo Tester
University Num: S123456
Password: #Test01email

### Test User 2:
Name: Naledi Radebe
University Num: S0000002
Password: #Test02email

### Test User 3:
Name: Terrific Tester
University Num: S0000003
Password: #Test03email

### Test Admin 1:
Name: Admin Tester
University Num: S000001
Password: #Test01admin


### Supabase Custom SMTP

Sender email: onboarding@resend.dev
Sender name: Supabse Auth
Host: smtp.resend.com
Port number: 587
Minimum interval between emails: 60
SMTP Username: resend
SMTP Password: Resend API Key (re_...)

### Reset Password Template
<h2>Reset your password</h2>

<p>We received a request to reset your password. Use below OTP to reset.</p>
<p>{{ .Token }}</p>

<p>If you didn't request this, you can safely ignore this email.</p>


### OTP Template
<h2>Confirm your email address</h2>

<p>Use OTP below to confirm this email address and finish signing up.</p>
<p>{{ .Token }}</p>