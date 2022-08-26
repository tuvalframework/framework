import { int, char } from "./float";


export interface InputProcessor {

	 keyDown ( keycode:int):boolean;

	  keyUp ( keycode:int):boolean;

	  keyTyped ( character:char):boolean;

	  touchDown ( screenX:int,  screenY:int,  pointer:int,  button:int):boolean;

	  touchUp ( screenX:int,  screenY:int,  pointer:int,  button:int):boolean;

	  touchDragged ( screenX:int,  screenY:int,  pointer:int):boolean;

	  mouseMoved ( screenX:int,  screenY:int):boolean;

	  scrolled ( amount:int):boolean;
}