/**
 * Responsive image helper: every .jpg in /public/images has a 1280px .webp and a 720px -sm.webp twin.
 * Returns src/srcSet so browsers download the smallest file that looks sharp.
 */
export function responsive(path: string) {
  const base = path.replace(/\.(jpe?g|png|webp)$/i, '')
  return {
    src: `${base}.webp`,
    srcSet: `${base}-sm.webp 720w, ${base}.webp 1280w`,
  }
}
