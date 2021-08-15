const listHelper = require('../utils/list_helper')

const listWithZeroBlogs = []

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]

const listWithManyBlogs = [
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

const listWithManyBlogsLikes = [
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 15,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 15,
    __v: 0
  }  
]

const listWithManyBlogsAuthors = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  },,
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
]

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('when list has no blogs, total likes equals zero', () => {
    const result = listHelper.totalLikes(listWithZeroBlogs)
    expect(result).toBe(0)
  })

  test('when list has many blogs, total likes equals the sum of all the likes', () => {
    const result = listHelper.totalLikes(listWithManyBlogs)
    expect(result).toBe(24)
  })
})

describe('blog with most likes', () => {

  test('when list has no blogs, function returns empty object', () => {
    const result = listHelper.favoriteBlog(listWithZeroBlogs)
    expect(result).toEqual({ })
  })

  test('when list has one blog, function returns this one blog', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    expect(result).toEqual({title: 'Go To Statement Considered Harmful', author: 'Edsger W. Dijkstra', likes: 5})
  })

  test('when list has multiple blogs, favorite is the one with the most likes', () => {
    const result = listHelper.favoriteBlog(listWithManyBlogs)
    expect(result).toEqual({title: 'Canonical string reduction', author: 'Edsger W. Dijkstra', likes: 12})
  })

  test('when list has multiple blogs and some have same amount of likes, favorite is the last one in the list', () => {
    const result = listHelper.favoriteBlog(listWithManyBlogsLikes)
    expect(result).toEqual({title: 'Type wars', author: 'Robert C. Martin', likes: 15})
  })
})

describe('author with most blogs', () => {

  test('when list has one blog, the only blog author is returned', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    expect(result).toEqual({author: 'Edsger W. Dijkstra', blogs: 1})
  })

  test('when list has multiple blogs, author who has the most amount of blogs is returned', () => {
    const result = listHelper.mostBlogs(listWithManyBlogs)
    expect(result).toEqual({author: 'Robert C. Martin', blogs: 3})
  })

  test('when list has multiple blogs and some authors have the same amount of blogs, last author of list is returned', () => {
    const result = listHelper.mostBlogs(listWithManyBlogsAuthors)
    expect(result).toEqual({author: 'Edsger W. Dijkstra', blogs: 2})
  })
})

describe('author with most blogs and his blog total amount of likes', () => {

  test('when list has one blog, author and blog likes are returned', () => {
    const result = listHelper.mostLikes(listWithOneBlog)

    expect(result).toEqual({author: 'Edsger W. Dijkstra', likes: 5})
  })

  test('when list has multiple blogs, author of most blogs is returned and the total amount of likes he has received', () => {
    const result = listHelper.mostLikes(listWithManyBlogsLikes)

    expect(result).toEqual({author: 'Robert C. Martin', likes: 40})
  })

  test('when list has multiple blogs and some authors have the same amount of blogs, last author of list is returned', () => {
    const result = listHelper.mostLikes(listWithManyBlogsAuthors)
    expect(result).toEqual({author: 'Edsger W. Dijkstra', likes: 17})
  })
})