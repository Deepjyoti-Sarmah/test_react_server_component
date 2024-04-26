import { getAll } from "../data/db.js";
import { Suspense } from 'react';

export default function Page() {
    return (
        <>
            <h1 className='text-3xl mb-3'>Spotifn't</h1>
            <Suspense fallback={<p>Loading...</p>}>
                <Albums />
            </Suspense>
        </>

    );
}

async function Albums() {
    const albums = await getAll();
    return (
        <ul>
            {albums.map((a) => (
                <li key={a.id} className='flex gap-2 items-center mb-2'>
                    <img className="w-20 aspect-sqaure" src={a.cover} alt={a.title} />
                    <div>
                        <h3 className="text-xl">{a.title}</h3>
                        <p>{a.songs.length} songs</p>
                    </div>
                </li>
            ))}
        </ul>
    );
}
