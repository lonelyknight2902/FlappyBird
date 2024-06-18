import UIElement from './UIElement'

class UILayer {
    private _elements: UIElement[]
    private _nameCount: { [key: string]: number }
    constructor() {
        this._elements = []
    }

    public get elements(): UIElement[] {
        return this._elements
    }

    public getElementsByName(name: string): UIElement[] {
        return this._elements.filter((element) => element.name === name)
    }

    public addElement(element: UIElement) {
        const name = element.name
        if (this._nameCount[name]) {
            this._nameCount[name] += 1
            element.name = `${name}-${this._nameCount[name]}`
        } else {
            this._nameCount[name] = 1
        }
        this._elements.push(element)
    }

    public removeElement(element: UIElement) {
        const index = this._elements.indexOf(element)
        if (index !== -1) {
            this._elements.splice(index, 1)
        }
    }

    public removeElementByName(name: string) {
        this._elements = this._elements.filter((element) => element.name !== name)
    }

    public render(ctx: CanvasRenderingContext2D) {
        this._elements.forEach((element) => element.render(ctx))
    }
}

export default UILayer
