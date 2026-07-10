import { Canvas } from "@react-three/fiber";
import Dog from "./components/Dog";
import "./App.css";

function App() {
  return (
    <>
      <main>
        <Canvas
          style={{
            height: "100vh",
            width: "100vw",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex:1,
            backgroundImage: "url(/background-l-2.png)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          <Dog />
        </Canvas>
        <section id="section-1"></section>
        <section id="section-2"></section>
        <section id="section-3"></section>
      </main>
    </>
  );
}

export default App;
