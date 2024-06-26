import React, { use, useState } from 'react'
import styles from './pokemongrid.module.css'

async function fetchData(url) {
    const res = await fetch(url)
    return res.json()
}

export default function PokemonGrid(props) {
    const { handleSelectPokemon, url } = props
    const [search, setSearch] = useState('')
    let data
    if (localStorage.getItem('pokemon-cards')) {
        data = JSON.parse(localStorage.getItem('pokemon-cards'))
    } else {
        const data = use(fetchData(url))
        localStorage.setItem('pokemon-cards', JSON.stringify(data))
    }

    

    return (
        <div className='container-fluid flex-grow-1 bg-bdark'>
            <div>
                <h1 className='display-1 text-center text-light mt-4'>Pokemon</h1>
                <div className='row justify-content-center my-4'>
                    <div className='col-lg-4 text-left'>
                        <input placeholder='Search for a pokemon' 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)} 
                            className='form-control bg-light'/>
                        {data.results.filter(val => {
                                return val.name.includes(search.toLowerCase())
                        }).slice(0, 10).map((pokemon, pokemonIndex) => {
                            return (
                                <div onClick={handleSelectPokemon(pokemon.name)} key={pokemonIndex}>
                                    <h6 className={`display-6 mt-4 ms-4 text-light pokemon-grid-list ${styles.pokemon}`}>
                                        {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                                    </h6>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
