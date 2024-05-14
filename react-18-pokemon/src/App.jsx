import { useState, Suspense } from 'react'
import ErrorBoundary from './ErrorBoundary'
import PokemonCard from './components/PokemonCard'
import PokemonGrid from './components/PokemonGrid'

function App() {
  const [selectedPokemon, setSelectedPokemon] = useState(null)
  const url = 'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1025'
  const parentUrl = 'https://pokeapi.co/api/v2/pokemon/'

  function handleSelectPokemon(pokemon) {
    return () => {
      setSelectedPokemon(pokemon)
    }
  }

  return (
    <ErrorBoundary fallback={<div><h1 className='display-1'>Error...</h1><img src="https://i.pinimg.com/originals/8c/ef/c2/8cefc23a961736ece0904a4fd0d2a89c.png" className='d-block mx-auto'/></div>}>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="App">
          {selectedPokemon ? (
            <PokemonCard parentUrl={parentUrl} selectedPokemon={selectedPokemon} clearHandler={() => setSelectedPokemon(null)} />
          ) : (
            <PokemonGrid url={url} handleSelectPokemon={handleSelectPokemon} />
          )}
        </div>
      </Suspense>
    </ErrorBoundary>
  )
}

export default App
