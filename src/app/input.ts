import { Vec2 } from '../core/utils/math';

export enum ButtonState {
  BUTTON_UP,
  BUTTON_DOWN
}

export enum KeyState {
  KEY_UP,
  KEY_DOWN
}

export enum KeyCode {
  KEY_A = 'KeyA',
  KEY_D = 'KeyD',
  KEY_S = 'KeyS',
  KEY_W = 'KeyW'
}

interface InputState {
  mouseX: number;
  mouseY: number;
  mouseButtonStates: Array<ButtonState>;
  keyStates: Map<string, KeyState>;
}

const _inputState: InputState = {
  mouseX: 0,
  mouseY: 0,
  mouseButtonStates: [],
  keyStates: new Map()
};

window.addEventListener('mousedown', (event: MouseEvent) => {
  _inputState.mouseButtonStates[event.button] = ButtonState.BUTTON_DOWN;
});

window.addEventListener('mouseup', (event: MouseEvent) => {
  _inputState.mouseButtonStates[event.button] = ButtonState.BUTTON_UP;
});

window.addEventListener('mousemove', (event: MouseEvent) => {
  _inputState.mouseX = event.clientX;
  _inputState.mouseY = event.clientY;
})

window.addEventListener('keydown', (event: KeyboardEvent) => {
  _inputState.keyStates.set(event.code, KeyState.KEY_DOWN);
});

window.addEventListener('keyup', (event: KeyboardEvent) => {
  _inputState.keyStates.set(event.code, KeyState.KEY_UP);
});

export function inputGetMousePosition(): Vec2 {
  return [_inputState.mouseX, _inputState.mouseY];
}

export function inputGetMouseButtonState(index: number): ButtonState {
  return _inputState.mouseButtonStates[index] ?? ButtonState.BUTTON_UP;
}

export function inputGetKeyState(keyCode: string): KeyState {
  return _inputState.keyStates.get(keyCode) ?? KeyState.KEY_UP;
}
