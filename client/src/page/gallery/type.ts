export interface listGallery {
  result: {
    items: {
      _id: string
      userId: string
      folderId: string
      folder: string
      src: string
      fileId: string
      createdAt: string
      type: string
    }[]
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
