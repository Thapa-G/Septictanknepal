'use client';

import React, { useState } from 'react';
import { contactService } from '@/services/contactService';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    service_needed: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[14px] font-bold text-[#0f172a] mb-1.5" htmlFor="name">
              Name <span className="text-[#ba1a1a]">*</span>
            </label>
            <input
              className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-3 text-[15px] text-[#0f172a] form-input"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
              type="text"
            />
          </div>

          <div>
            <label className="block text-[14px] font-bold text-[#0f172a] mb-1.5" htmlFor="phone">
              Phone Number <span className="text-[#ba1a1a]">*</span>
            </label>
            <input
              className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-3 text-[15px] text-[#0f172a] form-input"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Your phone number"
              required
              type="tel"
            />
          </div>
        </div>

        <div>
          <label className="block text-[14px] font-bold text-[#0f172a] mb-1.5" htmlFor="location">
            Location / Area
          </label>
          <input
            className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-3 text-[15px] text-[#0f172a] form-input"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Thali, Boudha, Lalitpur, Bhaktapur"
            type="text"
          />
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
            className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-3 text-[15px] text-[#0f172a] form-input resize-none"
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Briefly describe your plumbing or drainage issue..."
            rows={4}
          />
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
