const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: "How to learn coding?",
    author: "Bob Smith",
    url: "www.codingcool.io",
    likes: 1
  },
  {
    title: "React Hooks explained",
    author: "Lydia Night",
    url: "www.reactfun.com",
    likes: 55
  },
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', author: 'willremovethissoon', url: 'willremovethissoon', likes: 0 })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}