<script>
  export let data
</script>
<article>
  <div class="w-full px-4 md:px-6 text-xl text-gray-800 leading-normal" style="font-family:Georgia,serif;">

    <!--Title-->
    <div class="font-sans">
      <p class="text-base md:text-sm text-green-500 font-bold">&lt; <a href="/blog" class="text-base md:text-sm text-green-500 font-bold no-underline hover:underline">BACK TO BLOG</a></p>
      <h1 class="font-bold font-sans break-normal text-gray-900 pt-6 pb-2 text-3xl md:text-4xl">{data.title}</h1>
      <p class="text-sm md:text-base font-normal text-gray-600">Published {data.date}</p>
    </div>


    <!--Post Content-->
    {@html data.content}

    <!--/ Post Content-->

  </div>
</article>