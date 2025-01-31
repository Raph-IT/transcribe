import React from 'react';
import Layout from '../components/Layout';
import { Calendar, User } from 'lucide-react';

const Blog = () => {
  const posts = [
    {
      title: "L'IA dans la transcription audio : une révolution",
      excerpt: "Découvrez comment l'intelligence artificielle transforme la transcription audio et améliore la productivité des entreprises.",
      author: "Marie Laurent",
      date: "30 Jan 2025",
      readTime: "5 min",
      image: "https://images.unsplash.com/photo-1526378800651-c32d170fe6f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
    },
    {
      title: "10 conseils pour des réunions plus efficaces",
      excerpt: "Apprenez à optimiser vos réunions et à en tirer le meilleur parti grâce à nos conseils d'experts.",
      author: "Thomas Dubois",
      date: "28 Jan 2025",
      readTime: "4 min",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
    },
    {
      title: "Le futur du travail à distance",
      excerpt: "Comment la technologie façonne l'avenir du travail à distance et transforme notre façon de collaborer.",
      author: "Sophie Martin",
      date: "25 Jan 2025",
      readTime: "6 min",
      image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
    }
  ];

  return (
    <Layout>
      <div className="py-12 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Blog
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Découvrez nos derniers articles sur la productivité et la transcription
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <article
                key={index}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="h-48 w-full overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-base text-gray-600 dark:text-gray-400">
                    {post.excerpt}
                  </p>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {post.author}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {post.date} • {post.readTime}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-20 text-center">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Vous souhaitez en savoir plus ?
            </h3>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Inscrivez-vous à notre newsletter pour recevoir nos derniers articles
            </p>
            <div className="mt-8">
              <a
                href="/register"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                S'inscrire à la newsletter
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
