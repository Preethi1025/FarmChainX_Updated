import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  User, Mail, Lock, Sprout, ShoppingCart,
  Eye, EyeOff, Leaf, Phone, Truck
} from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'FARMER'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [checkingEmail, setCheckingEmail] = useState(false);

  const emailCheckTimeout = useRef(null);

  const { register, loading } = useAuth();
  const navigate = useNavigate();

  // ---------------- VALIDATION ----------------
  const validateField = (fieldName, value) => {
    let message = '';

    if (fieldName === 'name') {
      if (!value || value.trim().length < 3) {
        message = 'Name must be at least 3 characters.';
      }
    }

    if (fieldName === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        message = 'Enter a valid email address.';
      } else if (!value.toLowerCase().endsWith('@gmail.com')) {
        message = 'Use a Gmail address (example@gmail.com).';
      }
    }

    if (fieldName === 'password') {
      if (value.length < 8) message = 'Password must be at least 8 characters.';
      else if (!/[A-Z]/.test(value)) message = 'Must include an uppercase letter.';
      else if (!/[a-z]/.test(value)) message = 'Must include a lowercase letter.';
      else if (!/[0-9]/.test(value)) message = 'Must include a number.';
      else if (!/[!@#$%^&*(),.?:{}|<>]/.test(value))
        message = 'Must include a special character.';
    }

    if (fieldName === 'confirmPassword') {
      if (value !== formData.password) {
        message = 'Passwords do not match.';
      }
    }

    if (fieldName === 'phone') {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(value)) {
        message = 'Enter a valid 10-digit mobile number.';
      }
    }

    setErrors(prev => ({ ...prev, [fieldName]: message }));
    return message === '';
  };

  // ---------------- LIVE EMAIL CHECK ----------------
  const checkEmailExists = async (email) => {
    if (!email || errors.email) return;

    try {
      setCheckingEmail(true);
      const res = await axios.get(
        `http://localhost:8080/api/auth/check-email`,
        { params: { email } }
      );

      if (res.data.exists) {
        setErrors(prev => ({
          ...prev,
          email: 'An account with this email already exists.'
        }));
      }
    } catch (err) {
      console.error('Email check failed');
    } finally {
      setCheckingEmail(false);
    }
  };

  // ---------------- CHANGE HANDLER ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);

    if (name === 'email') {
      if (emailCheckTimeout.current) {
        clearTimeout(emailCheckTimeout.current);
      }
      emailCheckTimeout.current = setTimeout(() => {
        checkEmailExists(value);
      }, 600);
    }
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fields = ['name', 'email', 'password', 'confirmPassword', 'phone'];
    let valid = true;

    fields.forEach(f => {
      if (!validateField(f, formData[f])) valid = false;
    });

    if (!valid || errors.email) return;

    try {
      await register(formData, navigate);
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        'Registration failed';

      if (msg.toLowerCase().includes('email')) {
        setErrors(prev => ({
          ...prev,
          email: 'An account with this email already exists.'
        }));
      } else {
        alert(msg);
      }
    }
  };

  const isFormValid = () =>
    Object.values(formData).every(v => String(v).trim() !== '') &&
    Object.values(errors).every(e => !e);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full">

        {/* HEADER */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="bg-primary-600 p-2 rounded-xl">
              <Leaf className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-primary-700">FarmChainX</h1>
          </Link>
          <h2 className="mt-4 text-3xl font-bold">Create Account</h2>
          <p className="text-gray-500">Join transparent agriculture</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl space-y-5">

          <Input label="Full Name" icon={<User />} name="name" value={formData.name} onChange={handleChange} error={errors.name} />

          <Input
            label="Email"
            icon={<Mail />}
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            hint={checkingEmail ? 'Checking email...' : ''}
          />

          {/* ROLE */}
          <div>
            <label className="text-sm font-medium">I am a</label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              <RoleBtn label="Farmer" icon={<Sprout />} active={formData.role === 'FARMER'} onClick={() => setFormData(p => ({ ...p, role: 'FARMER' }))} />
              <RoleBtn label="Buyer" icon={<ShoppingCart />} active={formData.role === 'BUYER'} onClick={() => setFormData(p => ({ ...p, role: 'BUYER' }))} />
              <RoleBtn label="Distributor" icon={<Truck />} active={formData.role === 'DISTRIBUTOR'} onClick={() => setFormData(p => ({ ...p, role: 'DISTRIBUTOR' }))} />
            </div>
          </div>

          <PasswordInput label="Password" name="password" value={formData.password} onChange={handleChange} show={showPassword} setShow={setShowPassword} error={errors.password} />
          <PasswordInput label="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} show={showConfirmPassword} setShow={setShowConfirmPassword} error={errors.confirmPassword} />

          <Input label="Phone Number" icon={<Phone />} name="phone" value={formData.phone} onChange={handleChange} error={errors.phone} />

          <button
            type="submit"
            disabled={!isFormValid() || loading}
            className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold disabled:opacity-50"
          >
            {loading ? 'Creating...' : `Create ${formData.role.toLowerCase()} account`}
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account? <Link to="/login" className="text-primary-600 font-medium">Login</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;

/* ---------- REUSABLE COMPONENTS ---------- */

const Input = ({ label, icon, error, hint, ...props }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <div className="relative">
      <span className="absolute left-3 top-3 text-gray-400">{icon}</span>
      <input {...props} className="w-full pl-10 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500" />
    </div>
    {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const PasswordInput = ({ label, show, setShow, error, ...props }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <div className="relative">
      <Lock className="absolute left-3 top-3 text-gray-400" />
      <input {...props} type={show ? 'text' : 'password'} className="w-full pl-10 pr-10 py-3 border rounded-xl" />
      <span onClick={() => setShow(!show)} className="absolute right-3 top-3 cursor-pointer">
        {show ? <EyeOff /> : <Eye />}
      </span>
    </div>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const RoleBtn = ({ label, icon, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-4 rounded-xl border-2 flex flex-col items-center ${
      active ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
    }`}
  >
    {icon}
    <span className="text-sm mt-1">{label}</span>
  </button>
);
