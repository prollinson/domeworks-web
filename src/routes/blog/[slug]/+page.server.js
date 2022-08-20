export async function load({ params }) {
  const post = await import(`../${params.slug}.md`)
  const { title, date } = post.metadata
  const content = post.default.render().html
  
  return {
    title,
    date,
    content
  }
}