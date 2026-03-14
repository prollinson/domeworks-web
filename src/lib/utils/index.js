export const fetchMarkdownPosts = async () => {
  const allPostFiles = import.meta.glob('/src/routes/blog/**/+page.md')
  const iterablePostFiles = Object.entries(allPostFiles)

  const allPosts = await Promise.all(
    iterablePostFiles.map(async ([path, resolver]) => {
      /** @type {{ metadata: Record<string, unknown> }} */
      const resolved = /** @type {any} */ (await resolver())
      const postPath = path.slice(11, -'/+page.md'.length) + '/'

      return {
        meta: resolved.metadata,
        path: postPath
      }
    })
  )

  return allPosts
}