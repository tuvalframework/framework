/**
 * Example usage:
 * const hotspots = findAllDeep(element, `[slot*="hotspot"]`, 10);
 */
 const findAllDeep = (parent, selectors, depth = null) => {
    let nodes = new Set();
    let currentDepth = 1;
    const recordResult = (nodesArray) => {
      for (const node of nodesArray) {
        nodes.add(node)
      }
    }
    const recursiveSeek = _parent => {
      // check for selectors in lightdom
      recordResult(_parent.querySelectorAll(selectors));
      if (_parent.shadowRoot) {
        // check for selectors in shadowRoot
        recordResult(_parent.shadowRoot.querySelectorAll(selectors));
        // look for nested components with shadowRoots
        for (let child of [..._parent.shadowRoot.querySelectorAll('*')].filter(i => i.shadowRoot)) {
          // make sure we haven't hit our depth limit
          if (depth === null || currentDepth < depth) {
            recursiveSeek(child);
          }
        }
      }
    };
    recursiveSeek(parent);
    return nodes;
  };