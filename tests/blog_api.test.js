const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body.length).toBe(helper.initialBlogs.length)
})

test('a specific blog is within the return blogs', async () => {
  const response = await api.get('/api/blogs')

  const withoutIdResponseArray = response.body.map(({ id, ...keepAttrs }) => keepAttrs)
  expect(withoutIdResponseArray).toContainEqual(helper.initialBlogs[0])
  expect(withoutIdResponseArray).toContainEqual(helper.initialBlogs[1])
})

test('blog has attribute id', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body[0]["id"]).toBeDefined()
  expect(response.body[1]["id"]).toBeDefined()
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: "Title 3",
    author: 'Author 3',
    url: "Url 3",
    likes: 3
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const updatedBlogs = await helper.blogsInDb()
  expect(updatedBlogs.length).toBe(helper.initialBlogs.length + 1)
  
  const withoutIdResponseArray = updatedBlogs.map(({ id, ...keepAttrs }) => keepAttrs)
  expect(withoutIdResponseArray[updatedBlogs.length-1]).toEqual(newBlog)
})


test('an invalid blog won\'t be added', async () => {
  const newBlog = {
    title: "Title 3",
    author: 'Author 3',
    //url: "Url 3",
    likes: 3
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const updatedBlogs = await helper.blogsInDb()
  expect(updatedBlogs.length).toBe(helper.initialBlogs.length)
})

afterAll(() => {
  mongoose.connection.close()
})