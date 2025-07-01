import { createClient } from '@supabase/supabase-js'

// These would be environment variables in a real application
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://dummy.supabase.co'
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'dummy-key'

// Create Supabase client with error handling
export const supabase = createClient(supabaseUrl, supabaseKey)

// File upload function
export const uploadFile = async (file: File, bucket: string = 'cad-files') => {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file)
    
    if (error) {
      throw error
    }
    
    return { data, fileName }
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}

// Get file URL
export const getFileUrl = (fileName: string, bucket: string = 'cad-files') => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName)
  
  return data.publicUrl
}

// Download file
export const downloadFile = async (fileName: string, bucket: string = 'cad-files') => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(fileName)
    
    if (error) {
      throw error
    }
    
    return data
  } catch (error) {
    console.error('Error downloading file:', error)
    throw error
  }
}

// Delete file
export const deleteFile = async (fileName: string, bucket: string = 'cad-files') => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName])
    
    if (error) {
      throw error
    }
    
    return true
  } catch (error) {
    console.error('Error deleting file:', error)
    throw error
  }
}

// List files in bucket
export const listFiles = async (bucket: string = 'cad-files') => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list()
    
    if (error) {
      throw error
    }
    
    return data
  } catch (error) {
    console.error('Error listing files:', error)
    throw error
  }
}
