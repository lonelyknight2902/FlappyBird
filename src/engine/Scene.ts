import UpdateInput from '../types/update'
import { GameObject } from './GameObject'
import UIElement from './UIElement'

class Scene {
    private _gameObjects: GameObject[] = []
    private _UIElements: UIElement[] = []
    private _nameCount: { [key: string]: number } = {}
    constructor(gameObjects: GameObject[] = []) {
        console.log('Scene created')
        this._gameObjects = gameObjects
    }

    processInput(): void {
      return
  }

    public addGameObject(gameObject: GameObject): void {
        const name = gameObject.name
        if (this._nameCount[name]) {
            this._nameCount[name] += 1
            gameObject.name = `${name}-${this._nameCount[name]}`
        } else {
            this._nameCount[name] = 1
        }
        this._gameObjects.push(gameObject)
    }

    public removeGameObject(gameObject: GameObject): void {
        this._gameObjects = this._gameObjects.filter((object) => object !== gameObject)
    }

    public removeGameObjectByName(name: string): void {
        this._gameObjects = this._gameObjects.filter((object) => object.name !== name)
    }

    public get gameObjects(): GameObject[] {
        return this._gameObjects
    }

    public getGameObjectsNames(): string[] {
        return this._gameObjects.map((object) => object.name)
    }

    public getGameObjectByName(name: string): GameObject | undefined {
        return this._gameObjects.find((object) => object.name === name)
    }

    public update(updateInput: UpdateInput): void {
        this._gameObjects.forEach((gameObject) => {
            gameObject.update(updateInput)
        })
    }

    public render(ctx: CanvasRenderingContext2D): void {
        this._gameObjects.forEach((gameObject) => {
            gameObject.render(ctx)
        })
        this._UIElements.forEach((element) => {
            element.render(ctx)
        })
    }
}

export default Scene
