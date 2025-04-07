export const generateSlug = (title: string): string => {
  return title
    .normalize('NFD') // Chuyển đổi sang dạng có dấu
    .replace(/[\u0300-\u036f]/g, '') // Xóa dấu tiếng Việt
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Chỉ giữ lại chữ cái, số, khoảng trắng và dấu '-'
    .trim()
    .replace(/\s+/g, '-') // Thay thế khoảng trắng bằng '-'
    .replace(/-+/g, '-') // Loại bỏ các dấu '-' liên tiếp
}
