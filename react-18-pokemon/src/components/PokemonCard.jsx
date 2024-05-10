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

    const typeChart = {
        "normal": {"weaknesses": ["fighting"], "resistances": ["ghost"], "immunities": []},
        "fire": {"weaknesses": ["water", "rock", "ground"], "resistances": ["fire", "grass", "ice", "bug", "steel", "fairy"], "immunities": []},
        "water": {"weaknesses": ["electric", "grass"], "resistances": ["fire", "water", "ice", "steel"], "immunities": []},
        "electric": {"weaknesses": ["ground"], "resistances": ["electric", "flying", "steel"], "immunities": []},
        "grass": {"weaknesses": ["fire", "ice", "poison", "flying", "bug"], "resistances": ["water", "electric", "grass", "ground"], "immunities": []},
        "ice": {"weaknesses": ["fire", "fighting", "rock", "steel"], "resistances": ["ice"], "immunities": []},
        "fighting": {"weaknesses": ["flying", "psychic", "fairy"], "resistances": ["bug", "rock", "dark"], "immunities": []},
        "poison": {"weaknesses": ["ground", "psychic"], "resistances": ["fighting", "poison", "grass", "fairy", "bug"], "immunities": []},
        "ground": {"weaknesses": ["water", "grass", "ice"], "resistances": ["poison", "rock"], "immunities": ["electric"]},
        "flying": {"weaknesses": ["electric", "ice", "rock"], "resistances": ["fighting", "bug", "grass"], "immunities": ["ground"]},
        "psychic": {"weaknesses": ["bug", "ghost", "dark"], "resistances": ["fighting", "psychic"], "immunities": []},
        "bug": {"weaknesses": ["fire", "flying", "rock"], "resistances": ["fighting", "ground", "grass"], "immunities": []},
        "rock": {"weaknesses": ["water", "grass", "fighting", "ground", "steel"], "resistances": ["normal", "flying", "poison", "fire"], "immunities": []},
        "ghost": {"weaknesses": ["ghost", "dark"], "resistances": ["poison", "bug"], "immunities": ["normal", "fighting"]},
        "dragon": {"weaknesses": ["ice", "dragon", "fairy"], "resistances": ["fire", "water", "electric", "grass"], "immunities": []},
        "dark": {"weaknesses": ["fighting", "bug", "fairy"], "resistances": ["ghost", "dark"], "immunities": ["psychic"]},
        "steel": {"weaknesses": ["fire", "fighting", "ground"], "resistances": ["normal", "grass", "ice", "flying", "psychic", "bug", "rock", "dragon", "steel", "fairy"], "immunities": ["poison"]},
        "fairy": {"weaknesses": ["poison", "steel"], "resistances": ["fighting", "bug", "dark"], "immunities": ["dragon"]}
    };

    let pokeTypes = [];

    data.types.map(type => {
        pokeTypes.push(type.type.name);
    })

    console.log(pokeTypes)

    // Initialize category arrays
    let immunities = [];
    let doubleWeaknesses = [];
    let doubleResistances = [];
    let weaknesses = [];
    let resistances = [];

        // Function to categorize a Pokémon's types based on their interactions
    function categorizeTypes(types) {

        // Iterate through each type
        types.forEach(type => {
            const interactions = typeChart[type.toLowerCase()];
            if (interactions) {
                interactions.weaknesses.forEach(weakness => {
                    if (resistances.includes(weakness)) {
                        // Remove from resistances array if it's also a resistance
                        resistances = resistances.filter(item => item !== weakness);
                    } else if (weaknesses.includes(weakness)) {
                        // Check if it's a double weakness
                        if (!doubleWeaknesses.includes(weakness)) {
                            doubleWeaknesses.push(weakness);
                        }
                    } else {
                        weaknesses.push(weakness);
                    }
                });

                interactions.resistances.forEach(resistance => {
                    if (weaknesses.includes(resistance)) {
                        // Remove from weaknesses array if it's also a weakness
                        weaknesses = weaknesses.filter(item => item !== resistance);
                    } else if (resistances.includes(resistance)) {
                        // Check if it's a double resistance
                        if (!doubleResistances.includes(resistance)) {
                            doubleResistances.push(resistance);
                        }
                    } else {
                        resistances.push(resistance);
                    }
                });

                interactions.immunities.forEach(immunity => {
                    // Add to immunities and remove from other arrays
                    immunities.push(immunity);
                    weaknesses = weaknesses.filter(item => item !== immunity);
                    resistances = resistances.filter(item => item !== immunity);
                    doubleWeaknesses = doubleWeaknesses.filter(item => item !== immunity);
                    doubleResistances = doubleResistances.filter(item => item !== immunity);
                });
            }
        });

        // Remove duplicates from each category
        immunities = [...new Set(immunities)];
        doubleWeaknesses = [...new Set(doubleWeaknesses)];
        doubleResistances = [...new Set(doubleResistances)];
        weaknesses = weaknesses.filter(weakness => !doubleWeaknesses.includes(weakness));
        resistances = resistances.filter(resistance => !doubleResistances.includes(resistance));

        return { immunities, doubleWeaknesses, doubleResistances, weaknesses, resistances };
    }

    categorizeTypes(pokeTypes);

    return (
        <div className={styles.card}>
            <div className={styles.headerBar}>
                <h1>
                    {selectedPokemon}
                </h1>
                <div onClick={clearHandler}><b>back</b></div>
            </div>

            <img src={data.sprites.front_default} alt={selectedPokemon} />

            <div className={styles.infoContainer}>
                <div className={styles.baseStats}>
                <h3>base stats: </h3>
                {data.stats.map((stat, statIndex) => {
                    return (
                        <div key={statIndex}>
                            <p><b>{stat.stat.name}:</b> {stat.base_stat}</p>
                        </div>
                    )
                })}
                <p><b>height:</b> {data.height * 10} cm</p>
                <p><b>weight:</b> {data.weight / 10} kg</p>
                </div>

                <div className={styles.types}>
                <h3>types: </h3>
                {pokeTypes.map((type, typeIndex) => {
                    return (
                        <div key={typeIndex} className={styles.typeBox} id={type}>
                            <p><b>{type}</b></p>
                        </div>
                    )
                })}

                {doubleWeaknesses.length > 0 && <h3>double weaknesses:</h3>}
                {doubleWeaknesses.map((type, typeIndex) => {
                    return (
                        <div key={typeIndex} className={styles.typeBox} id={type}>
                            <p><b>{type}</b></p>
                        </div>
                    )
                })}

                {weaknesses.length > 0 && <h3>weaknesses:</h3>}
                {weaknesses.map((type, typeIndex) => {
                    return (
                        <div key={typeIndex} className={styles.typeBox} id={type}>
                            <p><b>{type}</b></p>
                        </div>
                    )
                })}

                {resistances.length > 0 && <h3>resistances:</h3>}
                {resistances.map((type, typeIndex) => {
                    return (
                        <div key={typeIndex} className={styles.typeBox} id={type}>
                            <p><b>{type}</b></p>
                        </div>
                    )
                })}

                {doubleResistances.length > 0 && <h3>double resistances:</h3>}
                {doubleResistances.map((type, typeIndex) => {
                    return (
                        <div key={typeIndex} className={styles.typeBox} id={type}>
                            <p><b>{type}</b></p>
                        </div>
                    )
                })}

                {immunities.length > 0 && <h3>immunities:</h3>}
                {immunities.map((type, typeIndex) => {
                    return (
                        <div key={typeIndex} className={styles.typeBox} id={type}>
                            <p><b>{type}</b></p>
                        </div>
                    )
                })}

                </div>
            </div>
            
        </div>
    )
}

