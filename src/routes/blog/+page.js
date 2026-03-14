import { fetchMarkdownPosts } from '$lib/utils'

export async function load() {
  const allPosts = await fetchMarkdownPosts()

  const sorted = allPosts.sort((a, b) => {
    return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
  })

  return {
    posts: sorted
  }
}
