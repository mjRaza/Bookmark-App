const { ApolloServer, gql } = require("apollo-server-lambda")
const faunadb = require("faunadb")
//
q = faunadb.query

const typeDefs = gql`
  type Query {
    bookmark: [Bookmark!]
  }
  type Bookmark {
    id: ID!
    url: String!
    desc: String!
  }
  type Mutation {
    addBookMark(url: String!, desc: String!): Bookmark!
  }
`

const resolvers = {
  Query: {
    bookmark: async (root, args) => {
      var client = new faunadb.Client({
        secret: "fnAEMEvvkZACB9UV-Cp8LziT5CmtBTUx05sZ36AQ",
      })
      try {
        const result = await client.query(
          q.Map(
            q.Paginate(q.Match(q.Index("url"))),
            q.Lambda(x => q.Get(x))
          )
        )

        const newData = result.data.map(x => {
          return { id: x.ts, url: x.data.url, desc: x.data.desc }
        })
        return newData
      } catch (error) {
        console.log(error)
      }
    },
  },
  Mutation: {
    addBookMark: async (_, { url, desc }) => {
      var client = new faunadb.Client({
        secret: "fnAEMEvvkZACB9UV-Cp8LziT5CmtBTUx05sZ36AQ",
      })
      try {
        const result = await client.query(
          q.Create(q.Collection("links"), {
            data: { url, desc },
          })
        )
        return {
          id: result.ts,
          url: result.data.url,
          desc: result.data.desc,
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const handler = server.createHandler()

module.exports = { handler }
