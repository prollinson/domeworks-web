export const fetchMarkdownPosts = async () => {
  const allPostFiles = import.meta.glob('/src/routes/blog/*.md')
  const iterablePostFiles = Object.entries(allPostFiles)

  const allPosts = await Promise.all(
    iterablePostFiles.map(async ([path, resolver]) => {
      /** @type {{ metadata: Record<string, unknown> }} */
      const resolved = /** @type {any} */ (await resolver())
      const postPath = path.slice(11, -3)

      return {
        meta: resolved.metadata,
        path: postPath
      }
    })
  )

  return allPosts
}