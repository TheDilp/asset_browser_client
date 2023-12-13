import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
function App() {
  return (
    <main className="bg-zinc-900 h-screen w-screen">
      <h1 className="shadow capitalize border-b border-zinc-700 py-4 flex items-center justify-center gap-x-2 text-4xl font-bold min-h-[4.5rem] bg-zinc-900 text-white">
        <div className="flex items-center w-full gap-x-2">
          {/* {slug !== "dnd" ? (
            <a
              href={`/${slug?.split("/").slice(0, -1).join("/")}`}
              className="mr-auto ml-4"
            >
              <Icon name="ph:caret-left" size={36} />
            </a>
          ) : (
            <div className="w-9 mr-auto" />
          )} */}
          <span className="flex-1 flex justify-center gap-x-2">
            {/* <span>{pageTitle}</span> */}
            {/* {slug !== "dnd" ? (
              <button
                className="w-10 hover:text-blue-400 transition-colors active:text-blue-200"
                id="uploadBtn"
              >
                <Icon icon="ph:upload" />
              </button>
            ) : null} */}
          </span>

          <select
            className="text-base mr-4 p-1 rounded text-white bg-zinc-800"
            id="userSelect"
          >
            <option value="">Select user</option>
            <option value="arctur">Arctur</option>
            <option value="david">David</option>
            <option value="marija">Marija</option>
          </select>
        </div>
        <input
          type="file"
          className="hidden"
          name="files"
          id="uploadInput"
          // data-path={slug}
        />
      </h1>
      <BrowserRouter>
        <Routes>
          <Route path="/search" element={"Search"} />
          <Route path="/*" element={"TEST"} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
