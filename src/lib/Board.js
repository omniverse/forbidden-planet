import Colors from './colors'
import Phaser from 'phaser'
import RailMonster from './RailMonster'
import Ship from './Ship'
import helpers from './helpers'

const defaultPoints = [
  [1, 1], [1, 5], [1, 8], [3, 7], [8, 8], [8, 4], [7, 4], [8, 1], [4, 2]
]

const FACTOR = 80
const GAME_SIZE = 800

export default class Board extends Phaser.Group {
  constructor (game, pointsArray = defaultPoints) {
    super(game)
    this.pointsArray = pointsArray.map((pt) => { return [pt[0] - 5, pt[1] - 5] })
    this.graphics = new Phaser.Graphics(game, 0, 0)
    this.x = GAME_SIZE / 2
    this.y = GAME_SIZE / 2
    this.add(this.graphics)
    this.game = game

    this.drawOuter()
    this.drawInner()
    this.drawConnectors()

    this.monsters = []
    this.cornerlines.forEach((line, i) => {
      const next = helpers.next(this.cornerlines, i)
      const midStart = { x: (line.start.x + next.start.x) / 2, y: (line.start.y + next.start.y) / 2}
      const midEnd = { x: (line.end.x + next.end.x) / 2, y: (line.end.y + next.end.y) / 2}
      this.placeMonster(new Phaser.Line(midStart.x, midStart.y, midEnd.x, midEnd.y))
    })

    this.ship = new Ship(game, this, this.outerPoints, 0)
  }

  createShape (shrinkFactor) {
    const SHRINK = FACTOR / shrinkFactor
    const OFFSET = (FACTOR - SHRINK)
    const points = this.pointsArray.map((pt) => {
      return new Phaser.Point(pt[0] * SHRINK + OFFSET / 2, pt[1] * SHRINK + OFFSET / 2)
    })

    return points
  }

  drawOuter () {
    if (!this.outerPoints) {
      this.outerPoints = this.createShape(1)
    }

    this._drawLines(this._buildPoly(this.outerPoints), Colors.HI)
  }

  drawInner () {
    if (!this.innerPoints) {
      this.innerPoints = this.createShape(3)
    }

    this._drawLines(this._buildPoly(this.innerPoints), Colors.MLIGHT)
  }

  _buildPoly (points) {
    const lines = []
    for (var p = 0; p < points.length; p++) {
      const next = helpers.next(points, p)
      lines.push(new Phaser.Line(points[p].x, points[p].y, next.x, next.y))
    }

    return lines
  }

  _drawLines (lines, color) {
    this.graphics.lineStyle(1, color)

    lines.forEach((line) => {
      this.graphics.moveTo(line.start.x, line.start.y)// moving position of graphic if you draw mulitple lines
      this.graphics.lineTo(line.end.x, line.end.y)
    })

    return lines
  }

  drawConnectors () {
    const cornerlines = []
    const op = this.outerPoints
    const ip = this.innerPoints

    for (var p = 0; p < op.length; p++) {
      cornerlines.push(new Phaser.Line(ip[p].x, ip[p].y, op[p].x, op[p].y))
    }

    this.cornerlines = cornerlines
    this._drawLines(cornerlines, Colors.LIGHT)
  }

  placeMonster (line) {
    const startPt = {
      x: line.start.x,
      y: line.start.y
    }
    const endPt = {
      x: line.end.x,
      y: line.end.y
    }

    const onFinish = () => {}

    this.monsters.push(new RailMonster(this.game, this, startPt, endPt, onFinish))
  }

  update () {
    this.angle += -0.3

    if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
      this.ship.nextPos()
    } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
      this.ship.prevPos()
    }

    this.monsters.forEach((mo) => {
      mo.update()
    })
  }

  render () {

  }
}
