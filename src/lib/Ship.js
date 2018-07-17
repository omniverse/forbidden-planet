import Phaser from 'phaser'
import Colors from './Colors'
import BoardShape from './BoardShape'

const MOVEMENT_DELAY = 100

export default class Ship {
  constructor (game, board, boardPoints) {
    this.game = game
    this.board = board
    this.pos = 1

    const shape = new Phaser.Graphics(this.game, 0, 0)
    this.shape = shape
    this.boardPoints = board.resizeShape(boardPoints, 1);
    this.extraPoints = board.resizeShape(boardPoints, 0.9)
    this.movementTimer = 0

    this.drawShip(1, this.boardPoints, this.extraPoints)

    board.add(this.shape)
  }

  position() {
    return this.pos
  }

  nextPos () {
    if (this.movementTimer < this.game.time.now) {
      this.pos = this.boardPoints.next(this.pos);
      this.drawShip(this.pos, this.boardPoints, this.extraPoints)
      this.movementTimer = this.game.time.now + MOVEMENT_DELAY
    }
  }

  prevPos () {
    if (this.movementTimer < this.game.time.now) {
      this.pos = this.boardPoints.prev(this.pos);
      this.drawShip(this.pos, this.boardPoints, this.extraPoints)
      this.movementTimer = this.game.time.now + MOVEMENT_DELAY
    }
  }

  drawShip (pos, boardPoints, extraPoints) {
    this.shape.clear()

    this.shape.lineStyle(4, Colors.CONTRAST)
    const bp1 = boardPoints.element(pos)
    const bp2 = boardPoints.element(boardPoints.next(pos))
    const ep1 = extraPoints.element(pos)
    const ep2 = extraPoints.element(extraPoints.next(pos))

    const midPoint = {
      x: (ep1.x + ep2.x) / 2,
      y: (ep1.y + ep2.y) / 2
    }

    this.shape.x = bp1.x
    this.shape.y = bp1.y
    this.shape.moveTo(0, 0)
    this.shape.lineTo(ep1.x - bp1.x, ep1.y - bp1.y)
    this.shape.lineTo(midPoint.x - ep1.x, midPoint.y - ep1.y)
    this.shape.lineTo(ep2.x - bp1.x, ep2.y - bp1.y)
    this.shape.lineTo(bp2.x - bp1.x, bp2.y - bp1.y)

    this.midPoint = () => midPoint
  }

  explode () {
  }
}
