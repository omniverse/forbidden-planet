import Phaser from 'phaser'
import colors from './colors'

const POINT_COUNT = 400;

export default class RailMonster {
  constructor (board, startPt, endPt, onFinish) {
    const shape = new Phaser.Graphics(board.game, 0, 0)
    shape.x = startPt.x
    shape.y = startPt.y
    this.shape = shape

    this.shape.lineStyle(1, colors.HI)
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
  }

  explode () {
  }

  update () {
    if (this.step >= this.path.length) {
      this.step = 0;
    }

    this.shape.x = this.path[this.step].x
    this.shape.y = this.path[this.step].y

    this.shape.angle += 20
    this.shape.scale.x = this.step * 5 / this.path.length
    this.shape.scale.y = this.step * 5 / this.path.length

    this.step += 1;
  }
}
