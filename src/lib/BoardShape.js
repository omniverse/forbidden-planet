/*
  An array impersonating a double linked list.
  A representation of a polygon or collection of lines.
*/

export default function BoardShape(elArray) {
  const elements = (Array.isArray(elArray[0]) ? elArray.map((pt) => new Phaser.Point(pt[0], pt[1])) : elArray);

  return {
    element: (pos) => elements[pos !== undefined ? pos : 0],
    next: (pos) => (pos + 1 === elements.length ? 0 : pos + 1),
    prev: (pos) => (pos - 1 < 0 ? elements.length - 1 : pos - 1),
    map: (tx) => BoardShape(elements.map(tx)),
    iter: (fnc) => elements.forEach((el,ix) => { fnc(el,ix)} )
  }
}
