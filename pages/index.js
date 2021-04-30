import Head from 'next/head';
import Link from 'next/link';

export default function Home({posts}) {

  return (
    <>
      <Head>
        <title>Mon super blog</title>
      </Head>
      <ul>
        {posts.map(post =>
          <li key={post.id}>
          {/* Next met à disposition un composant Link
          Il a une propriété href
          Une balise <a></a> doit être toujours en enfant directe de Link */}
            <Link href={`/blog/${post.id}`}>
            <a>
            <h3>{post.title}</h3>
            </a>
            </Link>
          </li>
        )}
      </ul>
    </>
  )
}

export async function getStaticProps () {
  const query = `
  query {
    # On récupère tous les posts
    posts {
      id
      title
      slug
      excerpt
      content
        category {
          id
          label
          # Et les posts des cette category (pour faire une sections "Autre article sur le même sujet)
          posts {
            slug
            excerpt
        }
      }
    }
  }
  `;

  const posts = await fetch('http://localhost:3001/graphql', {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify({query})
  })
    .then(response => response.json())
  return {
    props: {
      posts: posts.data.posts
    }
  }
}

