// Expose posts and products so index.html can load them.
window.sitePosts = [
{ file: 'posts/demo.md', title: 'Welcome Post', date: '2025-09-13' },
{ file: 'posts/nepal.md', title: 'Nepal — Visual Guide', date: '2025-09-14' }
];
// Optional: products for the shop grid (title, description, price, link)
window.siteProducts = [
{
title: 'Aadhaar Form Bundle',
description: 'Printed Aadhaar forms + guidance',
price: '₹49',
link: 'https://amzn.in/d/h8FSjpi' // your Amazon short link (sample)
},
{
title: 'PAN Application Kit',
description: 'PAN form + scanning service',
price: '₹99',
link: 'https://amzn.in/d/yourkitlink'
},
{
title: 'Xerox Pack (50 pages)',
description: 'High quality mono xerox',
price: '₹120',
link: '#'
}
]