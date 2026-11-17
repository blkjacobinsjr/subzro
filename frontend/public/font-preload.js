if (location.pathname === "/") {
  ["/fonts/allo/AlloVariableFriendly.woff2"].forEach((href) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "font";
    link.type = "font/woff2";
    link.crossOrigin = "anonymous";
    link.href = href;
    document.head.appendChild(link);
  });
}
