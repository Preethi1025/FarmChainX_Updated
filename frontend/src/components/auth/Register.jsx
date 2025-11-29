import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, Sprout, ShoppingCart, Eye, EyeOff, Leaf, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

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

const { register, loading } = useAuth();
const navigate = useNavigate();

const handleChange = (e) => {
setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
};

const handleSubmit = async (e) => {
e.preventDefault();
if (formData.password !== formData.confirmPassword) {
alert("Passwords don't match!");
return;
}
try {
await register(formData, navigate); // pass navigate for auto-login redirect
} catch (err) {
console.error('Registration failed:', err);
}
};

return ( <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full space-y-8">
{/* Header */} <div className="text-center"> <Link to="/" className="inline-flex items-center space-x-3"> <div className="bg-gradient-to-r from-primary-500 to-emerald-600 p-2 rounded-xl"> <Leaf className="h-6 w-6 text-white" /> </div> <div> <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-emerald-700 bg-clip-text text-transparent">
FarmChainX </h1> <p className="text-sm text-gray-500">Transparent Agriculture</p> </div> </Link> <h2 className="mt-6 text-3xl font-bold text-gray-900">Create your account</h2> <p className="mt-2 text-sm text-gray-600">Join the future of transparent agriculture</p> </div>

    {/* Form */}
    <motion.form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
            placeholder="Enter your full name" />
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
            placeholder="Enter your email" />
        </div>
      </div>

      {/* Role */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">I am a</label>
        <div className="grid grid-cols-2 gap-4">
          <button type="button" onClick={() => setFormData(prev => ({ ...prev, role: 'FARMER' }))}
            className={`p-4 border-2 rounded-xl text-center transition-all duration-200 ${formData.role === 'FARMER' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-300 bg-white text-gray-700 hover:border-primary-300'}`}>
            <Sprout className="h-6 w-6 mx-auto mb-2" />
            <span className="font-medium">Farmer</span>
          </button>
          <button type="button" onClick={() => setFormData(prev => ({ ...prev, role: 'BUYER' }))}
            className={`p-4 border-2 rounded-xl text-center transition-all duration-200 ${formData.role === 'BUYER' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-300 bg-white text-gray-700 hover:border-primary-300'}`}>
            <ShoppingCart className="h-6 w-6 mx-auto mb-2" />
            <span className="font-medium">Buyer</span>
          </button>
        </div>
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input id="password" name="password" type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={handleChange}
            className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
            placeholder="Create a password" />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center">{showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}</button>
        </div>
      </div>

    

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} required value={formData.confirmPassword} onChange={handleChange}
            className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
            placeholder="Confirm your password" />
          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center">{showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}</button>
        </div>
      </div>
        {/* Phone Number */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <input id="phone" name="phone" type="tel" required value={formData.phone} onChange={handleChange}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
            placeholder="Enter your phone number" />
        </div>
      </div>

      {/* Submit */}
      <div>
        <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-white bg-primary-600 hover:bg-primary-700 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : `Create ${formData.role.toLowerCase()} account`}
        </button>
      </div>

      {/* Sign in */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account? <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200">Sign in here</Link>
        </p>
      </div>
    </motion.form>
  </motion.div>
</div>

);
};

export default Register;
