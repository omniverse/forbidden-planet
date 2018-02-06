import Phaser from 'phaser'
import colors from './colors'
import helpers from './helpers'

const MOVEMENT_DELAY = 100;

export default class Ship {
  constructor (game, board, outerPoints, pos) {
    this.game = game;

    const shape = new Phaser.Graphics(this.game, 0, 0)
    this.shape = shape
    this.outerPoints = outerPoints
    this.extraPoints = board.createShape(0.9)
    this.movementTimer = 0;

    this.pos = pos
    this.drawShip(this.pos)

    board.add(this.shape)
  }

  nextPos () {
    if(this.movementTimer < this.game.time.now) {
      this.pos = (this.pos + 1 === this.outerPoints.length ? 0 : this.pos + 1)
      this.drawShip(this.pos)
      this.movementTimer = this.game.time.now + MOVEMENT_DELAY;
    }
  }

  prevPos () {
    if(this.movementTimer < this.game.time.now) {
      this.pos = (this.pos - 1 < 0 ? this.outerPoints.length - 1 : this.pos - 1)
      this.drawShip(this.pos)
      this.movementTimer = this.game.time.now + MOVEMENT_DELAY;
    }
  }

  drawShip (pos) {
    this.shape.clear()
    this.shape.lineStyle(4, colors.CONTRAST)
    const pt1 = this.outerPoints[pos]
    const pt2 = helpers.next(this.outerPoints, pos)
    const midPoint = {
      x: (this.extraPoints[pos].x + helpers.next(this.extraPoints, pos).x) / 2,
      y: (this.extraPoints[pos].y + helpers.next(this.extraPoints, pos).y) / 2
    }

    this.shape.x = pt1.x
    this.shape.y = pt1.y
    this.shape.lineTo(midPoint.x - pt1.x, midPoint.y - pt1.y)
    this.shape.lineTo(pt2.x - pt1.x, pt2.y - pt1.y)
    this.shape.lineTo(helpers.next(this.extraPoints, pos).x - pt1.x, helpers.next(this.extraPoints, pos).y - pt1.y)
    this.shape.lineTo(this.extraPoints[pos].x - pt1.x, this.extraPoints[pos].y - pt1.y)
    this.shape.lineTo(0, 0)
  }

  explode () {
  }
}
