const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')
const blog = require('../models/blog')
const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('unique identifier property of the blog posts is named id', async () => {
  const allBlogs = await helper.blogsInDb()
  allBlogs.forEach(blog => expect(blog.id).toBeDefined());
})

test('if likes property is missing, it defaults to 0', async () => {
  //blog without likes is added
  const newBlog = {
    title: "Front-end path",
    author: "Brad Tom",
    url: "www.frontendguru.io"
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  //since all the other blogs had some likes, the last added has to be the only one with 0 (default)
    const alLBlogs = await helper.blogsInDb()
    const likes = alLBlogs.map(n => n.likes)
    expect(likes).toContain(0)
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: "Front-end path",
    author: "Brad Tom",
    url: "www.frontendguru.io",
    likes: 67
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  
  const titles = blogsAtEnd.map(n => n.title)
  expect(titles).toContain(
    'Front-end path'
  )
})

test('blog without title and url is not added', async () => {
  const newBlog = {
    author: "Bob Smith",
    likes: 1
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

test('blog is deleted if id exists and is valid', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(
    helper.initialBlogs.length - 1
  )

  const titles = blogsAtEnd.map(r => r.title)

  expect(titles).not.toContain(blogToDelete.title)
})

test('blog like amount is updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const blog = {
    title: blogToUpdate.title,
    author: blogToUpdate.author,
    url: blogToUpdate.url,
    likes: blogToUpdate.likes + 5
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(blog)
    .expect(200)
})

afterAll(() => {
  mongoose.connection.close()
})