
import { useState, useEffect } from 'react';
import { useSystemSettings } from './useSystemSettings';

export const useDashboardVisibility = () => {
  const { settings, loading } = useSystemSettings();
  
  return { 
    visibility: settings.dashboard_visibility, 
    loading 
  };
};
