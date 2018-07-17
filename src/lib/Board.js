import Colors from './Colors'
import Phaser from 'phaser'
import RailMonster from './RailMonster'
import Ship from './Ship'
import BulletGroup from './BulletGroup'
import BoardShape from './BoardShape'

const defaultPoints = [
   [1, 1], [1, 5], [1, 8], [3, 7], [8, 8], [8, 4], [7, 4], [8, 1], [4, 2]
  //[1, 4], [4, 8], [8, 4], [4, 1]
]

const SPACING = 80
const GAME_SIZE = 800
const BOARD_OFFSET = -5

export default class Board extends Phaser.Group {
  constructor (game, pointsArray = defaultPoints) {
    super(game)
    this.boardshape = BoardShape(pointsArray).map((pt) => [pt.x + BOARD_OFFSET, pt.y + BOARD_OFFSET])
    this.graphics = new Phaser.Graphics(game, 0, 0)
    this.x = GAME_SIZE / 2
    this.y = GAME_SIZE / 2
    this.add(this.graphics)
    this.game = game

    this.innerPoints = this.resizeShape(this.boardshape, 3);
    this.outerPoints = this.resizeShape(this.boardshape, 1);

    this.drawShape(this.outerPoints, Colors.HI)
    this.drawShape(this.innerPoints, Colors.MLIGHT)

    this.cornerRails = this.calcCornerRails(this.outerPoints, this.innerPoints)
    this.monsterPaths = this.calcMonsterPaths(this.cornerRails)
    this._drawLines(this.cornerRails, Colors.LIGHT)
    // this._drawLines(this.monsterPaths, Colors.MLIGHT)

    this.centerPoint = { x: GAME_SIZE/2, y: GAME_SIZE/2}
    this.monsters = []
    this.monsterPaths.map((line, i) => {
      this.placeMonster(new Phaser.Line(line.start.x, line.start.y, line.end.x, line.end.y))
    })

    this.ship = new Ship(game, this, this.boardshape)
    this.bullets = new BulletGroup(game, this)
  }

  resizeShape(shape, shrinkfactor) {
    const SHRINK = SPACING / shrinkfactor
    const OFFSET = (SPACING - SHRINK)
    return shape.map((pt) => [pt.x * SHRINK + OFFSET/2, pt.y * SHRINK + OFFSET/2])
  }

  drawShape(shape, color) {
    this._drawLines(this._buildPoly(shape), color)
  }

  _buildPoly (shape) {
    return shape.map((pt, pos) => {
      const cur = shape.element(pos);
      const next = shape.element(shape.next(pos));
      return new Phaser.Line(cur.x, cur.y, next.x, next.y)
    })
  }

  _drawLines (lines, color) {
    this.graphics.lineStyle(1, color)

    lines.iter( (line) => {
      this.graphics.moveTo(line.start.x, line.start.y)
      this.graphics.lineTo(line.end.x, line.end.y)
    })

    return lines
  }

  calcCornerRails(outerPoints, innerPoints) {
    const cornerRails = []

    outerPoints.iter((pt, ix) => {
      cornerRails.push(new Phaser.Line(
          innerPoints.element(ix).x, innerPoints.element(ix).y,
          outerPoints.element(ix).x, outerPoints.element(ix).y))
    })

    return BoardShape(cornerRails)
  }

  calcMonsterPaths(cornerRails) {
    return cornerRails.map((line, i) => {
      const next = cornerRails.element(cornerRails.next(i))
      const midStart = {
        x: (line.start.x + next.start.x) / 2,
        y: (line.start.y + next.start.y) / 2
      }
      const midEnd = {
        x: (line.end.x + next.end.x) / 2,
        y: (line.end.y + next.end.y) / 2
      }
      return new Phaser.Line(midStart.x, midStart.y, midEnd.x, midEnd.y)
    })
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

  detectCollisions () {
    this.bullets.bullets.forEach( b => {
      if (b.isActive) {
        this.monsters.forEach( m => {
          if ((Math.abs(m.shape.x - b.shape.x) < 5) &&
              (Math.abs(m.shape.y - b.shape.y) < 5)) {
            m.explode()
            b.deactivate()
          }
        })
      }
    })
  }

  update () {
    this.angle += -0.3

    if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
      this.bullets.fireBullet(this.ship.midPoint(), this.monsterPaths.element(this.ship.position()).start)
    }

    this.bullets.update();


    if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
      this.ship.prevPos()
    } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
      this.ship.nextPos()
    }

    this.monsters.forEach((mo) => {
      mo.update()
    })

    this.detectCollisions()
  }

  render () {

  }
}
