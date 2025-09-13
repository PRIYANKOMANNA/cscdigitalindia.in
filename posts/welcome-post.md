
/* ======================
posts/welcome-post.md
(sample markdown file)
====================== */

# Welcome Post

**তারিখ:** 2025-09-13
**লেখক:** Priyanko Manna

এটা আমার প্রথম টেস্ট পোস্ট।

CSC Hub ব্লগ সঠিকভাবে কাজ করছে কি না সেটা টেস্ট করার জন্য লিখলাম।

---

### কিভাবে নতুন পোস্ট যোগ করবেন

1. `posts/` ফোল্ডারে `.md` ফাইল রাখুন — filename এর শেষে `.md` লাগবে।
2. `posts/posts.json` ফাইলে নতুন পোস্টের মেটা (file, slug, title, date, author, excerpt) যোগ করুন।

> উদাহরণ:
>
> ```json
> {
>  "file":"new-post.md",
>  "slug":"new-post",
>  "title":"My New Post",
>  "date":"2025-09-14",
>  "author":"Your Name",
>  "excerpt":"এক লাইনের সারাংশ",
>  "price": null
> }
> ```

---

### Styling ও কনটেন্ট টিপস

- H1/H2 ব্যবহার করুন — SEO এর জন্য H1 প্রতিটি পোস্টে রাখুন।
- ছবি যোগ করতে: `![alt text](image.jpg)` এবং `posts/` ফোল্ডারের পাশে `images/` সাবফোল্ডার রাখুন।
- কোড ব্লক: ```js
- লিস্ট, ব্লককোট ইত্যাদি Markdown সম্পূর্ণ সাপোর্ট করে।


<!-- End of file collection -->
