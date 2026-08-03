import React, { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = ({ children }) => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (!("scrollRestoration" in window.history)) return undefined;
    const previousValue = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => { window.history.scrollRestoration = previousValue; };
  }, []);

  useLayoutEffect(() => {
    const resetScroll = () => {
      const pageTop = document.getElementById("page-top");
      pageTop?.scrollIntoView({ block: "start", inline: "nearest", behavior: "auto" });
      if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    resetScroll();
    const frame = window.requestAnimationFrame(resetScroll);
    const timers = [0, 50, 150, 350].map(delay => window.setTimeout(resetScroll, delay));
    return () => {
      window.cancelAnimationFrame(frame);
      timers.forEach(timer => window.clearTimeout(timer));
    };
  }, [pathname, search]);
  return children;
};

export default ScrollToTop;
