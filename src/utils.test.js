/* eslint-env jest */

const {
  Closest,
  isNodeFocusable,
  isDirectionAndOrientationMatching,
  isNodeInPath,
  isNodeInPaths,
  _findChildWithMatchingIndexRange,
  _findChildWithClosestIndex,
  _findChildWithIndex
} = require('./utils')

describe('Closest()', () => {
  it('find the closest when number exists in array as first value', () => {
    const values = [1, 3, 5, 7, 9]
    const match = Closest(values, 1)

    expect(match).toEqual(1)
  })

  it('find the closest when number exists in array as last value', () => {
    const values = [1, 3, 5, 7, 9]
    const match = Closest(values, 9)

    expect(match).toEqual(9)
  })

  it('find the closest when number exists in array as middle value', () => {
    const values = [1, 3, 5, 7, 9]
    const match = Closest(values, 5)

    expect(match).toEqual(5)
  })

  it('find the closest, number not in array, obviously above a value', () => {
    const values = [1, 10, 20]
    const match = Closest(values, 11)

    expect(match).toEqual(10)
  })

  it('find the closest, number not in array, obviously below a value', () => {
    const values = [1, 10, 20]
    const match = Closest(values, 9)

    expect(match).toEqual(10)
  })

  it('find the closest, number is between 2 values in array - round down', () => {
    const values = [1, 3, 5]
    const match = Closest(values, 2)

    expect(match).toEqual(1)
  })
})

describe('isNodeFocusable()', () => {
  it('node should be focusable, it has a selectAction', () => {
    const node = {
      selectAction: true
    }

    expect(isNodeFocusable(node)).toEqual(true)
  })

  it('node should be focusable, it has isFocusable true', () => {
    const node = {
      isFocusable: true
    }

    expect(isNodeFocusable(node)).toEqual(true)
  })

  it('node should not be focusable, it has isFocusable but its false', () => {
    const node = {
      isFocusable: false
    }

    expect(isNodeFocusable(node)).toEqual(false)
  })

  it('node should not be focusable, it has neither a selectAction nor isFocusable', () => {
    const node = {
      x: true
    }

    expect(isNodeFocusable(node)).toEqual(false)
  })
})

describe('isDirectionAndOrientationMatching()', () => {
  test('vertical and up is true', () => {
    expect(isDirectionAndOrientationMatching('vertical', 'up')).toEqual(true)
  })
  test('vertical and down is true', () => {
    expect(isDirectionAndOrientationMatching('vertical', 'down')).toEqual(true)
  })
  test('horizontal and left is true', () => {
    expect(isDirectionAndOrientationMatching('horizontal', 'left')).toEqual(true)
  })
  test('horizontal and right is true', () => {
    expect(isDirectionAndOrientationMatching('horizontal', 'right')).toEqual(true)
  })
  test('vertical and left is false', () => {
    expect(isDirectionAndOrientationMatching('vertical', 'left')).toEqual(false)
  })
  test('vertical and right is false', () => {
    expect(isDirectionAndOrientationMatching('vertical', 'right')).toEqual(false)
  })
  test('horizontal and up is false', () => {
    expect(isDirectionAndOrientationMatching('horizontal', 'up')).toEqual(false)
  })
  test('horizontal and down is false', () => {
    expect(isDirectionAndOrientationMatching('horizontal', 'down')).toEqual(false)
  })
})

describe('isNodeInPath()', () => {
  it('node id is halfway through path', () => {
    const node = {
      id: 'y'
    }
    const path = 'x.y.z'

    expect(isNodeInPath(path, node)).toEqual(true)
  })

  it('node id is at start of path', () => {
    const node = {
      id: 'x'
    }
    const path = 'x.y.z'

    expect(isNodeInPath(path, node)).toEqual(true)
  })

  it('node id is at end of path', () => {
    const node = {
      id: 'z'
    }
    const path = 'x.y.z'

    expect(isNodeInPath(path, node)).toEqual(true)
  })

  it('node id is not in path', () => {
    const node = {
      id: 'z'
    }
    const path = '1.2.3'

    expect(isNodeInPath(path, node)).toEqual(false)
  })
})

describe('isNodeInPaths()', () => {
  it('node id is in one of paths', () => {
    const node = {
      id: 'y'
    }
    const paths = ['x.y.z', 'a.b.c']

    expect(isNodeInPaths(paths, node)).toEqual(true)
  })

  it('node id is not in one of paths', () => {
    const node = {
      id: 'y'
    }
    const paths = ['1.2.3', 'a.b.c']

    expect(isNodeInPaths(paths, node)).toEqual(false)
  })
})

describe('_findChildWithMatchingIndexRange()', () => {
  it('has a child with an index range that encompasses the index', () => {
    const node = {
      id: 'a',
      children: {
        x: {
          id: 'x',
          indexRange: [0, 1]
        },
        y: {
          id: 'y',
          indexRange: [2, 3]
        }
      }
    }

    const found = _findChildWithMatchingIndexRange(node, 2)

    expect(found.id).toEqual('y')
  })

  it('has a child with an index range that encompasses the index, first child', () => {
    const node = {
      id: 'a',
      children: {
        x: {
          id: 'x',
          indexRange: [0, 1]
        },
        y: {
          id: 'y',
          indexRange: [2, 3]
        }
      }
    }

    const found = _findChildWithMatchingIndexRange(node, 0)

    expect(found.id).toEqual('x')
  })

  it('does not have a child with an index range that encompasses the index', () => {
    const node = {
      id: 'a',
      children: {
        x: {
          id: 'x',
          indexRange: [0, 1]
        },
        y: {
          id: 'y',
          indexRange: [2, 3]
        }
      }
    }

    const found = _findChildWithMatchingIndexRange(node, 6)

    expect(found).toEqual(undefined)
  })
})

describe('_findChildWithClosestIndex()', () => {
  it('find the child with the exact index', () => {
    const node = {
      id: 'root',
      children: {
        a: {
          id: 'a',
          index: 0
        },
        b: {
          id: 'b',
          index: 1
        },
        c: {
          id: 'c',
          index: 2
        }
      }
    }

    const found = _findChildWithClosestIndex(node, 1)

    expect(found.id).toEqual('b')
  })

  it('find the child with closest index, lower', () => {
    const node = {
      id: 'root',
      children: {
        a: {
          id: 'a',
          index: 0
        },
        b: {
          id: 'b',
          index: 1
        },
        c: {
          id: 'c',
          index: 2
        }
      }
    }

    const found = _findChildWithClosestIndex(node, 5)

    expect(found.id).toEqual('c')
  })

  it('find the child with closest index, higher', () => {
    const node = {
      id: 'root',
      children: {
        a: {
          id: 'a',
          index: 0
        },
        b: {
          id: 'b',
          index: 5
        },
        c: {
          id: 'c',
          index: 10
        }
      }
    }

    const found = _findChildWithClosestIndex(node, 4)

    expect(found.id).toEqual('b')
  })

  it('find the child via an indexRange, so return the active child (when its focusable)', () => {
    const node = {
      id: 'root',
      activeChild: 'b',
      children: {
        a: {
          id: 'a',
          isFocusable: true,
          index: 0
        },
        b: {
          id: 'b',
          isFocusable: true,
          index: 1
        },
        c: {
          id: 'c',
          isFocusable: true,
          index: 2
        }
      }
    }

    const found = _findChildWithClosestIndex(node, 0, [1, 2])

    expect(found.id).toEqual('b')
  })

  it('find the child via an indexRange, but the active ISNT in the index range, so do it by the passed index', () => {
    const node = {
      id: 'root',
      activeChild: 'a',
      children: {
        a: {
          id: 'a',
          index: 0
        },
        b: {
          id: 'b',
          index: 1
        },
        c: {
          id: 'c',
          index: 2
        },
        d: {
          id: 'd',
          index: 5
        }
      }
    }

    const found = _findChildWithClosestIndex(node, 5, [1, 2])

    expect(found.id).toEqual('d')
  })
})

describe('_findChildWithIndex()', () => {
  it('get the child with the index, child exists', () => {
    const node = {
      id: 'root',
      children: {
        a: {
          id: 'a',
          index: 0
        },
        b: {
          id: 'b',
          index: 1
        },
        c: {
          id: 'c',
          index: 2
        }
      }
    }

    const found = _findChildWithIndex(node, 1)
    expect(found.id).toEqual('b')
  })

  it('get the child with the index, child exists as first child', () => {
    const node = {
      id: 'root',
      children: {
        a: {
          id: 'a',
          index: 0
        },
        b: {
          id: 'b',
          index: 1
        },
        c: {
          id: 'c',
          index: 2
        }
      }
    }

    const found = _findChildWithIndex(node, 0)
    expect(found.id).toEqual('a')
  })

  it('get the child with the index, child exists as last child', () => {
    const node = {
      id: 'root',
      children: {
        a: {
          id: 'a',
          index: 0
        },
        b: {
          id: 'b',
          index: 1
        },
        c: {
          id: 'c',
          index: 2
        }
      }
    }

    const found = _findChildWithIndex(node, 2)
    expect(found.id).toEqual('c')
  })

  it('get the child with the index, child does not exist', () => {
    const node = {
      id: 'root',
      children: {
        a: {
          id: 'a',
          index: 0
        },
        b: {
          id: 'b',
          index: 1
        },
        c: {
          id: 'c',
          index: 2
        }
      }
    }

    const found = _findChildWithIndex(node, 5)
    expect(found).toEqual(null)
  })
})
