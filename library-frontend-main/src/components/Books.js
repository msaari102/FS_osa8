const Books = (props) => {
  if (!props.show) {
    return null
  }
  let minigenres = []
  props.genres.forEach((element) => {
    minigenres = minigenres.concat(element.genres)
  })
  const genreSet = new Set(minigenres)

  return (
    <div>
      <h2>books</h2>

      <div>
        {props.genreToSearch
          ? `in genre ${props.genreToSearch}`
          : 'in all genres'}
      </div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {props.books.map((a) => (
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
        <button key={a} onClick={() => props.setgenreToSearch(a)}>
          {a}
        </button>
      ))}
      <button onClick={() => props.setgenreToSearch(null)}>all genres</button>
    </div>
  )
}

export default Books

