import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Recommend from './components/Recommend'
import LoginForm from './components/LoginForm'
import { useQuery, useApolloClient, useSubscription } from '@apollo/client'
import { ME, BOOK_ADDED, GENRES, FIND_GENRE_BOOKS } from './queries'

const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null
  }
  return <div style={{ color: 'red' }}>{errorMessage}</div>
}

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const client = useApolloClient()
  const [genreToSearch, setgenreToSearch] = useState(null)
  const books_result = useQuery(FIND_GENRE_BOOKS, {
    variables: { genreToSearch },
    fetchPolicy: 'cache-and-network',
  })
  const genre_result = useQuery(GENRES)
  const user = useQuery(ME, {
    fetchPolicy: 'no-cache',
  })

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      window.alert(`${addedBook.title} added`)
    },
  })

  if (user.loading || genre_result.loading || books_result.loading) return null

  const genres = genre_result.data.allBooks

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const logout = () => {
    setToken(null)
    setPage('authors')
    localStorage.clear()
    client.resetStore()
  }

  const books_select = () => {
    setgenreToSearch(null)
    setPage('books')
  }

  const recommend_books = () => {
    setgenreToSearch(favoriteGenre)
    setPage('recommendations')
  }

  const favoriteGenre = user.data.me ? user.data.me.favoriteGenre : null

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={books_select}>books</button>
        {token ? (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={recommend_books}>recommend</button>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage('login')}>login</button>
        )}
      </div>

      <Notify errorMessage={errorMessage} />

      <LoginForm
        setToken={setToken}
        setError={notify}
        show={page === 'login'}
      />

      <Authors show={page === 'authors'} token={token} />

      <Books
        show={page === 'books'}
        setgenreToSearch={setgenreToSearch}
        genreToSearch={genreToSearch}
        books={books_result.data.allBooks}
        genres={genres}
      />

      <Recommend
        show={page === 'recommendations'}
        books={books_result.data.allBooks}
        favoriteGenre={favoriteGenre}
      />

      <NewBook show={page === 'add'} />
    </div>
  )
}

export default App
