'use client';

import React, { useState } from 'react';
import { contactService } from '@/services/contactService';

// Validation regex patterns
// Letters, numbers, and whitespace (Unicode supported for international/Devanagari characters)
const NAME_REGEX = /^[\p{L}\p{N}\s]+$/u;
// Digits only with optional leading + and spaces/dashes
const PHONE_REGEX = /^\+?[0-9\s\-]+$/;
// Location: letters, numbers, spaces, and address punctuation (, . -)
const LOCATION_REGEX = /^[\p{L}\p{N}\s,.\-]+$/u;
// Message: letters, numbers, spaces, and basic punctuation
const MESSAGE_REGEX = /^[\p{L}\p{N}\s,.\-!?()'"\r\n]+$/u;

interface FieldErrors {
  name?: string;
  phone?: string;
  location?: string;
  message?: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    service_needed: '',
    message: '',
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validateField = (fieldName: string, value: string): string | undefined => {
    switch (fieldName) {
      case 'name': {
        const trimmed = value.trim();
        if (!trimmed) {
          return 'Name is required.';
        }
        if (!NAME_REGEX.test(value)) {
          return 'Only letters, numbers, and spaces are allowed.';
        }
        if (trimmed.length < 2) {
          return 'Name must be at least 2 characters long.';
        }
        return undefined;
      }
      case 'phone': {
        const trimmed = value.trim();
        if (!trimmed) {
          return 'Phone number is required.';
        }
        if (!PHONE_REGEX.test(value)) {
          return 'Only numbers are allowed.';
        }
        const digitCount = value.replace(/\D/g, '').length;
        if (digitCount < 7 || digitCount > 15) {
          return 'Phone number must be between 7 and 15 digits.';
        }
        return undefined;
      }
      case 'location': {
        if (!value.trim()) return undefined;
        if (!LOCATION_REGEX.test(value)) {
          return 'Only letters, numbers, and spaces are allowed.';
        }
        return undefined;
      }
      case 'message': {
        if (!value.trim()) return undefined;
        if (!MESSAGE_REGEX.test(value)) {
          return 'Only letters, numbers, spaces, and basic punctuation are allowed.';
        }
        return undefined;
      }
      default:
        return undefined;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Perform live validation on change
    const error = validateField(name, value);
    setFieldErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setFieldErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const validateAll = (): boolean => {
    const errors: FieldErrors = {};

    const nameError = validateField('name', formData.name);
    if (nameError) errors.name = nameError;

    const phoneError = validateField('phone', formData.phone);
    if (phoneError) errors.phone = phoneError;

    const locationError = validateField('location', formData.location);
    if (locationError) errors.location = locationError;

    const messageError = validateField('message', formData.message);
    if (messageError) errors.message = messageError;

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    // Validate all inputs before submitting
    const isValid = validateAll();
    if (!isValid) {
      setErrorMessage('Please fix the errors in the form before submitting.');
      return;
    }

    setLoading(true);

    try {
      const res = await contactService.submit(formData);
      setSuccessMessage(res.message || 'Request submitted successfully!');
      setFormData({
        name: '',
        phone: '',
        location: '',
        service_needed: '',
        message: '',
      });
      setFieldErrors({});
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'An error occurred while submitting your request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-[#cbd5e1] rounded-2xl p-6 md:p-8 shadow-sm">
      <h2 className="text-[24px] font-bold text-[#0f172a] mb-6">
        Send a Message
      </h2>

      {successMessage && (
        <div className="mb-6 p-4 bg-[#e6f4ea] border border-[#25D366] text-[#005322] rounded-xl flex items-center gap-3">
          <span className="material-symbols-outlined text-[#25D366]">check_circle</span>
          <p className="text-[14px] font-medium">{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 bg-[#ffdad6] border border-[#ba1a1a] text-[#93000a] rounded-xl flex items-center gap-3">
          <span className="material-symbols-outlined text-[#ba1a1a]">error</span>
          <p className="text-[14px] font-medium">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[14px] font-bold text-[#0f172a] mb-1.5" htmlFor="name">
              Name <span className="text-[#ba1a1a]">*</span>
            </label>
            <input
              className={`w-full bg-[#f8fafc] border rounded-xl p-3 text-[15px] text-[#0f172a] form-input transition-colors ${
                fieldErrors.name
                  ? 'border-[#ba1a1a] focus:ring-1 focus:ring-[#ba1a1a] focus:border-[#ba1a1a]'
                  : 'border-[#cbd5e1]'
              }`}
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Your full name (letters & numbers only)"
              required
              type="text"
            />
            {fieldErrors.name && (
              <p className="text-[13px] text-[#ba1a1a] mt-1.5 flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-[16px]">error</span>
                {fieldErrors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[14px] font-bold text-[#0f172a] mb-1.5" htmlFor="phone">
              Phone Number <span className="text-[#ba1a1a]">*</span>
            </label>
            <input
              className={`w-full bg-[#f8fafc] border rounded-xl p-3 text-[15px] text-[#0f172a] form-input transition-colors ${
                fieldErrors.phone
                  ? 'border-[#ba1a1a] focus:ring-1 focus:ring-[#ba1a1a] focus:border-[#ba1a1a]'
                  : 'border-[#cbd5e1]'
              }`}
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Your phone number (numbers only)"
              required
              type="tel"
            />
            {fieldErrors.phone && (
              <p className="text-[13px] text-[#ba1a1a] mt-1.5 flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-[16px]">error</span>
                {fieldErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-[14px] font-bold text-[#0f172a] mb-1.5" htmlFor="location">
            Location / Area
          </label>
          <input
            className={`w-full bg-[#f8fafc] border rounded-xl p-3 text-[15px] text-[#0f172a] form-input transition-colors ${
              fieldErrors.location
                ? 'border-[#ba1a1a] focus:ring-1 focus:ring-[#ba1a1a] focus:border-[#ba1a1a]'
                : 'border-[#cbd5e1]'
            }`}
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g., Thali, Boudha, Lalitpur, Bhaktapur"
            type="text"
          />
          {fieldErrors.location && (
            <p className="text-[13px] text-[#ba1a1a] mt-1.5 flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-[16px]">error</span>
              {fieldErrors.location}
            </p>
          )}
        </div>

        <div>
          <label className="block text-[14px] font-bold text-[#0f172a] mb-1.5" htmlFor="service_needed">
            Service Needed
          </label>
          <select
            className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-3 text-[15px] text-[#0f172a] form-input"
            id="service_needed"
            name="service_needed"
            value={formData.service_needed}
            onChange={handleChange}
          >
            <option value="">Select a service</option>
            <option value="Drain Cleaning">Drain Cleaning & Unblocking</option>
            <option value="Septic Tank Pumping">Septic Tank Pumping</option>
            <option value="Sewer Line Repair">Sewer Line Repair</option>
            <option value="Hydro Jetting">Hydro Jetting</option>
            <option value="Emergency Plumbing">Emergency Plumbing</option>
            <option value="Other">Other Service</option>
          </select>
        </div>

        <div>
          <label className="block text-[14px] font-bold text-[#0f172a] mb-1.5" htmlFor="message">
            Message (Optional)
          </label>
          <textarea
            className={`w-full bg-[#f8fafc] border rounded-xl p-3 text-[15px] text-[#0f172a] form-input resize-none transition-colors ${
              fieldErrors.message
                ? 'border-[#ba1a1a] focus:ring-1 focus:ring-[#ba1a1a] focus:border-[#ba1a1a]'
                : 'border-[#cbd5e1]'
            }`}
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Briefly describe your plumbing or drainage issue..."
            rows={4}
          />
          {fieldErrors.message && (
            <p className="text-[13px] text-[#ba1a1a] mt-1.5 flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-[16px]">error</span>
              {fieldErrors.message}
            </p>
          )}
        </div>

        <button
          className="w-full bg-[#1d4ed8] text-white h-14 rounded-xl text-[15px] font-bold hover:bg-[#1e40af] transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <span>Submitting Request...</span>
          ) : (
            <>
              <span className="material-symbols-outlined">send</span>
              <span>Submit Request</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
