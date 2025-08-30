
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SystemSettingsHeader } from './system-settings/SystemSettingsHeader';
import { SystemSettingsContent } from './system-settings/SystemSettingsContent';


const SystemSettings = ({ adminData }: { adminData: { role: string; [key: string]: any } }) => {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <SystemSettingsHeader />
      <SystemSettingsContent />
      
    </div>
  );
};

export default SystemSettings;
