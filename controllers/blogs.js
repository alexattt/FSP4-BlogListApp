const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1, id: 1 })

  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blogToShow = await Blog.findById(request.params.id)
  response.json(blogToShow)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body

  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes == undefined ? 0 : body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.json(savedBlog)
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = 
  {
    user: body.user,
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes == undefined ? 0 : body.likes
  }

  const updatedNote = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedNote)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() == user._id.toString()) {
    await Blog.findByIdAndRemove(request.params.id)
  } 
  else {
    return response.status(401).json({ error: 'You are not allowed to delete this post!' })
  }
  response.status(204).end()
})

module.exports = blogsRouter