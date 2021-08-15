var lodash = require('lodash');

const dummy = (blogs) => {
  return 1;
}

const totalLikes = (blogs) => {
  var totalLikes = 0
  for (var i = 0; i < blogs.length; i++ ) {
    totalLikes += blogs[i].likes
  }
  return totalLikes
}

const favoriteBlog = (blogs) => {
  const maxLikesCount = Math.max(...blogs.map(blog => blog.likes), 0);
  var favBlog = {};

  blogs.filter(blog => {
    if (blog.likes === maxLikesCount) {
      favBlog = {
        title: blog.title,
        author: blog.author,
        likes: blog.likes
      }
    }
  })

  return favBlog
}

const mostBlogs = (blogs) => {
  let blogOccurencesCount = Object.values(blogs.reduce((mapping, blog) => {
  
    const { [blog.author]:matchingItem } = mapping;
    
    if(matchingItem) {
      matchingItem.blogs ++;
    }

    else {
      mapping[blog.author] = { ...blog, blogs: 1 };
    }
    return mapping;
  
  },{}))

  const maxBlogAmount = Math.max(...blogOccurencesCount.map(blog => blog.blogs), 0);
  var mostPopularAuthor = {};

  blogOccurencesCount.filter(blog => {
    if (blog.blogs === maxBlogAmount) {
      mostPopularAuthor = {
        author: blog.author,
        blogs: blog.blogs
      }
    }
  })
  
  return mostPopularAuthor;
}

const mostLikes = (blogs) => {
  var blogCount = lodash.countBy(blogs, 'author');
  var maxBlogsAuthor = Object.keys(blogCount).reduce((a, b) => blogCount[a] > blogCount[b] ? a : b);
  var mostLikes = { };

  var likeCount =
  lodash(blogs)
    .groupBy('author')
    .map((blogs, key) => ({
        'author': key,
        'likes': lodash.sumBy(blogs, 'likes') }))
    .value();

  lodash.find(likeCount, function(blog) {
    if (blog.author === maxBlogsAuthor) {
        mostLikes = blog;
    }
  });

  return mostLikes;
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}