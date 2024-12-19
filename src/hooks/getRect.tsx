import { useState, useLayoutEffect, MutableRefObject } from "react";

function useClientRect(ref: MutableRefObject<HTMLDivElement>) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }
    const getRect = () => setRect(node?.getBoundingClientRect());
    getRect();
    window.addEventListener("resize", getRect);
    return () => {
      window.removeEventListener("resize", getRect);
    };
  }, [ref]);
  return rect;
}
export default useClientRect;

export const getRect = (
  node: HTMLElement | null,
  parent?: HTMLElement | null
) => {
  let clientRect;
  if (node !== null) {
    clientRect = node.getBoundingClientRect() as DOMRect;
    parent?.addEventListener("scroll", () => {
      if (node) {
        clientRect = node.getBoundingClientRect() as DOMRect;
      }
    });
    window?.addEventListener("scroll", () => {
      if (node) {
        clientRect = node.getBoundingClientRect() as DOMRect;
      }
    });
  }
  return clientRect;
};
