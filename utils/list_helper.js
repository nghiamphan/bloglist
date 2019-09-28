const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sumLikes, blog) => {
    return sumLikes + blog.likes
  }
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  
  if (blogs.length === 0) return {}

  let mostLikes = -999999
  let mostLikedBlog = blogs[0]
  blogs.forEach(blog => {
    if (mostLikes < blog.likes) {
      mostLikes = blog.likes
      mostLikedBlog = blog
    }
  });
  return mostLikedBlog
}

const processAuthor = (blogs) => {
  let authorStats = {}

  let mostBlogs = 0
  let mostBlogsAuthor
  let mostLikes = 0
  let mostLikedAuthor

  blogs.forEach(blog => {
    const author = blog.author
    if (blog.author in authorStats) {
      
      authorStats[author]["blogs"] += 1
      authorStats[author]["likes"] += blog.likes
    } else {
      authorStats[author] = {
        "blogs": 1,
        "likes": blog.likes
      }
    }

    if (mostBlogs < authorStats[author]["blogs"]) {
      mostBlogs = authorStats[author]["blogs"]
      mostBlogsAuthor = author
    }

    if (mostLikes < authorStats[author]["likes"]) {
      mostLikes = authorStats[author]["likes"]
      mostLikedAuthor = author
    }
    
  })
  return [mostBlogsAuthor, mostBlogs, mostLikedAuthor, mostLikes]
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return {}

  const arr = processAuthor(blogs)
  return (
    {
      author: arr[0],
      blogs: arr[1]
    }
  )
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return {}

  const arr = processAuthor(blogs)
  return (
    {
      author: arr[2],
      likes: arr[3]
    }
  )
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}