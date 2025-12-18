import React from 'react'
import { Input } from './ui/input'
import { useNavigate } from 'react-router-dom'

const SearchBox = () => {
  const navigate = useNavigate();
  const [query, setQuery] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input 
        placeholder="Search by title or category..." 
        className="h-9 rounded-full bg-grey-50"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  )
}

export default SearchBox
