'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { CompanyDetails } from '@/types';
import { companyService } from '@/services/companyService';

interface CompanyContextType {
  company: CompanyDetails | null;
  loading: boolean;
  error: string | null;
  refreshCompany: () => Promise<void>;
}

const CompanyContext = createContext<CompanyContextType>({
  company: null,
  loading: true,
  error: null,
  refreshCompany: async () => {},
});

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const [company, setCompany] = useState<CompanyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanyDetails = useCallback(async () => {
    try {
      setLoading(true);
      const data = await companyService.getDetails();
      if (data) {
        setCompany(data);
        setError(null);
      }
    } catch (err: any) {
      console.error('Failed to fetch company details from database:', err);
      setError(err?.message || 'Failed to load company details');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanyDetails();
  }, [fetchCompanyDetails]);

  return (
    <CompanyContext.Provider
      value={{
        company,
        loading,
        error,
        refreshCompany: fetchCompanyDetails,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
}
