---
layout: page
title: Blog
permalink: /blog/
description: Occasional posts, from travel recommendations to technical notes.
# Link previews show the latest post's image. Update this when publishing a new post.
image: https://storage.googleapis.com/vtjeng-photos/opengraph_card/DSC_4488_singapore_mount_faber.jpg
---

<div class="home">
  {%- if site.posts.size > 0 -%}
    <ul class="post-list">
      {%- for post in site.posts -%}
      <li>
        {%- assign date_format = site.minima.date_format | default: "%b %-d, %Y" -%}
        <span class="post-meta">{{ post.date | date: date_format }}</span>
        <h3>
          <a class="post-link" href="{{ post.url | relative_url }}">
            {{ post.title | escape }}
          </a>
        </h3>
        {%- if post.excerpt -%}
          {{ post.excerpt }}
        {%- endif -%}
      </li>
      {%- endfor -%}
    </ul>
  {%- endif -%}
</div>
