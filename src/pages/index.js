import React from "react"
import { useQuery, useMutation } from "@apollo/client"
import gql from "graphql-tag"

const bookMarkQuerry = gql`
  {
    bookmark {
      url
    }
  }
`

const addBookmarkMutation = gql`
  mutation addBookMark($url: String!, $desc: String!) {
    addBookMark(url: $url, desc: $desc) {
      url
    }
  }
`

export default function Home() {
  //open this to get data
  const { data } = useQuery(bookMarkQuerry)
  const [addBookMark] = useMutation(addBookmarkMutation)

  let textfield
  let desc

  console.log(data)
  const addBookmarkSubmit = () => {
    addBookMark({
      variables: { url: textfield.value, desc: desc.value },
      refetchQueries: [{ query: bookMarkQuerry }],
    })
  }

  return (
    <div>
      <input type="text" ref={node => (textfield = node)} />
      <input type="text" ref={node => (desc = node)} />
      <button onClick={addBookmarkSubmit}>Submit</button>
    </div>
  )
}
