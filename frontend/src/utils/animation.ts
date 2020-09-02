import {Dispatch, SetStateAction} from "react";

import {ANIMATION_UNMOUNT_DURATION} from "./constants";
import {Animation} from "./typing";


/**
 * Set the item animation to unmount and wait until it finishes.
 * @param setAnimation  The function to set the animation.
 */
export async function waitForUnmountAnimation(setAnimation:  Dispatch<SetStateAction<Animation>>): Promise<void> {
    setAnimation('unmount')
    await new Promise(r => setTimeout(r, ANIMATION_UNMOUNT_DURATION))
}