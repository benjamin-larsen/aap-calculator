// src/jsx.d.ts

declare namespace JSX {
  /**
   * 1. Define what your final rendered output looks like.
   * Replace 'any' with your framework node type (e.g., HTMLElement, VNode, string).
   */
  type Element = any; 

  /**
   * 2. Map object-style components to ElementClass.
   * This specific mapping tells TypeScript that objects with a 'render' method 
   * are valid JSX targets.
   */
  interface ElementClass {
    render(): Element;
  }

  /**
   * 3. Define where TypeScript looks for properties on your object component.
   * If your render method accepts props (e.g., render(props)), or if your 
   * object has a props key, define it here.
   */
  interface ElementAttributesProperty {
    // Tells TS to check a 'props' object if your component defines one
    props: {}; 
  }

  /**
   * 4. Allow standard HTML tag strings
   */
  interface IntrinsicElements {
    [elemName: string]: any; 
  }
}
