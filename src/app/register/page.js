'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  Link,
  InputAdornment,
  IconButton,
  Stack,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff, FlashOn, ArrowBack, MarkEmailRead } from '@mui/icons-material';
import useAuthStore from '@/store/authStore';

export default function RegisterPage() {
  const router = useRouter();
  const { register, verifyOtp, resendOtp } = useAuthStore();
  const [step, setStep] = useState(1); // 1 = form, 2 = OTP
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef([]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Auto-focus first OTP input when step changes to 2
  useEffect(() => {
    if (step === 2) {
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [step]);

  // Step 1: Submit registration form → sends OTP
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      setStep(2);
      setResendCooldown(60);
      setSuccess('');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP → creates account & logs in
  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await verifyOtp({ email: form.email, otp: code });
      router.push('/feed');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError('');
    try {
      await resendOtp(form.email);
      setSuccess('New verification code sent!');
      setResendCooldown(60);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend code.');
    }
  };

  // OTP input handling
  const handleOtpChange = (index, value) => {
    // Allow only digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits entered
    if (value && index === 5 && newOtp.every((d) => d !== '')) {
      setTimeout(() => handleVerifyFromOtp(newOtp), 150);
    }
  };

  const handleVerifyFromOtp = async (otpArray) => {
    const code = otpArray.join('');
    if (code.length !== 6) return;
    setError('');
    setLoading(true);
    try {
      await verifyOtp({ email: form.email, otp: code });
      router.push('/feed');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter') {
      handleVerify();
    }
  };

  // Handle paste of full OTP
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const newOtp = pasted.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
      setTimeout(() => handleVerifyFromOtp(newOtp), 150);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background:
          'radial-gradient(ellipse at 70% 50%, rgba(255,109,0,0.1) 0%, transparent 50%), #0A0A0A',
      }}
    >
      <Container maxWidth="sm" sx={{ px: { xs: 2, sm: 3 } }}>
        <Card sx={{ p: { xs: 1, sm: 2 } }}>
          <CardContent sx={{ px: { xs: 1.5, sm: 3 } }}>

            {/* ── Step 1: Registration Form ── */}
            {step === 1 && (
              <>
                <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 4 } }}>
                  <FlashOn sx={{ color: 'secondary.main', fontSize: { xs: 40, md: 48 }, mb: 1 }} />
                  <Typography variant="h5" fontWeight={700}>
                    Join Spark FitLife
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create your free account and start your journey
                  </Typography>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleRegister}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    sx={{ mb: 2.5 }}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    sx={{ mb: 2.5 }}
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    sx={{ mb: 2.5 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    required
                    sx={{ mb: 3 }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    fullWidth
                    size="large"
                    disabled={loading}
                    sx={{ mb: 2, minHeight: 48 }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Continue'}
                  </Button>
                </Box>

                <Typography variant="body2" textAlign="center" color="text.secondary">
                  Already have an account?{' '}
                  <Link href="/login" sx={{ color: 'primary.main', fontWeight: 600, cursor: 'pointer' }}>
                    Sign In
                  </Link>
                </Typography>
              </>
            )}

            {/* ── Step 2: OTP Verification ── */}
            {step === 2 && (
              <>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <MarkEmailRead sx={{ color: 'primary.main', fontSize: 48, mb: 1 }} />
                  <Typography variant="h5" fontWeight={700}>
                    Verify Your Email
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    We sent a 6-digit code to
                  </Typography>
                  <Typography variant="body2" fontWeight={600} color="secondary.main">
                    {form.email}
                  </Typography>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                {/* 6-digit OTP inputs */}
                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent="center"
                  sx={{ mb: 3 }}
                  onPaste={handleOtpPaste}
                >
                  {otp.map((digit, i) => (
                    <TextField
                      key={i}
                      inputRef={(el) => (inputRefs.current[i] = el)}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value.slice(-1))}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      inputProps={{
                        maxLength: 1,
                        style: {
                          textAlign: 'center',
                          fontSize: '1.5rem',
                          fontWeight: 700,
                          padding: '12px 0',
                        },
                        inputMode: 'numeric',
                      }}
                      sx={{
                        width: 48,
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': { borderColor: 'secondary.main' },
                        },
                      }}
                    />
                  ))}
                </Stack>

                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  size="large"
                  onClick={handleVerify}
                  disabled={loading || otp.join('').length !== 6}
                  sx={{ mb: 2, minHeight: 48 }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify & Create Account'}
                </Button>

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Button
                    size="small"
                    startIcon={<ArrowBack />}
                    onClick={() => { setStep(1); setError(''); setOtp(['', '', '', '', '', '']); }}
                    sx={{ color: 'text.secondary' }}
                  >
                    Back
                  </Button>
                  <Button
                    size="small"
                    onClick={handleResend}
                    disabled={resendCooldown > 0}
                    sx={{ color: resendCooldown > 0 ? 'text.disabled' : 'primary.main' }}
                  >
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                  </Button>
                </Stack>
              </>
            )}

          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
