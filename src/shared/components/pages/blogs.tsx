import { useState } from "react";
import { FaSearchengin } from "react-icons/fa6";
import BlogsProductCard from "../layouts/BlogProduct";
import Layout from "../layouts/layout";
import { useTranslation } from "react-i18next";

const blogPosts = [
  { id: "1", name: "Latest Fashion Trends 2024", images: ["https://i.pinimg.com/1200x/9d/be/6a/9dbe6a288dd99d451fd5b3a2fd5881cf.jpg"], category: "Fashion", description: "Discover the hottest fashion trends for this season", owner: "Fashion Editor", date: "Dec 15, 2024" },
  { id: "2", name: "Men's Style Guide", images: ["https://i.pinimg.com/1200x/93/2b/98/932b986e54a77be6ec5813b95e5454c3.jpg"], category: "Men's Fashion", description: "Essential style tips for the modern gentleman", owner: "Style Expert", date: "Dec 12, 2024" },
  { id: "3", name: "Seasonal Accessories", images: ["https://i.pinimg.com/1200x/d2/5c/26/d25c265c63c07a3ae081c1dc51cff9d3.jpg"], category: "Accessories", description: "Must-have accessories for every season", owner: "Accessories Team", date: "Dec 10, 2024" },
  { id: "4", name: "Women's Wardrobe Essentials", images: ["https://i.pinimg.com/736x/57/0c/5a/570c5a69781b17b3e0eec85311f78f33.jpg"], category: "Women's Fashion", description: "Building the perfect capsule wardrobe", owner: "Women's Editor", date: "Dec 8, 2024" },
  { id: "5", name: "Handbag Trends", images: ["https://i.pinimg.com/736x/9e/4f/ad/9e4fad34fc3f5bf2d1f1915cea1a317c.jpg"], category: "Bags", description: "The latest in luxury handbag designs", owner: "Bag Specialist", date: "Dec 5, 2024" },
  { id: "6", name: "Watch Collection Guide", images: ["https://i.pinimg.com/736x/a6/86/8f/a6868f8f9dd1314931021884b4a9d6fd.jpg"], category: "Watches", description: "Timeless pieces for every occasion", owner: "Watch Expert", date: "Dec 3, 2024" },
];

export default function Blogs() {
  const { t } = useTranslation();
  const [showRecent, setShowRecent] = useState(true);
  const [showArchives, setShowArchives] = useState(true);
  const [showCategories, setShowCategories] = useState(true);
  const [showTags, setShowTags] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBlogs = blogPosts.filter(blog =>
    blog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      {/* Page Header */}
      <div className="bg-gray-100 text-center py-14">
        <h1 className="text-3xl font-bold text-gray-900">{t('blog.title')}</h1>
        <p className="text-gray-500 mt-2">{t('blog.subtitle')}</p>
      </div>

      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Blog Cards */}
          <main className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-10">
            {filteredBlogs.slice(0, 8).map((post) => (
              <BlogsProductCard
                key={post.id}
                image={post.images[0]}
                category={post.category}
                title={post.name}
                owner={post.owner}
                date={post.date}
                intro={post.description}
              />
            ))}
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-10">
            {/* Search */}
            <div className="flex">
              <input
                type="text"
                placeholder={t('blog.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 text-sm border border-gray-200 focus:outline-none focus:border-blue-500 rounded-l-lg"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 flex items-center justify-center rounded-r-lg transition-colors">
                <FaSearchengin />
              </button>
            </div>

            {/* Recent Posts */}
            <div>
              <h3 onClick={() => setShowRecent(!showRecent)} className="text-base font-bold text-gray-900 cursor-pointer select-none flex items-center justify-between border-b border-gray-200 pb-2">
                {t('blog.recentPosts')} <span className="text-blue-600">{showRecent ? '−' : '+'}</span>
              </h3>
              {showRecent && (
                <ul className="mt-4 space-y-4">
                  {blogPosts.slice(0, 5).map((post) => (
                    <li key={post.id} className="flex gap-3">
                      <img src={post.images[0]} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium leading-snug hover:text-blue-600 cursor-pointer">{post.name}</p>
                        <p className="text-xs text-gray-400 mt-1">{post.date}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Archives */}
            <div>
              <h3 onClick={() => setShowArchives(!showArchives)} className="text-base font-bold text-gray-900 cursor-pointer select-none flex items-center justify-between border-b border-gray-200 pb-2">
                {t('blog.archives')} <span className="text-blue-600">{showArchives ? '−' : '+'}</span>
              </h3>
              {showArchives && (
                <ul className="mt-3 space-y-2 text-sm text-gray-600">
                  {['May 2019', 'January 2020', 'September 2023', 'January 2025'].map((a) => (
                    <li key={a} className="hover:text-blue-600 cursor-pointer transition-colors">{a}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Categories */}
            <div>
              <h3 onClick={() => setShowCategories(!showCategories)} className="text-base font-bold text-gray-900 cursor-pointer select-none flex items-center justify-between border-b border-gray-200 pb-2">
                {t('blog.categories')} <span className="text-blue-600">{showCategories ? '−' : '+'}</span>
              </h3>
              {showCategories && (
                <ul className="mt-3 space-y-2 text-sm text-gray-600">
                  {['Accessories', 'Beauty', 'Design', 'Fashion Design', 'Lifestyle', 'Travel'].map((cat) => (
                    <li key={cat} className="hover:text-blue-600 cursor-pointer transition-colors">{cat}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Tag Cloud */}
            <div>
              <h3 onClick={() => setShowTags(!showTags)} className="text-base font-bold text-gray-900 cursor-pointer select-none flex items-center justify-between border-b border-gray-200 pb-2">
                {t('blog.tagCloud')} <span className="text-blue-600">{showTags ? '−' : '+'}</span>
              </h3>
              {showTags && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {['Design', 'Fashion', 'Looks', 'Men', 'Music', 'Style', 'Women'].map((tag) => (
                    <button key={tag} className="px-3 py-1 text-xs border border-gray-300 rounded-full hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors">
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}
