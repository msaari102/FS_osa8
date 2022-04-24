import { useQuery } from '@apollo/client'

import { FIND_GENRE_BOOKS, ME } from '../queries'

const Recommend = (props) => {
  const genreToSearch = props.genre
  const result = useQuery(FIND_GENRE_BOOKS, {
    variables: { genreToSearch },
    fetchPolicy: 'no-cache',
  })

  if (!props.show || result.loading) {
    return null
  }

  const books = result.data.allBooks

  return (
    <div>
      <h2>recommendations</h2>
      <div>books in your favorite genre {props.genre}</div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend
