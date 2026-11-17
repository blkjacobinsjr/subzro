// Compile the pinned library's bundled engine as JavaScript, without runtime eval.
export function cspIconCloud() {
  return {
    name: "csp-icon-cloud",
    enforce: "pre",
    transform(code, id) {
      if (!id.replaceAll("\\", "/").endsWith("/react-icon-cloud/dist/react-icon-cloud.esm.js")) return null;

      const engine = code.match(/var tagCanvasString = ("(?:[^"\\]|\\.)*");/);
      if (!engine) throw new Error("Unsupported react-icon-cloud engine format");

      let compiled = code.replace(engine[0], `function loadTagCanvas() { ${JSON.parse(engine[1])} }`);
      compiled = compiled.replace("eval(tagCanvasString)", "loadTagCanvas()");
      for (const method of ["Delete", "Resume", "Pause"]) {
        const call = `eval("TagCanvas.${method}('" + state.canvasId + "')")`;
        if (!compiled.includes(call)) throw new Error(`Unsupported react-icon-cloud ${method} call`);
        compiled = compiled.replace(call, `window.TagCanvas.${method}(state.canvasId)`);
      }
      const start = 'eval("TagCanvas.Start(\'" + state.canvasId + "\', null, " + ops + ")")';
      if (!compiled.includes(start)) throw new Error("Unsupported react-icon-cloud Start call");
      compiled = compiled.replace(start, "window.TagCanvas.Start(state.canvasId, null, JSON.parse(ops))");
      if (compiled.includes("eval(")) throw new Error("react-icon-cloud still contains runtime eval");
      return { code: compiled, map: null };
    },
  };
}
