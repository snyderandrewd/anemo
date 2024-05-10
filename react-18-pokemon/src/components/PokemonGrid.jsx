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
        console.log('FETCHED FROM CACHE', console.log(data))
    } else {
        console.log('FETCHED FROM API')
        const data = use(fetchData(url))
        localStorage.setItem('pokemon-cards', JSON.stringify(data))
    }

    

    return (
        <div className={styles.pokemonGrid}>
            <h1 className={styles.header}>POKEMON</h1>
            <div className={styles.listContainer}>
                <input placeholder='Search Pokemon' value={search} onChange={(e) => setSearch(e.target.value)} />
                {data.results.filter(val => {
                        return val.name.includes(search.toLowerCase())
                }).slice(0, 20).map((pokemon, pokemonIndex) => {
                    return (
                        <div onClick={handleSelectPokemon(pokemon.name)} key={pokemonIndex} className={styles.pokemon}>
                            {pokemon.name}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
