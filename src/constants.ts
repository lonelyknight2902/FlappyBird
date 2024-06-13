export const GRAVITAIONAL_ACCELERATION = 1200
export const FLAP_FORCE = 200
export enum BodyType {
    RIGID_BODY = 'RIGID_BODY',
    STATIC_BODY = 'STATIC_BODY',
}
export const CANVAS_WIDTH = 450
export const CANVAS_HEIGHT = 800
export const FLAP_RATE = 5
export const BASE_SPEED = 200
export const PIPE_STARTING_OFFSET = 900
export const PIPE_DISTANCE = 400
export const PIPE_GAP = 200
export const PIPE_SOURCE = 'assets/images/pipe-green.png'
export const PIPE_FLIP_SOURCE = 'assets/images/pipe-green-flip.png'
export const FLAP_AUDIO = 'assets/audio/wing.wav'
export const POINT_AUDIO = 'assets/audio/point.wav'
export enum TriggerState {
    ENTER = 'ENTER',
    EXIT = 'EXIT',
    STAY = 'STAY',
    OUT = 'OUT',
}
export const FADE_OUT_TIME = 1000
export const ROTATION_ACCERATION = 200
export const FLAP_ROTATION_TIME = 100