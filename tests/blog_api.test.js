const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const api = supertest(app)

var token = null;

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

describe('actions with blogs where authentication is needed', () => {
  let headers

  beforeEach(async () => {
    const newUser = {
      username: 'janedoez',
      name: 'Jane Z. Doe',
      password: 'password',
    }

    await api
      .post('/api/users')
      .send(newUser)

    const result = await api
      .post('/api/login')
      .send(newUser)

    headers = {
      'Authorization': `bearer ${result.body.token}`
    }
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
      .set(headers)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    
    const titles = blogsAtEnd.map(n => n.title)
    expect(titles).toContain(
      'Front-end path'
    )
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
      .set(headers)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    //since all the other blogs had some likes, the last added has to be the only one with 0 (default)
      const alLBlogs = await helper.blogsInDb()
      const likes = alLBlogs.map(n => n.likes)
      expect(likes).toContain(0)
  })

  test('blog without title and url is not added', async () => {
    const newBlog = {
      author: "Bob Smith",
      likes: 1
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set(headers)
      .expect(400)
  
    const blogsAtEnd = await helper.blogsInDb()
  
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('operation fails with proper error if url is missing', async () => {
    const newBlog = {
      title: 'Blazing Fast Delightful Testing',
      author: 'Rick Hanlon',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set(headers)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test('operation fails with proper error if token is missing', async () => {
    const newBlog = {
      title: 'Blazing Fast Delightful Testing',
      author: 'Rick Hanlon',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })

  describe('deleting blog list item', () => {
    let result

    beforeEach(async () => {
      const newBlog = {
        title: 'Great developer experience',
        author: 'Hector Ramos',
        url: 'https://jestjs.io/blog/2017/01/30/a-great-developer-experience',
        likes: 7
      }

      result = await api
        .post('/api/blogs')
        .send(newBlog)
        .set(headers)
    })

    test('blog is deleted if the id exists and is valid', async () => {
      const aBlog = result.body

      const initialBlogs = await helper.blogsInDb()
      await api
        .delete(`/api/blogs/${aBlog.id}`)
        .set(headers)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd.length).toBe(initialBlogs.length - 1)

      const titles = blogsAtEnd.map(b => b.title)
      expect(titles).not.toContain(
        aBlog.title
      )
    })
  })
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

  const blogsAtEnd = await helper.blogsInDb()

  const likes = blogsAtEnd.map(r => r.likes)

  expect(likes).not.toContain(blogToUpdate.likes)
})

describe('user tests', () => {
  test('user without username is not created', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` is required')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('user without password is not created', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Test',
      name: 'Superuser'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Password is required')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('user with username length less than 3 characters it not created', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Jo',
      name: 'Superuser',
      password: 'Testing'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('is shorter than the minimum allowed length (3)')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('user with password length less than 3 characters it not created', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Joe',
      name: 'Superuser',
      password: 'yo'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Password should be at least 3 characters long!')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('user with username, which already exists, is not created', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'test',
      name: 'Bobby Black',
      password: 'mypass!!!'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})