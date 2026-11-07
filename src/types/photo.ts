export interface PhotoMetadata {
  title?: string
  description?: string
  width?: number
  height?: number
  date_taken?: string
  camera_make?: string
  camera_model?: string
  [key: string]: unknown
}

export interface PhotoResponse {
  path: string
  album?: string
  metadata?: PhotoMetadata
  image_url: string
}
