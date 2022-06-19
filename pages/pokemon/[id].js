import { gql } from '@apollo/client';
import client from '../../apollo-client';
import Head from 'next/head';
//import styles from '../../styles/Pokemon.module.css';
import Link from 'next/link';

export default function Pokemon({ pokemon, sprite }) {
  console.log(pokemon, sprite);
  const zeroPadding = (num, len) => {
    // 指定した数値の前に指定した桁数分0を追加したあと、後ろから0桁を返す
    return (Array(len).join('0') + num).slice(-len);
  };
  return (
    <>
      <Head>
        <title>{pokemon.name}</title>
      </Head>
      {/* <section className={styles.section}> */}
      <section>
        <h1>No.{zeroPadding(pokemon.id + 1, 3)}</h1>
        <img className={pokemon_image} src={sprite} alt={pokemon.name} />
        <h2> {pokemon.name}</h2>
        <div>
          {pokemon.pokemon_v2_pokemontypes.map((type) => {
            return (
              <a key={type.pokemon_v2_type.name}>{type.pokemon_v2_type.name}</a>
            );
          })}
        </div>
      </section>
      {/* <p className='mt-10 text-center'> */}
      <Link href='/'>
        <a>
          <button className='focus:outline-none text-white text-sm py-2.5 px-5 rounded-md bg-blue-500 hover:bg-blue-700 hover:shadow-lg'>
            一覧に戻る
          </button>
        </a>
      </Link>
      {/* </p> */}
    </>
  );
}
//getServerSidePropsを利用してデータを取得しページに表示させる
export async function getServerSideProps({ params }) {
  const pokemonSprite = await fetch(
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${params.id}.png`
  );
  const sprite = pokemonSprite.url;
  //Appllo のデータ呼び出す
  const { data } = await client.query({
    query: gql`
      query GetPokemon {
        pokemon_v2_pokemon(where: {id: {_eq: ${params.id}}}) {
          id
          name
          pokemon_v2_pokemonstats {
            base_stat
            pokemon_v2_stat {
              name
            }
          }
          pokemon_v2_pokemontypes {
            pokemon_v2_type {
              name
            }
          }
        }
      }
    `,
  });

  return {
    props: {
      pokemon: data.pokemon_v2_pokemon[0],
      sprite,
    },
  };
}
