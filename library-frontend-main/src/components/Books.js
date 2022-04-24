import { useQuery } from '@apollo/client'
import { useState } from 'react'

import { GENRES, FIND_GENRE_BOOKS } from '../queries'

const Books = (props) => {
  const [genreToSearch, setgenreToSearch] = useState(null)
  const result = useQuery(FIND_GENRE_BOOKS, {
    variables: { genreToSearch },
    fetchPolicy: 'no-cache',
  })
  const genre_result = useQuery(GENRES)

  if (!props.show || result.loading) {
    return null
  }

  const books = result.data.allBooks

  const genres = genre_result.data.allBooks
  let minigenres = []
  genres.forEach((element) => {
    minigenres = minigenres.concat(element.genres)
  })
  const genreSet = new Set(minigenres)

  return (
    <div>
      <h2>books</h2>

      <div>{genreToSearch ? `in genre ${genreToSearch}` : 'in all genres'}</div>

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
      <h2>Genres</h2>
      {[...genreSet].map((a) => (
        <button key={a} onClick={() => setgenreToSearch(a)}>
          {a}
        </button>
      ))}
      <button onClick={() => setgenreToSearch(null)}>all genres</button>
    </div>
  )
}

export default Books

