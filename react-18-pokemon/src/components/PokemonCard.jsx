import React, { use } from 'react'
import styles from './pokemoncard.module.css'

async function fetchData(url) {
    const res = await fetch(url)
    return res.json()
}

export default function PokemonCard(props) {
    const { selectedPokemon, clearHandler, parentUrl } = props
    const pokemonUrl = parentUrl + selectedPokemon
    const data = use(fetchData(pokemonUrl))
    console.log(data)

    return (
        <div className={styles.card}>
            <div className={styles.headerBar}>
                <h4>
                    {selectedPokemon}
                </h4>
                <div onClick={clearHandler}>X</div>
            </div>

            
            <img src={data.sprites.front_default} alt={selectedPokemon} />
            

            <div className={styles.statsContainer}>
            <h3>Stats</h3>
            {data.stats.map((stat, statIndex) => {
                return (
                    <div key={statIndex}>
                        <p><b>{stat.stat.name}</b> {stat.base_stat}</p>
                    </div>
                )
            })}
            <h3>Types</h3>
            {data.types.map((type, typeIndex) => {
                return (
                    <div key={typeIndex} className={type.type.name} id={styles.type}>
                        <p><b>{type.type.name}</b></p>
                    </div>
                )
            })}
            <h3>Height</h3>
                <p>{data.height * 10} cm</p>
            <h3>Weight</h3>
                <p>{data.weight / 10} kg</p>
            <h3>Location Areas</h3>
                
            </div>
            
        </div>
    )
}

