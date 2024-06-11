class InputHandler {
    private _keys: { [key: string]: boolean } = {}

    constructor() {
        window.addEventListener('keydown', (e) => {
            this._keys[e.key] = true
        })

        window.addEventListener('keyup', (e) => {
            this._keys[e.key] = false
        })
    }

    isKeyDown(key: string): boolean {
        return this._keys[key] || false
    }
}

export default InputHandler
