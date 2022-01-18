
import * as ReactDOM from "react-dom";
import * as React from "react";
import {useEffect, useState} from "react";
import {Routes, Route, Link, BrowserRouter, useNavigate} from "react-router-dom";


const MOVIES = [
    {
        title: "movie1",
        plot: "plot1",
        year: "2001"
    },
    {
        title: "movie2",
        plot: "plot2",
        year: "2002"
    }
]

function Frontpage() {
    return <div>
    <h1>Kristiania Movie Database</h1>
    <ul>
        <li><Link to={"/movies"}>List movies</Link></li>
        <li><Link to={"/movies/new"}>New movie</Link></li>
    </ul>
        </div>
}

function ListMovies({moviesApi}) {
    const [movies, setMovies] = useState();
    useEffect( async () => {
        setMovies(undefined);
        setMovies(await moviesApi.listMovies());
    }, []);

    if (!movies){
        return <div>Loading...</div>
    }


    return <div>
        <h1>List movies</h1>
        {movies.map(m =>

            <div key={m.title}>
                <h2>{m.title} ({m.year})</h2>
                <div>{m.plot}</div>

            </div>
        )}
    </div>;
}

function NewMovie(onAddMovie) {
    const [title, setTitle] = useState("");
    const [year, setYear] = useState("");
    const [plot, setPlot] = useState("");

    const navigate = useNavigate();


    async function handleSubmit(e){
        e.preventDefault();
         await moviesApi.onAddMovie({title, year, plot});
        navigate("/");
    }

    return <form onSubmit={handleSubmit}>
        <h1>New movie</h1>
        <div>
            <label>Title: <input value={title} onChange={e => setTitle(e.target.value)}/></label>
        </div>
        <div>
            <label>Year: <input value={year} onChange={e => setYear(e.target.value)}/></label>
        </div>
        <div>
        <label>Plot: <textarea value={plot} onChange={e => setPlot(e.target.value)}/></label>
        </div>
        <button>Submit</button>
    </form>

}

function Application() {
    const moviesApi = {
        onAddMovie: async (m) => MOVIES.push(m),
        listMovies: async () => MOVIES
    }

    return <BrowserRouter>
        <Routes>
            <Route path={"/"} element={<Frontpage/>}/>
            <Route path={"/movies/new"} element={<NewMovie moviesApi={moviesApi}/>}/>
            <Route path="/movies" element={<ListMovies moviesApi={moviesApi} />}/>
        </Routes>
    </BrowserRouter>
}

ReactDOM.render(
    <Application/>,
    document.getElementById("app")
)