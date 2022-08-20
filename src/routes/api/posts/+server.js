import { fetchMarkdownPosts } from '$lib/utils'

export const GET = async () => {
  const allPosts = await fetchMarkdownPosts()

  const sortedPosts = allPosts.sort((a, b) => {
    return new Date(b.meta.date) - new Date(a.meta.date)
  })

  const responseOptions = {
    status: 200,
    headers: {
      'content-type': 'application/json'
    }
  }

  return new Response(
    JSON.stringify(sortedPosts),
    responseOptions
  )
}