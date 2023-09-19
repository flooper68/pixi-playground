import * as P from "pixi.js";
import { createContext, useContext, useEffect, useRef } from "react";

const PixiContext = createContext<P.Application<P.ICanvas> | null>(null);

interface PixiProviderProps {
  children: React.ReactNode;
}

export function PixiProvider(props: PixiProviderProps) {
  const appRef = useRef(
    new P.Application({
      autoDensity: true,
      resolution: devicePixelRatio,
    })
  );

  useEffect(() => {
    appRef.current.stage.hitArea = appRef.current.screen;
    appRef.current.stage.eventMode = "static";

    appRef.current.ticker.add;

    document.body.appendChild(appRef.current.view as unknown as Node);

    function resize() {
      appRef.current.renderer.resize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener("resize", resize);

    resize();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <PixiContext.Provider value={appRef.current}>
      {props.children}
    </PixiContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStage() {
  const context = useContext(PixiContext);

  if (context === null) {
    throw new Error("useStage must be used within a PixiProvider");
  }

  return context.stage;
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePixiApp() {
  const context = useContext(PixiContext);

  if (context === null) {
    throw new Error("useStage must be used within a PixiProvider");
  }

  return context;
}
