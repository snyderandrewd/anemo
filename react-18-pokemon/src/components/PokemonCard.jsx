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
        <div className='container-fluid border bg-bdark text-light'>
            <div className='bg-bdark text-light py-4'>
                <div className='container'>
                    <div className='row align-items-center'>
                        <div className='col-lg-9'>
                            <h1 className='display-4 mb-0' style={{ textTransform: 'capitalize' }}>
                                {selectedPokemon}
                            </h1>
                        </div>
                        <div className='col-lg-3 text-right text-lg-center'>
                            <button 
                                onClick={clearHandler} 
                                type='button' 
                                className={`btn btn-bdark btn-lg`}
                                style={{ minWidth: '100px' }} // Set minimum width for better mobile appearance
                            >
                                <i className="fas fa-arrow-left"></i> Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>

                <div className='container'>
                    <div>
                        {pokeTypes.map((type, typeIndex) => (
                            <span key={typeIndex} style={{ textTransform: 'capitalize'}} className={`badge text-bg-${type} mr-2 mb-2 fs-2`}>{type}</span>
                        ))}
                    </div>
                </div>
    
            <div className='container bg-bdark py-1'>
                <div className='row justify-content-center'>
                    <div className='col-md-6'>
                        <img 
                            src={data.sprites.front_default} 
                            alt={selectedPokemon} 
                            className='img-fluid rounded mx-auto d-block' 
                            style={{ width: '50%', height: 'auto' }} 
                        />
                    </div>
                </div>
            </div>

    
            <div className="container-fluid">
    <div className="row">
    <div className="col-md-6">
        <div className='container mb-4'>
            <div className='container'>
                <div className='bg-bdark text-light'>
                    <h4>Base Stats:</h4>
                    <div>
                    {data.stats.map((stat, statIndex) => (
                        <div key={statIndex} className='row mb-2 d-flex'>
                            <div className='col-5'>
                                <b>{stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1)}: </b>
                            </div>
                            <div className='col-5'>
                                <b>{stat.base_stat}</b>
                            </div>
                        </div>
                    ))}
                    <div className='row mb-4'></div>
                    <div className='row mb-2'>
                        <div className='col-5'>
                            <b>Height:</b>
                        </div>
                        <div className='col-5'>
                            <b>{data.height * 10} cm</b>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-5'>
                            <b>Weight:</b>
                        </div>
                        <div className='col-5'>
                            <b>{data.weight / 10} kg</b>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

        <div className="col-md-6">
            <div className='container'>
                <div className='container'>
                    <div className='bg-bdark text-light'>
                        <div>

                            {doubleWeaknesses.length > 0 &&
                                <div>
                                    <h4>Double Weaknesses:</h4>
                                    <div className='d-flex flex-wrap'>
                                        {doubleWeaknesses.map((type, typeIndex) => (
                                            <span key={typeIndex} style={{ textTransform: 'capitalize'}} className={`badge text-bg-${type} mr-2 mb-2 fs-5`}>{type}</span>
                                        ))}
                                    </div>
                                </div>
                            }

                            {weaknesses.length > 0 &&
                                <div>
                                    <h4>Weaknesses:</h4>
                                    <div className='d-flex flex-wrap'>
                                        {weaknesses.map((type, typeIndex) => (
                                            <span key={typeIndex} style={{ textTransform: 'capitalize'}} className={`badge text-bg-${type} mr-2 mb-2 fs-5`}>{type}</span>
                                        ))}
                                    </div>
                                </div>
                            }

                            {resistances.length > 0 &&
                                <div>
                                    <h4>Resistances:</h4>
                                    <div className='d-flex flex-wrap'>
                                        {resistances.map((type, typeIndex) => (
                                            <span key={typeIndex} style={{ textTransform: 'capitalize'}} className={`badge text-bg-${type} mr-2 mb-2 fs-5`}>{type}</span>
                                        ))}
                                    </div>
                                </div>
                            }

                            {doubleResistances.length > 0 &&
                                <div>
                                    <h4>Double Resistances:</h4>
                                    <div className='d-flex flex-wrap'>
                                        {doubleResistances.map((type, typeIndex) => (
                                            <span key={typeIndex} style={{ textTransform: 'capitalize'}} className={`badge text-bg-${type} mr-2 mb-2 fs-5`}>{type}</span>
                                        ))}
                                    </div>
                                </div>
                            }

                            {immunities.length > 0 &&
                                <div>
                                    <h4 display-4>Immunities:</h4>
                                    <div className='d-flex flex-wrap'>
                                        {immunities.map((type, typeIndex) => (
                                            <span key={typeIndex} style={{ textTransform: 'capitalize'}} className={`badge text-bg-${type} mr-2 mb-2 fs-5`}>{type}</span>
                                        ))}
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
            </div>
    )
}

