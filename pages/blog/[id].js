export default function Post ({post}) {
    return (
        <>
        <main>
            <h1>{post.title}</h1>
            <p>{post.content}</p>
        </main>
        </>
    )
}

export async function getStaticProps({params}) {
    {
        const query = `
        query GetPostByID($id: ID!) {
            # Dans cette requête de type query on appelle le point d'entrée post
            # En lui passant le contenu de la variable
            post(id: $id) {
              slug
              title
              content
              excerpt
              category {
                label
                posts {
                  title
                  excerpt
                }
              }
            }
          }
        `
        const postId = params.id;
        const post = await fetch(`http://localhost:3001/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json"},
          body: JSON.stringify({
              query,
              variables: {id: postId }
            })
        })
          .then(response => response.json())
        return {
          props: {
            post: post.data.post
          }
        }
    }
}

export async function getStaticPaths () {
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
      paths: posts.data.posts.map(post => ({
        params: {id: post.id.toString()}
      })),
      fallback: false,
    }
  }