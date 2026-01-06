import { supabase } from '@/integrations/supabase/client';

export type PhotoCategory = 'students' | 'staff' | 'visitors' | 'parent-pickup';

export const uploadPhoto = async (
  photoBlob: Blob,
  category: PhotoCategory,
  userId: string,
  type: 'check_in' | 'check_out'
): Promise<string> => {
  try {
    const timestamp = new Date().getTime();
    const fileName = `${category}/${userId}_${type}_${timestamp}.jpg`;

    const { data, error } = await supabase.storage
      .from('attendance-photos')
      .upload(fileName, photoBlob, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (error) throw error;

    // Create signed URL for private bucket (valid for 1 hour for security)
    const { data: signedUrlData, error: urlError } = await supabase.storage
      .from('attendance-photos')
      .createSignedUrl(data.path, 3600); // 1 hour in seconds

    if (urlError) throw urlError;

    return signedUrlData.signedUrl;
  } catch (error) {
    console.error('Photo upload error:', error);
    throw new Error('Failed to upload photo');
  }
};

export const deletePhoto = async (photoUrl: string): Promise<void> => {
  try {
    const path = photoUrl.split('/attendance-photos/')[1];
    if (!path) return;

    const { error } = await supabase.storage
      .from('attendance-photos')
      .remove([path]);

    if (error) throw error;
  } catch (error) {
    console.error('Photo deletion error:', error);
  }
};