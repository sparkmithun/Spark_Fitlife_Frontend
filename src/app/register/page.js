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
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff, FlashOn, ArrowBack } from '@mui/icons-material';
import useAuthStore from '@/store/authStore';

export default function RegisterPage() {
  const router = useRouter();
  const { register, verifyOTP, resendOTP, pendingEmail } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP state
  const [step, setStep] = useState('register'); // 'register' | 'otp'
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Auto-focus first OTP input when entering OTP step
  useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [step]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      setStep('otp');
      setResendTimer(60);
      setSuccess('Verification code sent to your email!');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // only digits
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the full 6-digit code');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const email = pendingEmail || form.email;
      await verifyOTP({ email, otp: otpString });
      router.push('/feed');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setSuccess('');
    try {
      const email = pendingEmail || form.email;
      await resendOTP(email);
      setResendTimer(60);
      setSuccess('A new code has been sent to your email!');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend code.');
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
            <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 4 } }}>
              <FlashOn sx={{ color: 'secondary.main', fontSize: { xs: 40, md: 48 }, mb: 1 }} />
              <Typography variant="h5" fontWeight={700}>
                {step === 'register' ? 'Join Spark FitLife' : 'Verify Your Email'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {step === 'register'
                  ? 'Create your free account and start your journey'
                  : `Enter the 6-digit code sent to ${pendingEmail || form.email}`}
              </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            {step === 'register' ? (
              <>
                <Box component="form" onSubmit={handleSubmit}>
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
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
                  </Button>
                </Box>

                <Typography variant="body2" textAlign="center" color="text.secondary">
                  Already have an account?{' '}
                  <Link href="/login" sx={{ color: 'primary.main', fontWeight: 600, cursor: 'pointer' }}>
                    Sign In
                  </Link>
                </Typography>
              </>
            ) : (
              <>
                {/* OTP Input */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: { xs: 1, sm: 1.5 },
                    mb: 3,
                  }}
                  onPaste={handleOtpPaste}
                >
                  {otp.map((digit, i) => (
                    <TextField
                      key={i}
                      inputRef={(el) => (inputRefs.current[i] = el)}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
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
                      sx={{ width: { xs: 44, sm: 52 } }}
                    />
                  ))}
                </Box>

                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  size="large"
                  disabled={loading || otp.join('').length !== 6}
                  onClick={handleVerifyOTP}
                  sx={{ mb: 2, minHeight: 48 }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify & Continue'}
                </Button>

                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" component="span">
                    {"Didn't receive the code? "}
                  </Typography>
                  {resendTimer > 0 ? (
                    <Typography variant="body2" color="text.secondary" component="span">
                      Resend in {resendTimer}s
                    </Typography>
                  ) : (
                    <Link
                      component="button"
                      variant="body2"
                      onClick={handleResendOTP}
                      sx={{ color: 'primary.main', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Resend Code
                    </Link>
                  )}
                </Box>

                <Button
                  startIcon={<ArrowBack />}
                  onClick={() => {
                    setStep('register');
                    setOtp(['', '', '', '', '', '']);
                    setError('');
                    setSuccess('');
                  }}
                  sx={{ color: 'text.secondary' }}
                >
                  Back to Registration
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}