/*
  An array impersonating a double linked list.
  A representation of a polygon or collection of lines.
*/

export default function BoardShape(elArray) {
  let cur = 0;
  const elements = (Array.isArray(elArray[0]) ? elArray.map((pt) => new Phaser.Point(pt[0], pt[1])) : elArray);

  return {
    cur: (pos) => { if (pos !== undefined) cur = pos; return cur },
    element: (pos) => elements[cur],
    next: () => { cur = (cur + 1 === elements.length ? 0 : cur + 1)},
    prev: () => { cur = (cur - 1 < 0 ? cur = elements.length - 1 : cur - 1)},
    map: (tx) => BoardShape(elements.map(tx)),
    iter: (fnc) => elements.forEach((el,ix) => { fnc(el,ix)} )
  }
}
