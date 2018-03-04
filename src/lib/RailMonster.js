import Phaser from 'phaser'
import Colors from './Colors'

const POINT_COUNT = 400

const SPEED = [1, 10, 100]

export default class RailMonster {
  constructor (game, board, startPt, endPt, onFinish) {
    this.game = game

    const shape = new Phaser.Graphics(this.game, 0, 0)
    shape.x = startPt.x
    shape.y = startPt.y
    this.shape = shape

    this.shape.lineStyle(1, Colors.HI)
    this.shape.moveTo(-2, -2)// moving position of graphic if you draw mulitple lines
    this.shape.lineTo(3, 3)
    this.shape.moveTo(-2, 3)// moving position of graphic if you draw mulitple lines
    this.shape.lineTo(3, -2)
    board.add(this.shape)

    this.step = 0

    const path = []
    let pointsX = [startPt.x, endPt.x]
    let pointsY = [startPt.y, endPt.y]
    for (var r = 0; r <= 1; r += 1 / POINT_COUNT) {
      path.push({
        x: Phaser.Math.linearInterpolation(pointsX, r),
        y: Phaser.Math.linearInterpolation(pointsY, r)
      })
    }
    this.path = path

    this.setSpeed()
    this.movementTimer = this.game.time.now
  }

  explode () {
  }

  setSpeed () {
    this.speed = SPEED[this.game.rnd.integerInRange(0, SPEED.length - 1)]
  }

  update () {
    if (this.step >= this.path.length) {
      this.step = 0
      this.setSpeed()
    }

    this.shape.angle += 20

    if (this.movementTimer < this.game.time.now) {
      this.shape.scale.x = this.step * 5 / this.path.length
      this.shape.scale.y = this.step * 5 / this.path.length
      this.shape.x = this.path[this.step].x
      this.shape.y = this.path[this.step].y

      this.step += 1
      this.movementTimer = this.game.time.now + this.speed
    }
  }
}
